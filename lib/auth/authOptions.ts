// src/lib/auth/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import * as argon2 from "argon2";
import { BACKEND_TOKEN_EXPIRY_MS, createBackendToken } from "./backendToken";

const isProd = process.env.NODE_ENV === "production";

// Define Google Profile type
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
      // ✅ Allow account linking
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
          try {
            await argon2.verify(
              "$argon2id$v=19$m=4096,t=3,p=1$invalid",
              "invalid"
            );
          } catch {}
          throw new Error("Invalid credentials.");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email to log in.");
        }

        const isValid = await argon2.verify(
          user.password,
          credentials.password
        );
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
        token.backendTokenExpiry = Date.now() + BACKEND_TOKEN_EXPIRY_MS;
      }
      
      // Refresh backend token if expired
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
        token.backendTokenExpiry = Date.now() + BACKEND_TOKEN_EXPIRY_MS;
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
      // ✅ Handle Google OAuth
      if (account?.provider === "google") {
        try {
          const googleProfile = profile as GoogleProfile;
          const isVerified =
            googleProfile?.email_verified === true ||
            googleProfile?.verified_email === true;

          // ✅ Find existing user by email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            // ✅ User exists - update and link account
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                lastLoginAt: new Date(),
                // Auto-verify email if Google says it's verified
                emailVerified: isVerified && !existingUser.emailVerified 
                  ? new Date() 
                  : existingUser.emailVerified,
                // Update profile from Google if not set
                name: existingUser.name || user.name,
                image: existingUser.image || user.image,
              },
            });

            console.log(`✅ Google login (existing user): ${user.email} - Email ${isVerified ? 'verified' : 'not verified'}`);
          } else {
            // ✅ New user - will be created by adapter
            console.log(`✅ Google login (new user): ${user.email} - Email ${isVerified ? 'verified' : 'not verified'}`);
          }

          // ✅ Always allow Google sign-in (adapter will handle account linking)
          return true;
        } catch (err) {
          console.error("Failed to process Google login:", err);
          // ✅ Allow login even if update fails
          return true;
        }
      }

      // ✅ Block unverified email ONLY for credentials provider
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
    backendTokenExpiry: number;
  }
}