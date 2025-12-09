// src/lib/auth/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import * as argon2 from "argon2";
import { createBackendToken } from "./backendToken";

const isProd = process.env.NODE_ENV === "production";

// Define Google Profile type
interface GoogleProfile {
  email_verified?: boolean;
  [key: string]: any;
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
          try { await argon2.verify("$argon2id$v=19$m=4096,t=3,p=1$invalid", "invalid"); } catch {}
          throw new Error("Invalid credentials.");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email to log in.");
        }

        const isValid = await argon2.verify(user.password, credentials.password);
        if (!isValid) throw new Error("Invalid credentials.");

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as any;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";

        // Create backend token
        token.backendToken = createBackendToken({
          id: user.id,
          email: user.email!,
          role: user.role ?? "USER",
        });
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.backendToken = token.backendToken as string;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Update last login for OAuth users
      if (account?.provider === "google") {
        try {
          const googleProfile = profile as GoogleProfile;
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              lastLoginAt: new Date(),
              // Auto-verify email for Google if profile says verified
              emailVerified: googleProfile?.email_verified ? new Date() : undefined,
            },
          });
        } catch (err) {
          console.error("Failed to update OAuth login:", err);
        }
      }

      // Block unverified email for credentials
      if (account?.provider === "credentials" && !user.emailVerified) {
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

// Extend NextAuth types
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
  }
}