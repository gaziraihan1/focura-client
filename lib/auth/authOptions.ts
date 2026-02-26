// frontend/src/lib/auth/authOptions.ts
// FIXES:
//   1. Exchange failure on initial sign-in no longer throws into NextAuth
//      (throwing in jwt callback = NextAuth calls signOut() automatically)
//   2. Silent refresh failure no longer keeps stale expired token in a loop
//   3. Refresh lock keyed by sessionId (more precise than userId)
//   4. Neither exchange nor refresh ever throw — they return null and degrade

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import * as argon2 from "argon2";
import crypto from "crypto";

const isProd      = process.env.NODE_ENV === "production";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const DUMMY_HASH  = "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$ZHVtbXloYXNo";

interface GoogleProfile { email_verified?: boolean; verified_email?: boolean; }

// ─── Refresh lock ─────────────────────────────────────────────────────────────
// Prevents concurrent jwt() callbacks from rotating the same refresh token,
// which would trigger TOKEN_REPLAY_DETECTED on the second call.
const refreshLocks = new Map<string, Promise<any>>();

// ─── HMAC exchange proof ──────────────────────────────────────────────────────
function createExchangeProof(
  userId: string, email: string, role: string, sessionId: string
) {
  const timestamp = Date.now();
  const payload   = `${userId}${email}${role}${sessionId}${timestamp}`;
  const signature = crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET!)
    .update(payload)
    .digest("hex");
  return { timestamp, signature };
}

// ─── Exchange — NEVER throws ──────────────────────────────────────────────────
// If this threw, NextAuth would catch it in the jwt callback and call signOut().
async function exchangeForTokens(
  user: { id: string; email: string; role: string },
  sessionId: string
): Promise<{
  accessToken: string; refreshToken: string;
  accessTokenExpiry: number; refreshTokenExpiry: number;
} | null> {
  try {
    const { timestamp, signature } = createExchangeProof(
      user.id, user.email, user.role, sessionId
    );
    const res = await fetch(`${BACKEND_URL}/api/auth/exchange`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        userId: user.id, email: user.email, role: user.role,
        sessionId, timestamp, signature,
      }),
    });
    if (!res.ok) {
      console.error("❌ Exchange failed:", res.status);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error("❌ Exchange network error:", err);
    return null;
  }
}

// ─── Silent refresh — NEVER throws ───────────────────────────────────────────
async function silentRefresh(
  sessionId: string,
  refreshToken: string
): Promise<{
  accessToken: string; refreshToken: string;
  accessTokenExpiry: number; refreshTokenExpiry: number;
} | null> {
  // Reuse in-flight promise for this session to prevent duplicate rotation
  const existing = refreshLocks.get(sessionId);
  if (existing) return existing.catch(() => null);

  const promise = (async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    return res.json();
  })();

  refreshLocks.set(sessionId, promise);
  try {
    return await promise;
  } catch {
    return null;
  } finally {
    refreshLocks.delete(sessionId);
  }
}

// ─── authOptions ──────────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
      allowDangerousEmailAccountLinking: true,
      httpOptions: { timeout: 10000 },
    }),

    CredentialsProvider({
      id: "credentials", name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid login attempt.");
        }
        const email = credentials.email.toLowerCase().trim();
        const user  = await prisma.user.findUnique({
          where:  { email },
          select: {
            id: true, email: true, name: true, password: true,
            role: true, image: true, emailVerified: true,
          },
        });
        if (!user || !user.password) {
          await argon2.verify(DUMMY_HASH, "invalid");
          throw new Error("Invalid credentials.");
        }
        if (!user.emailVerified) throw new Error("Please verify your email to log in.");
        const isValid = await argon2.verify(user.password, credentials.password);
        if (!isValid) throw new Error("Invalid credentials.");
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        const { password: _pw, ...safeUser } = user;
        return safeUser;
      },
    }),
  ],

  events: {
    async linkAccount({ user, account }) {
      if (account.provider === "google") {
        await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
      }
    },
  },

  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {

      // ─── Initial sign-in ────────────────────────────────────────────────
      if (user) {
        const sessionId = crypto.randomUUID();
        token.id        = user.id;
        token.role      = user.role ?? "USER";
        token.sessionId = sessionId;

        // IMPORTANT: we do NOT throw here even if exchange fails.
        // Any throw in the jwt callback causes NextAuth to call signOut() automatically.
        const tokens = await exchangeForTokens(
          { id: user.id, email: user.email!, role: user.role ?? "USER" },
          sessionId
        );

        if (tokens) {
          token.backendToken       = tokens.accessToken;
          token.backendTokenExpiry = tokens.accessTokenExpiry;
          token.refreshToken       = tokens.refreshToken;
          token.refreshTokenExpiry = tokens.refreshTokenExpiry;
        } else {
          // Degrade gracefully — session is alive, API calls will 401
          // until the backend recovers and refresh succeeds
          token.backendToken       = "";
          token.backendTokenExpiry = 0;
          token.refreshToken       = "";
          token.refreshTokenExpiry = 0;
          console.error("⚠️  Exchange failed on sign-in — session degraded");
        }

        return token;
      }

      // ─── Subsequent requests: silently refresh when near expiry ──────────
      const nearExpiry =
        !token.backendTokenExpiry ||
        Date.now() > (token.backendTokenExpiry as number) - 60_000;

      if (nearExpiry && token.refreshToken) {
        const tokens = await silentRefresh(
          token.sessionId as string,
          token.refreshToken as string
        );

        if (tokens) {
          token.backendToken       = tokens.accessToken;
          token.backendTokenExpiry = tokens.accessTokenExpiry;
          token.refreshToken       = tokens.refreshToken;
          token.refreshTokenExpiry = tokens.refreshTokenExpiry;
        } else {
          // Refresh failed transiently — clear the expired access token
          // so the client gets a clean 401 rather than sending a bad token.
          // Keep refreshToken so we retry next time. Do NOT throw.
          token.backendToken       = "";
          token.backendTokenExpiry = 0;
          console.warn("⚠️  Silent refresh failed — will retry on next request");
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id      = token.id as string;
      session.user.role    = token.role as string;
      session.backendToken = token.backendToken as string;
      session.sessionId    = token.sessionId as string;
      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const gp         = profile as GoogleProfile;
          const isVerified = gp?.email_verified === true || gp?.verified_email === true;
          const existing   = await prisma.user.findUnique({ where: { email: user.email! } });
          if (existing) {
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                lastLoginAt:   new Date(),
                emailVerified: isVerified && !existing.emailVerified ? new Date() : existing.emailVerified,
                name:          existing.name  || user.name,
                image:         existing.image || user.image,
              },
            });
          }
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
    error:  "/authentication/error",
  },
  debug: !isProd && process.env.NEXTAUTH_DEBUG === "true",
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string; email: string; name?: string | null;
      image?: string | null; role: string; emailVerified?: Date | null;
    };
    backendToken: string;
    sessionId: string;
  }
  interface User { role?: string; emailVerified: Date | null; }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; role: string; sessionId: string;
    backendToken: string; backendTokenExpiry: number;
    refreshToken: string; refreshTokenExpiry: number;
  }
}