import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import * as argon2 from "argon2";
import { BACKEND_TOKEN_EXPIRY_MS, createBackendToken } from "./backendToken";

const isProd = process.env.NODE_ENV === "production";

const DUMMY_HASH =
  "$argon2id$v=19$m=4096,t=3,p=1$C29tZXNhbHQ$ZHVtbXk";

interface GoogleProfile {
  email_verified?: boolean;
  verified_email?: boolean;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid login attempt.");
        }

        const email = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            image: true,
            emailVerified: true,
          },
        });

        if (!user || !user.password) {
          await argon2.verify(DUMMY_HASH, "invalid");
          throw new Error("Invalid credentials.");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email to log in.");
        }

        const isValid = await argon2.verify(
          user.password,
          credentials.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials.");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        const { ...safeUser } = user;
        return safeUser as any;
      },
    }),
  ],
  events: {
  async linkAccount({ user, account }) {
    // This fires AFTER the account is linked, so we know it's OAuth
    if (account.provider === "google") {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }
  },
},

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";

        token.backendToken = createBackendToken({
          id: user.id,
          email: user.email!,
          role: user.role ?? "USER",
        });

        token.backendTokenExpiry =
          Date.now() + BACKEND_TOKEN_EXPIRY_MS;
      }

      if (
        token.backendToken &&
        token.backendTokenExpiry &&
        Date.now() > token.backendTokenExpiry
      ) {
        token.backendToken = createBackendToken({
          id: token.id as string,
          email: token.email as string,
          role: token.role as string,
        });

        token.backendTokenExpiry =
          Date.now() + BACKEND_TOKEN_EXPIRY_MS;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.backendToken) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.backendToken = token.backendToken as string;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const googleProfile = profile as GoogleProfile;

          const isVerified =
            googleProfile?.email_verified === true ||
            googleProfile?.verified_email === true;

          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                lastLoginAt: new Date(),
                emailVerified:
                  isVerified && !existingUser.emailVerified
                    ? new Date()
                    : existingUser.emailVerified,
                name: existingUser.name || user.name,
                image: existingUser.image || user.image,
              },
            });
          }

          return true;
        } catch (err) {
          if (!isProd) {
            console.error("Google sign-in error:", err);
          }
          return true;
        }
      }

      if (
        account?.provider === "credentials" &&
        !user.emailVerified
      ) {
        throw new Error("Please verify your email to log in.");
      }

      return true;
    },
  },

  pages: {
    signIn: "/authentication/login",
    error: "/authentication/error",
  },

  debug: !isProd && process.env.NEXTAUTH_DEBUG === "true",
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      emailVerified?: Date | null;
    };
    backendToken: string;
  }

  interface User {
    role?: string;
    emailVerified: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    backendToken: string;
    backendTokenExpiry: number;
  }
}
