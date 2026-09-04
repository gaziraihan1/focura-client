# 🔐 Dual-Token Authentication Architecture

> **For Future Developers:** This document explains the complete authentication system, why it's designed this way, and what you need to know when working on auth-related code.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Why Dual-Token?](#why-dual-token)
- [Architecture Diagram](#architecture-diagram)
- [Token Types](#token-types)
- [Auth Flow: Step by Step](#auth-flow-step-by-step)
- [Token Exchange Flow](#token-exchange-flow)
- [Session Lifecycle](#session-lifecycle)
- [Security Controls](#security-controls)
- [Common Pitfalls](#common-pitfalls)
- [Debugging Guide](#debugging-guide)
- [FAQ](#faq)

---

## Overview

Gablura uses a **dual-token architecture** where:

1. **NextAuth.js** (Frontend) handles the initial authentication (login, OAuth, session state)
2. **Express Backend** handles all API authorization via RS256 JWTs

This is **not an accident** — it's a deliberate architectural choice that provides:
- Google OAuth support (NextAuth handles the redirect flow)
- Session management (NextAuth manages cookies/state)
- Backend security (RS256 JWT with revocation, binding, audit logging)

---

## Why Dual-Token?

### Problem: Moving Auth to Backend Would Break Things

| Component | Why It's Tightly Coupled |
|-----------|-------------------------|
| **NextAuth CredentialsProvider** | Handles login form, validates password, manages session state |
| **NextAuth GoogleProvider** | Manages OAuth redirect/callback dance |
| **PrismaAdapter** | NextAuth requires it for Account/Session/VerificationToken storage |
| **JWT callback** | Creates HMAC proof, exchanges for backend tokens |
| **signIn callback** | Updates user profile on Google sign-in |
| **Session callback** | Injects `backendToken` into the session |

**Moving login/logout to the backend would require:**
- Replacing NextAuth.js entirely (custom auth system)
- Reimplementing Google OAuth from scratch
- Reimplementing session management
- Changing every component that uses `useSession()`

**This is a major rewrite, not a migration.**

### Solution: Exchange Pattern

Instead of moving auth, we use an **exchange pattern**:
1. NextAuth authenticates the user
2. Frontend creates an HMAC proof (signed with shared secret)
3. Backend verifies the proof and issues RS256 JWTs
4. All subsequent API calls use the backend JWT

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                                   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Next.js 16 (App Router) + React 19                                  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  NextAuth.js                                                    │  │  │
│  │  │  ├─ CredentialsProvider (email/password)                        │  │  │
│  │  │  ├─ GoogleProvider (OAuth)                                      │  │  │
│  │  │  ├─ PrismaAdapter (Account/Session storage)                     │  │  │
│  │  │  └─ JWT Callback → Creates HMAC proof → Exchanges for backend JWT│  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  Axios Client (lib/axios/)                                      │  │  │
│  │  │  ├─ Request interceptor: Attaches backend JWT to headers        │  │  │
│  │  │  ├─ Response interceptor: Handles 401 → refresh → retry         │  │  │
│  │  │  └─ CSRF token: Fetched from backend, attached to mutations     │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────┬─────────────────────────────────┘
                                            │
                         ┌──────────────────┴──────────────────┐
                         │  HTTP + RS256 JWT                   │
                         │  Authorization: Bearer <token>      │
                         │  x-csrf-token: <csrf-token>         │
                         └──────────────────┬──────────────────┘
                                            │
┌───────────────────────────────────────────▼─────────────────────────────────┐
│                       BACKEND (Express.js)                                  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Authentication Middleware (middleware/auth.ts)                        │  │
│  │  ├─ Verify JWT signature (RS256)                                     │  │
│  │  ├─ Check token revocation (Redis)                                   │  │
│  │  ├─ Validate session binding (device + IP)                           │  │
│  │  ├─ Check user status (email verified, not banned)                   │  │
│  │  └─ Cache auth result for performance                                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  CSRF Middleware (middleware/csrf.ts)                                  │  │
│  │  ├─ Generate CSRF tokens (Redis-backed)                              │  │
│  │  ├─ Validate on POST/PUT/PATCH/DELETE                                │  │
│  │  └─ Timing-safe comparison                                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Rate Limiter (middleware/rateLimiter.ts + apiRateLimiter.ts)         │  │
│  │  ├─ Per-IP rate limiting (auth endpoints)                            │  │
│  │  ├─ Per-user rate limiting (API endpoints)                           │  │
│  │  └─ Tier-based limits (FREE/PRO/ENTERPRISE)                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Redis (Session/Token Storage)                                        │  │
│  │  ├─ Access token revocation (gablura:revoked:access:{jti})            │  │
│  │  ├─ Refresh token storage (gablura:refresh:{userId}:{jti})            │  │
│  │  ├─ Session metadata (session:metadata:{sessionId})                  │  │
│  │  ├─ CSRF tokens (csrf:{userId}:{sessionId})                          │  │
│  │  ├─ Account lockout (gablura:lockout:locked:{email})                  │  │
│  │  └─ SSE tokens (gablura:sse:{jti})                                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Token Types

### 1. NextAuth Session Token (Frontend)

| Property | Value |
|----------|-------|
| **Algorithm** | HS256 (symmetric) |
| **Storage** | HTTP-only cookie (`__Secure-next-auth.session-token`) |
| **Lifetime** | 7 days (maxAge) |
| **Refresh** | 24 hours (updateAge) |
| **Purpose** | Maintain NextAuth session state |

**Contains:**
```typescript
{
  id: string;           // User ID
  email: string;
  name?: string;
  image?: string;
  role: string;
  backendToken: string; // RS256 access token (for API calls)
  sseToken: string;     // SSE stream token
  sessionId: string;    // Unique session ID
  error?: string;       // SESSION_EXPIRED if refresh failed
  twoFactorPending?: boolean; // Google sign-in 2FA gate
}
```

### 2. Backend Access Token (RS256)

| Property | Value |
|----------|-------|
| **Algorithm** | RS256 (asymmetric) |
| **Storage** | NextAuth session token (in cookie) |
| **Lifetime** | 15 minutes |
| **Purpose** | Authenticate API requests |

**Contains:**
```typescript
{
  sub: string;      // User ID
  email: string;
  role: string;
  type: "access";   // Token type
  version: number;  // Token version (for forced rotation)
  jti: string;      // Unique token ID (for revocation)
  sessionId: string; // Session ID (for binding)
  iat: number;      // Issued at
  exp: number;      // Expiration
  iss: "gablura-app"; // Issuer
  aud: "gablura-backend"; // Audience
}
```

### 3. Backend Refresh Token (RS256)

| Property | Value |
|----------|-------|
| **Algorithm** | RS256 (asymmetric) |
| **Storage** | NextAuth session token (in cookie) |
| **Lifetime** | 7 days |
| **Purpose** | Refresh expired access tokens |

**Same structure as access token, but `type: "refresh"`**

### 4. SSE Token (RS256)

| Property | Value |
|----------|-------|
| **Algorithm** | RS256 (asymmetric) |
| **Storage** | Redis (single-use) |
| **Lifetime** | 30 seconds |
| **Purpose** | Authenticate SSE notification stream |

**Same structure as access token, but `type: "sse"`**

### 5. CSRF Token

| Property | Value |
|----------|-------|
| **Algorithm** | None (random) |
| **Storage** | Redis (per user+session) |
| **Lifetime** | 1 hour |
| **Purpose** | CSRF protection for state-changing requests |

**Contains:** 32-byte random token (base64url encoded)

---

## Auth Flow: Step by Step

### 1. User Login (Email/Password)

```
1. User submits email/password to NextAuth
   │
2. NextAuth validates credentials (Prisma DB)
   │
3. NextAuth creates session token (HS256)
   │
4. JWT callback fires:
   │
   ├─ Generate session ID (crypto.randomUUID())
   │
   ├─ Create HMAC proof:
   │   payload = userId + email + role + sessionId + timestamp
   │   signature = HMAC-SHA256(NEXTAUTH_SECRET, payload)
   │
   └─ Exchange for backend tokens:
       POST /api/v1/auth/exchange
       Body: { userId, email, role, sessionId, timestamp, signature }
       │
       Backend verifies HMAC proof
       │
       Backend issues RS256 tokens:
       - Access token (15min)
       - Refresh token (7d)
       - SSE token (30s)
       │
       Backend stores:
       - Refresh token in Redis
       - Session metadata in Redis
       - SSE token in Redis
       │
       Returns tokens to frontend
   │
5. JWT callback stores tokens in session:
   - token.backendToken = accessToken
   - token.refreshToken = refreshToken
   - token.sseToken = sseToken
   - token.backendTokenExpiry = Date.now() + 15min
   - token.refreshTokenExpiry = Date.now() + 7d
   │
6. Session callback injects tokens into session object
   │
7. Axios interceptor attaches backend JWT to all API requests
```

### 2. User Login (Google OAuth)

```
1. User clicks "Sign in with Google"
   │
2. NextAuth redirects to Google OAuth
   │
3. Google redirects back with authorization code
   │
4. NextAuth exchanges code for tokens
   │
5. signIn callback fires:
   │
   ├─ Check if user exists
   │
   ├─ If exists: update profile (name, image, lastLoginAt)
   │
   └─ If not exists: create user via PrismaAdapter
   │
6. JWT callback fires:
   │
   ├─ Check if user has 2FA enabled
   │
   ├─ If 2FA enabled:
   │   - Set token.twoFactorPending = true
   │   - Return early (no backend tokens yet)
   │
   └─ If no 2FA:
       - Create HMAC proof
       - Exchange for backend tokens
       - Store in session
   │
7. If 2FA pending:
   │
   ├─ Frontend shows 2FA verification form
   │
   ├─ User submits TOTP code
   │
   ├─ Frontend calls POST /api/auth/verify-2fa
   │   - Verifies TOTP locally (clean error)
   │   - Calls backend /internal/2fa-verify (sets Redis marker)
   │
   ├─ Frontend calls session.update()
   │
   └─ JWT callback checks /internal/2fa-check
       - If verified: exchange for backend tokens
       - If not: return early (still pending)
```

---

## Token Exchange Flow

### Why Exchange?

The frontend (NextAuth) and backend are **separate trust domains**:
- Frontend: NextAuth manages sessions, Google OAuth, credentials
- Backend: Express manages API security, revocation, audit logging

The **exchange flow** bridges these domains:
1. Frontend proves it authenticated the user (HMAC proof)
2. Backend issues its own tokens (RS256 JWTs)
3. All API calls use backend tokens

### Exchange Proof

```typescript
// Frontend creates proof (lib/auth/exchange.ts)
export function createExchangeProof(userId, email, role, sessionId) {
  const timestamp = Date.now();
  const payload = `${userId}${email}${role}${sessionId}${timestamp}`;
  const signature = crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET!)
    .update(payload)
    .digest("hex");
  return { timestamp, signature };
}

// Backend verifies proof (routes/auth.routes.ts)
function verifyExchangeProof(payload: string, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expected, "hex"),
  );
}
```

### Why HMAC?

- **Shared secret** (NEXTAUTH_SECRET) proves the request came from the frontend
- **Timing-safe comparison** prevents timing attacks
- **60-second proof expiry** limits replay window
- **No extra env vars** — uses the same secret NextAuth already has

---

## Session Lifecycle

### 1. Session Creation

```
Exchange endpoint:
  1. Verify HMAC proof
  2. Issue RS256 tokens (access + refresh + SSE)
  3. Store refresh token in Redis (with TTL)
  4. Store session metadata in Redis (with TTL)
  5. Track session in user's session set
  6. If max sessions (5) reached → evict least active
  7. Record session creation (for timeout tracking)
```

### 2. Session Activity

```
Every authenticated request:
  1. Auth middleware verifies JWT
  2. Session timeout middleware:
     - Check if session is tracked
     - Check if session is inactive (Redis key expired?)
     - Update activity timestamp (reset inactivity timer)
  3. Session binding middleware:
     - Generate device fingerprint
     - Compare with stored metadata
     - If mismatch: check if same IP → re-bind, else → revoke (hijack)
```

### 3. Token Refresh

```
Frontend detects access token near expiry:
  1. Axios interceptor calls silentRefresh()
  2. Frontend POSTs refresh token to backend /refresh
  3. Backend:
     a. Verify refresh token signature
     b. Check if session is revoked
     c. Check if session is inactive (timeout)
     d. Acquire refresh lock (prevent concurrent refreshes)
     e. Rotate refresh token (atomic Lua script)
     f. Issue new access + refresh + SSE tokens
     g. Release lock
  4. Frontend updates session with new tokens
```

### 4. Session Termination

```
Logout (single device):
  1. Frontend calls POST /api/v1/auth/logout
  2. Backend:
     a. Revoke access token (add to revocation list)
     b. Invalidate session (delete Redis keys)
     c. Remove from user's session set
     d. Audit log

Logout (all devices):
  1. Frontend calls POST /api/v1/auth/logout with { logoutAll: true }
  2. Backend:
     a. Revoke ALL refresh tokens for user
     b. Invalidate ALL sessions
     c. Audit log
```

---

## Security Controls

### 1. Token Revocation

**Access Tokens:**
- Stored in Redis: `gablura:revoked:access:{jti}`
- TTL = token expiry (15min)
- Checked on every request (auth middleware)

**Refresh Tokens:**
- Stored in Redis: `gablura:refresh:{userId}:{jti}`
- TTL = token expiry (7d)
- Atomic rotation via Lua script
- Replay detection (if old token not found → revoke all)

**Sessions:**
- Stored in Redis: `gablura:session:revoked:{sessionId}`
- TTL = 7d
- Checked on every request

### 2. Session Binding

**Device Fingerprint:**
```typescript
// Normalized browser + OS + mobile flag
fingerprint = hash(normalizeUserAgent(ua) + primaryLanguage(acceptLanguage))
// Example: "Chrome|Windows|desktop"
```

**Binding Rules:**
- First request claims binding (server-to-server exchange has no browser headers)
- Device change from SAME public IP → re-bind (not revoke)
- Device change from DIFFERENT public IP → revoke (hijack)
- Private/internal IPs → exempt from IP comparison

### 3. Rate Limiting

**Auth Endpoints (per-IP):**
- `/exchange`: 60/min (fail-open)
- `/refresh`: 120/min (fail-open)
- `/logout`: 60/min (fail-open)

**API Endpoints (per-user):**
- FREE tier: 60/min
- PRO tier: 300/min
- ENTERPRISE tier: 1000/min
- Calendar: 2x limits (bursty page loads)

**Security Endpoints (per-user):**
- 2FA setup/verify/disable: 10/min (fail-closed)
- Password change: 10/min (fail-closed)
- Account deletion: 5/min (fail-closed)

### 4. CSRF Protection

**Mechanism:**
1. Frontend fetches CSRF token from backend
2. Token stored in Redis: `csrf:{userId}:{sessionId}`
3. Token attached to all POST/PUT/PATCH/DELETE requests
4. Backend validates (timing-safe comparison)
5. 1-hour TTL

**Exemptions:**
- GET/HEAD/OPTIONS (safe methods)
- Webhook endpoints (verified by provider signatures)
- OAuth callback (protected by state parameter)

---

## Common Pitfalls

### ❌ Don't: Access Backend JWT from Client Components

```typescript
// WRONG — exposes token to client bundle
"use client";
const { data: session } = useSession();
const token = session?.backendToken; // ✅ OK in client components (HTTP-only cookie)

// WRONG — trying to read from localStorage
const token = localStorage.getItem("backendToken"); // ❌ Never do this
```

### ❌ Don't: Bypass the Exchange Flow

```typescript
// WRONG — trying to create backend tokens directly
const tokens = jwt.sign(payload, privateKey, { algorithm: "RS256" }); // ❌ Backend only!

// WRONG — calling backend without HMAC proof
await fetch(`${BACKEND_URL}/api/v1/auth/exchange`, {
  method: "POST",
  body: JSON.stringify({ userId, email, role }), // ❌ Missing timestamp + signature
});
```

### ❌ Don't: Ignore Token Expiry

```typescript
// WRONG — assuming token is always valid
const user = await api.get("/api/v1/user/profile"); // Might fail if token expired

// CORRECT — let Axios interceptor handle refresh
const user = await api.get("/api/v1/user/profile"); // Interceptor refreshes if needed
```

### ❌ Don't: Store Tokens in localStorage

```typescript
// WRONG — vulnerable to XSS
localStorage.setItem("accessToken", token); // ❌ XSS can steal it

// CORRECT — tokens in HTTP-only cookies (managed by NextAuth)
// No manual storage needed
```

### ❌ Don't: Hardcode Tokens

```typescript
// WRONG — secrets in code
const token = "eyJhbGciOiJSUzI1NiIs..."; // ❌ Never hardcode

// CORRECT — read from environment
const secret = process.env.NEXTAUTH_SECRET; // ✅ Server-side only
```

---

## Debugging Guide

### 1. User Gets Logged Out Randomly

**Possible causes:**
- Access token expired (15min) and refresh failed
- Session inactivity timeout (7d)
- Session evicted (max 5 concurrent sessions)
- Session hijack detected

**Debug steps:**
```bash
# Check if session exists in Redis
redis-cli GET "session:metadata:{sessionId}"

# Check if session is revoked
redis-cli GET "gablura:session:revoked:{sessionId}"

# Check refresh token exists
redis-cli GET "gablura:refresh:{userId}:{jti}"

# Check audit logs
grep "SESSION_HIJACK\|SESSION_TIMEOUT\|MAX_SESSIONS" /var/log/app.log
```

### 2. CSRF Validation Failed

**Possible causes:**
- CSRF token expired (1hr)
- New session (different sessionId)
- Redis down

**Debug steps:**
```bash
# Check if CSRF token exists
redis-cli GET "csrf:{userId}:{sessionId}"

# Check Redis status
redis-cli PING
```

### 3. Token Replay Detected

**Possible causes:**
- Concurrent refresh requests (browser race condition)
- Stolen refresh token

**Debug steps:**
```bash
# Check refresh token exists
redis-cli GET "gablura:refresh:{userId}:{oldJti}"

# Check audit logs
grep "TOKEN_REPLAY_DETECTED" /var/log/app.log
```

### 4. Session Hijack Detected

**Possible causes:**
- User switched networks (mobile → WiFi)
- Stolen token used from different IP
- VPN connection changed

**Debug steps:**
```bash
# Check session metadata
redis-cli GET "session:metadata:{sessionId}"

# Check audit logs
grep "SESSION_HIJACK\|SESSION_REBOUND\|DEVICE_MISMATCH" /var/log/app.log
```

---

## FAQ

### Q: Why not move all auth to the backend?

**A:** NextAuth.js is deeply integrated:
- Google OAuth redirect flow requires frontend handling
- PrismaAdapter manages Account/Session/VerificationToken
- Session state is managed by NextAuth
- Moving would require reimplementing everything from scratch

The exchange pattern gives us the best of both worlds:
- NextAuth handles complex OAuth flows
- Backend handles security (revocation, binding, audit)

### Q: Why RS256 instead of HS256?

**A:** RS256 (asymmetric) means:
- Private key never leaves the backend
- Frontend can verify tokens but not create them
- Better security posture (compromised frontend doesn't compromise tokens)

### Q: Why 15-minute access tokens?

**A:** Short-lived access tokens + refresh tokens provide:
- Limited window for stolen token abuse
- Automatic rotation on refresh
- Revocation possible via Redis

### Q: Why 7-day refresh tokens?

**A:** Balance between security and UX:
- Long enough for typical usage
- Short enough to limit abuse window
- Revocable via Redis (logout all devices)

### Q: Why session binding (device + IP)?

**A:** Defense against session hijacking:
- Stolen token used from different device → detect
- Stolen token used from different network → detect
- Legitimate device switch → re-bind (not revoke)

### Q: Why fail-closed for rate limiting?

**A:** Security > Availability for rate limiting:
- If Redis is down, we can't verify rate limits
- Better to reject (429) than allow abuse
- Auth endpoints are fail-open (availability critical)

### Q: Why fail-open for auth endpoints?

**A:** Availability > Security for auth:
- Users must be able to login/refresh
- Redis outage shouldn't block all authentication
- Other security controls (JWT, binding) still apply

---

## Related Files

### Frontend (Next.js)

| File | Purpose |
|------|---------|
| `lib/auth/authOptions.ts` | NextAuth configuration |
| `lib/auth/exchange.ts` | HMAC proof creation + token exchange |
| `lib/auth/refresh.ts` | Silent token refresh with dedup |
| `lib/auth/bridge.ts` | Internal backend bridge (audit + lockout) |
| `lib/auth/logout.ts` | Logout helper |
| `lib/auth/types.ts` | Shared type definitions |
| `lib/axios/client.ts` | Axios interceptors (token attachment + refresh) |
| `lib/axios/session.ts` | Session management + force logout |
| `lib/csrf.ts` | CSRF token fetch + cache |
| `lib/limiter.ts` | Frontend rate limiting (defense-in-depth) |

### Backend (Express)

| File | Purpose |
|------|---------|
| `src/routes/auth.routes.ts` | /exchange, /refresh, /logout |
| `src/routes/internal.routes.ts` | /failed-attempt, /clear-attempts, /audit, /revoke-sessions, /2fa-verify, /2fa-check |
| `src/middleware/auth.ts` | JWT verification + session binding |
| `src/middleware/csrf.ts` | CSRF token generation + validation |
| `src/middleware/rateLimiter.ts` | Per-IP rate limiting |
| `src/middleware/apiRateLimiter.ts` | Per-user API rate limiting |
| `src/middleware/sessionTimeout.ts` | Session timeout tracking |
| `src/lib/auth/backendToken.ts` | RS256 token creation + verification |
| `src/lib/auth/tokenRevocation.ts` | Token revocation + rotation |
| `src/lib/auth/sessionBinding.ts` | Device fingerprint + IP binding |
| `src/lib/auth/sessionManager.ts` | Max concurrent sessions |
| `src/lib/auth/accountLockout.ts` | Failed login lockout |
| `src/lib/auth/refreshLock.ts` | Distributed refresh lock |
| `src/lib/auth/auditLog.ts` | Security event logging |

---

## Summary

The dual-token architecture is a **deliberate design choice** that provides:

1. **NextAuth integration** — Google OAuth, credentials, session management
2. **Backend security** — RS256 JWT, revocation, binding, audit logging
3. **Exchange pattern** — Bridges frontend and backend trust domains
4. **Defense in depth** — Multiple security layers (rate limiting, CSRF, binding)

**Key principle:** Frontend handles UX (login forms, OAuth redirects), backend handles security (tokens, revocation, audit).

---

*Last Updated: August 27, 2026*
*Version: 1.0*
