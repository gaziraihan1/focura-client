// src/lib/auth/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import * as argon2 from "argon2";
import { createBackendToken } from "./backendToken";
// import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";
// const BACKEND_COOKIE_NAME = isProd ? "__Secure-focura.backend" : "focura.backend";

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
          },
        });

        if (!user || !user.password) {
          try { await argon2.verify("$argon2id$v=19$m=4096,t=3,p=1$invalid", "invalid"); } catch {}
          throw new Error("Invalid credentials.");
        }

        const isValid = await argon2.verify(user.password, credentials.password);
        if (!isValid) throw new Error("Invalid credentials.");

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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
        
        // Create backend token
        token.backendToken = createBackendToken({
          id: user.id,
          email: user.email!,
          role: user.role ?? "USER",
        });
        
        console.log("✅ [NextAuth] JWT callback - backend token created");
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

    // This is called after successful sign in
    async signIn({ user, account, profile }) {
      console.log("✅ [NextAuth] Sign in successful:", user.email);
      
      // For OAuth providers, ensure user exists in DB
      if (account?.provider === "google") {
        try {
          await prisma.user.update({
            where: { email: user.email! },
            data: { lastLoginAt: new Date() },
          });
        } catch (error) {
          console.error("Failed to update last login:", error);
        }
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
    };
    backendToken?: string;
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    backendToken?: string;
  }
}