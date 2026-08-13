import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import * as argon2 from "argon2";
import crypto from "crypto";
import { verifySync as verifyTOTP } from "otplib";

const isProd = process.env.NODE_ENV === "production";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$ZHVtbXloYXNo";

interface GoogleProfile {
  email_verified?: boolean;
  verified_email?: boolean;
}
type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  sseToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
};

// A refresh attempt either returns a new token pair or fails. On failure we
// keep the server's error code so the jwt callback can tell a transient blip
// (network, 5xx) apart from a genuinely dead session (TOKEN_REVOKED,
// SESSION_TIMEOUT, replay, invalid) — only the latter must force-logout.
type RefreshResult =
  | { ok: true; tokens: TokenResponse }
  | { ok: false; code?: string };

const refreshLocks = new Map<string, Promise<RefreshResult>>();
// ─── HMAC exchange proof ──────────────────────────────────────────────────────
function createExchangeProof(
  userId: string,
  email: string,
  role: string,
  sessionId: string,
) {
  const timestamp = Date.now();
  const payload = `${userId}${email}${role}${sessionId}${timestamp}`;
  const signature = crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET!)
    .update(payload)
    .digest("hex");
  return { timestamp, signature };
}

async function exchangeForTokens(
  user: { id: string; email: string; role: string },
  sessionId: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  sseToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
} | null> {
  try {
    const { timestamp, signature } = createExchangeProof(
      user.id,
      user.email,
      user.role,
      sessionId,
    );
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId,
        timestamp,
        signature,
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

// ─── Internal backend bridge (login audit + account lockout) ────────────────
// The credentials check lives in Next.js, but the Redis-backed account
// lockout and the audit log live in the Express backend. These calls are
// strictly best-effort: they must never block or break a login.
export async function callInternal<T = Record<string, unknown>>(
  path: string,
  fields: Record<string, unknown>,
): Promise<T | null> {
  // Unit tests have no backend to talk to — skip the network call entirely.
  if (process.env.NODE_ENV === "test") return null;
  try {
    const timestamp = Date.now();
    // Same HMAC scheme as the /exchange proof: signed with NEXTAUTH_SECRET,
    // the shared secret the backend already uses to verify exchange requests.
    const signature = crypto
      .createHmac("sha256", process.env.NEXTAUTH_SECRET!)
      .update(JSON.stringify(fields))
      .digest("hex");
    const res = await fetch(`${BACKEND_URL}/api/v1/internal${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, timestamp, signature }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // never fail a login over an internal audit/lockout call
  }
}

type FailedAttemptResult = {
  success?: boolean;
  locked?: boolean;
  unlocksAt?: string;
  attempts?: number;
};

/** Record a failed login with the backend and surface the lock status (if any). */
async function recordLoginFailure(
  email: string,
): Promise<FailedAttemptResult | null> {
  const result = await callInternal<FailedAttemptResult>("/failed-attempt", {
    email,
  });
  void callInternal("/audit", {
    event: "LOGIN_FAILED",
    email,
    reason: "Invalid credentials",
    meta: { attempts: result?.attempts ?? 0 },
  });
  return result;
}


async function silentRefresh(
  sessionId: string,
  refreshToken: string,
): Promise<RefreshResult> {
  const existing = refreshLocks.get(sessionId);
  if (existing) return existing.catch(() => ({ ok: false } as RefreshResult));

  let resolve!: (value: RefreshResult) => void;

  const promise = new Promise<RefreshResult>((res) => {
    resolve = res;
  });

  refreshLocks.set(sessionId, promise);

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (res.ok) {
      const tokens: TokenResponse = await res.json();
      const result: RefreshResult = { ok: true, tokens };
      resolve(result);
      return result;
    }

    // Surface the server's rejection code (TOKEN_REVOKED, SESSION_TIMEOUT,
    // TOKEN_REPLAY_DETECTED, INVALID_TOKEN, TOKEN_EXPIRED, …) so the jwt
    // callback can distinguish a dead session from a transient blip.
    let code: string | undefined;
    try {
      const body = (await res.json()) as { code?: string };
      code = body?.code;
    } catch {
      // non-JSON error body — leave code undefined (treated as transient)
    }
    const result: RefreshResult = { ok: false, code };
    resolve(result);
    return result;
  } catch {
    // Network error / timeout — transient; never force-logout on this.
    const result: RefreshResult = { ok: false };
    resolve(result);
    return result;
  } finally {
    refreshLocks.delete(sessionId);
  }
}

export const authOptions: NextAuthOptions = {
  // NOTE: The `Session` model was intentionally removed from the Prisma schema.
  // With session strategy "jwt" the adapter's session methods (createSession,
  // getSessionAndUser, ...) are never invoked, so removing the model is safe.
  // Do NOT switch to a database-session strategy without restoring it first.
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
          // Timing-safe dummy verify prevents user enumeration. Deliberately
          // NOT counted against the lockout: recording failures for accounts
          // that don't exist (or have no password) would let an attacker lock
          // out a real account by spamming its email. IP-based rate limiting
          // already covers unknown-account brute force.
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
            // This attempt was blocked by an active lock — record it.
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

        // ─── 2FA enforcement ────────────────────────────────────────────
        if (user.twoFactorEnabled) {
          if (!credentials.totpCode) {
            throw new Error("2FA_REQUIRED");
          }

          // Second step: verify the TOTP code
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

        // Login audit + lockout reset — best-effort, fire-and-forget.
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
      // ─── Google sign-in 2FA gate ───────────────────────────────────────
      // Google accounts with twoFactorEnabled get a PENDING session (no
      // backend tokens). The 2FA page verifies the TOTP code via the
      // backend, which mints a short-lived single-use Redis marker; the
      // explicit session update() below consumes the marker and completes
      // the token exchange. While pending the session carries no
      // credentials, so it can never reach protected API calls — the client
      // routes the user to /authentication/2fa instead. The marker is
      // consumed only on trigger === "update" (never by session polls), so
      // polling cannot race the verification, and a stale marker can never
      // auto-complete a later sign-in.
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
            // Exchange failed → keep pending; the 2FA page detects the still-
            // pending session and re-verifies (minting a fresh marker).
          }
        }
        return token;
      }

      if (user && !token.backendToken) {
        const sessionId = crypto.randomUUID();
        token.id = user.id;
        token.role = user.role ?? "USER";
        token.sessionId = sessionId;

        // Google sign-in on an account with 2FA enabled → require the TOTP
        // code before minting tokens (credentials sign-in already enforces
        // TOTP inside authorize()).
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
      // Throttle retry attempts: while the network is flaky we must not
      // hammer /refresh on every session read. But throttle ONLY while the
      // current access token still works — once it has truly expired, the
      // 401-retry path depends on this refresh, so always attempt it.
      const tokenStillValid =
        !!token.backendTokenExpiry && now < (token.backendTokenExpiry as number);
      const lastAttempt = (token.lastRefreshAttempt as number) ?? 0;
      if (tokenStillValid && now - lastAttempt < 30_000) {
        return token;
      }
      token.lastRefreshAttempt = now;

      console.log("🔄 Attempting silent refresh...");
      
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
        console.log("✅ Silent refresh successful");
      } else {
        const refreshExpired =
          !token.refreshTokenExpiry ||
          Date.now() > (token.refreshTokenExpiry as number);

        // Server explicitly rejected this session as dead — the session was
        // revoked, timed out, or the refresh token is invalid/replayed. These
        // are NOT transient: retrying will keep failing, so mark the session
        // expired so lib/axios forceLogouts instead of leaving a zombie that
        // silently 401s on every request.
        const serverRejected =
          !!refresh.code &&
          ["TOKEN_REVOKED", "SESSION_TIMEOUT", "TOKEN_REPLAY_DETECTED", "INVALID_TOKEN", "TOKEN_EXPIRED"].includes(
            refresh.code,
          );

        if (refreshExpired || serverRejected) {
          // Never throw from a NextAuth callback: an uncaught error makes
          // /api/auth/session return Next's HTML 500 page instead of JSON,
          // which breaks useSession() with CLIENT_FETCH_ERROR
          // ("Unexpected token '<', <!DOCTYPE..."). Instead mark the token
          // as expired and clear backend credentials so the session callback
          // surfaces `error` and DashboardShell forces a graceful logout.
          console.error(
            refreshExpired
              ? "❌ Refresh token expired - marking session expired"
              : `❌ Session rejected by server (${refresh.code}) - marking session expired`,
          );
          token.error = "SESSION_EXPIRED";
          token.backendToken = "";
          token.backendTokenExpiry = 0;
          token.refreshToken = "";
          token.refreshTokenExpiry = 0;
          token.sseToken = "";
        } else {
          // Refresh failed but the session is still valid (network hiccup, 5xx,
          // or a non-terminal code). KEEP the current tokens — zeroing them here
          // degrades the session to empty and the next API call force-logs-out
          // the user on a transient blip. The old access token stays valid until
          // it truly expires; lib/axios's 401-retry path then re-attempts this
          // refresh (throttled above).
          console.warn("⚠️ Silent refresh failed (transient) - keeping current token");
        }
      }
    }

    return token;
  },

  async session({ session, token }) {
    session.user.id = token.id as string;
    session.user.role = token.role as string;
    // Pending-2FA sessions carry no backend credentials.
    session.backendToken = token.twoFactorPending ? "" : (token.backendToken as string);
    session.sseToken = token.sseToken as string;
    session.sessionId = token.sessionId as string;
    session.error = token.error as string | undefined;
    session.twoFactorPending = token.twoFactorPending === true;
    
    // Log session state for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("📋 Session callback:", {
        hasBackendToken: !!session.backendToken,
        tokenLength: session.backendToken?.length || 0,
      });
    }
    
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
            // ─── Account-takeover guard ────────────────────────────────
            // An UNVERIFIED Google email must never be able to assume
            // control of an existing password-based account. Note: we return
            // false (deny) rather than throwing — the catch below swallows
            // errors and returns true, which would silently allow the link.
            if (!isVerified && existing.password) {
              return false;
            }
            // Existing user — safe to update
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
          // ↑ New users: adapter creates them; emailVerified is handled
          //   by the `linkAccount` event which already fires for Google.
          //   No else branch needed — the broken update() is removed.

          // Best-effort login audit + lockout reset for OAuth sign-ins.
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
