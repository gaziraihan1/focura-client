// ─────────────────────────────────────────────────────────────────────────────
// Auth — NextAuth configuration
//
// Helper functions have been split into focused modules:
//   - exchange.ts — HMAC proof + backend token exchange
//   - refresh.ts  — Silent token refresh with dedup locks
//   - bridge.ts   — Internal backend bridge (audit + lockout)
//   - types.ts    — Shared type definitions
//
// This file re-exports everything for backward compatibility.
// ─────────────────────────────────────────────────────────────────────────────

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import * as argon2 from "argon2";
import crypto from "crypto";
import { verifySync as verifyTOTP } from "otplib";

import { exchangeForTokens } from "./exchange";
import { silentRefresh } from "./refresh";
import { callInternal, recordLoginFailure } from "./bridge";
import type { GoogleProfile } from "./types";

// Re-export all helpers for backward compatibility
export { createExchangeProof, exchangeForTokens } from "./exchange";
export { silentRefresh } from "./refresh";
export { callInternal, recordLoginFailure } from "./bridge";
export type { TokenResponse, RefreshResult, FailedAttemptResult, GoogleProfile } from "./types";

const isProd = process.env.NODE_ENV === "production";
const DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$ZHVtbXloYXNo";

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
      httpOptions: { timeout: 10000 },
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "TOTP Code", type: "text" },
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
            twoFactorEnabled: true,
            twoFactorSecret: true,
          },
        });
        if (!user || !user.password) {
          await argon2.verify(DUMMY_HASH, "invalid");
          throw new Error("Invalid credentials.");
        }
        if (!user.emailVerified)
          throw new Error("Please verify your email to log in.");
        const isValid = await argon2.verify(
          user.password,
          credentials.password,
        );
        if (!isValid) {
          const lock = await recordLoginFailure(email);
          if (lock?.locked) {
            const unlocksAt = Date.parse(lock.unlocksAt ?? "") || Date.now();
            const minutes = Math.max(
              1,
              Math.ceil((unlocksAt - Date.now()) / 60_000),
            );
            void callInternal("/audit", {
              event: "LOGIN_BLOCKED",
              email,
              reason: "Account locked",
              meta: { unlocksAt: lock.unlocksAt ?? null },
            });
            throw new Error(
              `Account temporarily locked due to too many failed attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
            );
          }
          throw new Error("Invalid credentials.");
        }

        // 2FA enforcement
        if (user.twoFactorEnabled) {
          if (!credentials.totpCode) {
            throw new Error("2FA_REQUIRED");
          }

          if (!user.twoFactorSecret) {
            throw new Error("Two-factor authentication is not properly configured. Please contact support.");
          }

          try {
            const totpResult = verifyTOTP({ token: credentials.totpCode, secret: user.twoFactorSecret });
            if (!totpResult.valid) {
              throw new Error("Invalid verification code. Please try again.");
            }
          } catch {
            throw new Error("Invalid verification code. Please try again.");
          }
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        void callInternal("/clear-attempts", { email });
        void callInternal("/audit", {
          event: "LOGIN_SUCCESS",
          email,
          userId: user.id,
          reason: "credentials",
        });

        const { password: _pw, twoFactorSecret: _secret, ...safeUser } = user;
        return safeUser;
      },
    }),
  ],

  events: {
    async linkAccount({ user, account }) {
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
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Google sign-in 2FA gate
      if (token.twoFactorPending) {
        if (trigger === "update") {
          const check = await callInternal<{ verified?: boolean }>(
            "/2fa-check",
            { userId: token.id },
          );
          if (check?.verified) {
            const tokens = await exchangeForTokens(
              { id: token.id, email: token.email ?? "", role: token.role },
              token.sessionId as string,
            );
            if (tokens) {
              token.twoFactorPending = false;
              token.backendToken = tokens.accessToken;
              token.backendTokenExpiry = tokens.accessTokenExpiry;
              token.refreshToken = tokens.refreshToken;
              token.refreshTokenExpiry = tokens.refreshTokenExpiry;
              token.sseToken = tokens.sseToken;
              console.log("✅ Exchange successful after 2FA verification");
            }
          }
        }
        return token;
      }

      if (user && !token.backendToken) {
        const sessionId = crypto.randomUUID();
        token.id = user.id;
        token.role = user.role ?? "USER";
        token.sessionId = sessionId;

        // Google sign-in on an account with 2FA enabled
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { twoFactorEnabled: true },
          });
          if (dbUser?.twoFactorEnabled) {
            token.twoFactorPending = true;
            token.email = user.email ?? "";
            return token;
          }
        }

        const tokens = await exchangeForTokens(
          { id: user.id, email: user.email!, role: user.role ?? "USER" },
          sessionId,
        );

        if (tokens) {
          token.backendToken = tokens.accessToken;
          token.backendTokenExpiry = tokens.accessTokenExpiry;
          token.refreshToken = tokens.refreshToken;
          token.refreshTokenExpiry = tokens.refreshTokenExpiry;
          token.sseToken = tokens.sseToken;
          console.log("✅ Exchange successful on sign-in");
        } else {
          token.backendToken = "";
          token.backendTokenExpiry = 0;
          token.refreshToken = "";
          token.refreshTokenExpiry = 0;
          token.sseToken = "";
          console.error("⚠️ Exchange failed on sign-in — session degraded");
        }

        return token;
      }

    
      // Subsequent requests: silently refresh when near expiry
      const now = Date.now();
      const nearExpiry =
        !token.backendTokenExpiry ||
        now > (token.backendTokenExpiry as number) - 60_000;

      if (nearExpiry && token.refreshToken) {
        const tokenStillValid =
          !!token.backendTokenExpiry && now < (token.backendTokenExpiry as number);
        const lastAttempt = (token.lastRefreshAttempt as number) ?? 0;
        if (tokenStillValid && now - lastAttempt < 30_000) {
          return token;
        }
        token.lastRefreshAttempt = now;

        const refresh = await silentRefresh(
          token.sessionId as string,
          token.refreshToken as string,
        );

        if (refresh.ok) {
          token.backendToken = refresh.tokens.accessToken;
          token.backendTokenExpiry = refresh.tokens.accessTokenExpiry;
          token.refreshToken = refresh.tokens.refreshToken;
          token.refreshTokenExpiry = refresh.tokens.refreshTokenExpiry;
          token.sseToken = refresh.tokens.sseToken;
        } else {
          const refreshExpired =
            !token.refreshTokenExpiry ||
            Date.now() > (token.refreshTokenExpiry as number);

          const serverRejected =
            !!refresh.code &&
            ["TOKEN_REVOKED", "SESSION_TIMEOUT", "TOKEN_REPLAY_DETECTED", "INVALID_TOKEN", "TOKEN_EXPIRED"].includes(
              refresh.code,
            );

          if (refreshExpired || serverRejected) {
            token.error = "SESSION_EXPIRED";
            token.backendToken = "";
            token.backendTokenExpiry = 0;
            token.refreshToken = "";
            token.refreshTokenExpiry = 0;
            token.sseToken = "";
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.backendToken = token.twoFactorPending ? "" : (token.backendToken as string);
      session.sseToken = token.sseToken as string;
      session.sessionId = token.sessionId as string;
      session.error = token.error as string | undefined;
      session.twoFactorPending = token.twoFactorPending === true;
      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const gp = profile as GoogleProfile;
          const isVerified =
            gp?.email_verified === true || gp?.verified_email === true;
          const existing = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existing) {
            if (!isVerified && existing.password) {
              return false;
            }
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                lastLoginAt: new Date(),
                emailVerified: isVerified
                  ? (existing.emailVerified ?? new Date())
                  : existing.emailVerified,
                name: existing.name || user.name,
                image: existing.image || user.image,
              },
            });
          }

          void callInternal("/clear-attempts", { email: user.email! });
          void callInternal("/audit", {
            event: "LOGIN_SUCCESS",
            email: user.email!,
            userId: user.id,
            reason: "google_oauth",
          });

          return true;
        } catch (err) {
          if (!isProd) console.error("Google sign-in error:", err);
          return true;
        }
      }

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
    sseToken: string;
    sessionId: string;
    error?: string;
    twoFactorPending?: boolean;
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
    sessionId: string;
    backendToken: string;
    backendTokenExpiry: number;
    refreshToken: string;
    refreshTokenExpiry: number;
    sseToken: string;
    lastRefreshAttempt?: number;
    error?: string;
    twoFactorPending?: boolean;
  }
}
