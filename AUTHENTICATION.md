
# 🔐 Authentication System

This document describes the authentication architecture of **Focura Client**, covering NextAuth integration, JWT token exchange, real-time updates via SSE, and security best practices.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Authentication Flow](#-authentication-flow)
- [Token Management](#-token-management)
- [Token Exchange & Refresh](#-token-exchange--refresh)
- [Real-Time Notifications (SSE)](#-real-time-notifications-sse)
- [Protected Routes](#-protected-routes)
- [API Interceptors](#-api-interceptors)
- [Logout & Session Management](#-logout--session-management)
- [Rate Limiting](#-rate-limiting)
- [Error Handling](#-error-handling)
- [Security Properties](#-security-properties)
- [Troubleshooting](#-troubleshooting)
- [Environment Variables](#-environment-variables)

---

## 🎯 Overview

Focura Client uses a **hybrid authentication architecture**:

- **Frontend**: NextAuth.js for session management
- **Backend**: Express.js for RS256 JWT signing and validation
- **Communication**: HTTPS with Bearer token in Authorization header
- **Real-time**: Server-Sent Events (SSE) for notifications

**Key principle**: The backend is the sole authority for signing JWTs. The private key never leaves the Express server.

---

## 🏗 Architecture

### **High-Level Flow**

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User enters credentials/clicks "Sign in with Google"            │
│                                                                   │
│                            ↓                                      │
│                                                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ 1. Login request
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js (NextAuth)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Validates credentials locally or with Google                    │
│  Generates HMAC-signed proof (using NEXTAUTH_SECRET)             │
│                                                                   │
│                            ↓                                      │
│                                                                   │
│  2. Exchange proof for tokens                                    │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ POST /api/auth/exchange
                 │ { userId, email, signature, timestamp }
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Express Backend                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Verifies HMAC proof (crypto.timingSafeEqual)                    │
│  Checks timestamp (replay protection)                            │
│  Issues RS256 JWT tokens                                         │
│                                                                   │
│  Response:                                                        │
│  {                                                               │
│    accessToken: "eyJhbGc...",      (15 min expiry)              │
│    refreshToken: "eyJhbGc...",     (7 day expiry)               │
│    accessTokenExpiry: 1234567890,                                │
│    refreshTokenExpiry: 1234567890                                │
│  }                                                               │
│                                                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ 3. Store tokens in session
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│              Next.js Session Callback                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✅ accessToken stored in session (HTTP-only cookie)             │
│  ✅ refreshToken stored in session (HTTP-only cookie)            │
│  ✅ User redirected to dashboard                                 │
│                                                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Subsequent API calls
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│         Axios Interceptor (lib/axios.ts)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✅ Fetches session from NextAuth                                 │
│  ✅ Attaches token: Authorization: Bearer <accessToken>          │
│  ✅ Handles token refresh if near expiry                          │
│  ✅ Retries failed requests with fresh token                     │
│                                                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ API request with token
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│              Express Backend                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✅ Validates JWT signature (using public key)                    │
│  ✅ Checks token expiry & version                                │
│  ✅ Extracts userId from JWT                                      │
│  ✅ Proceeds with request or returns 401                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Authentication Flow

### **1. Sign Up with Credentials**

```
User fills signup form
    ↓
POST /api/auth/callback/credentials
    ↓
NextAuth CredentialsProvider
    ├─ Check email uniqueness
    ├─ Hash password with Argon2
    ├─ Create user in DB (Prisma)
    └─ Auto-login
    ↓
Exchange proof generated
    ↓
POST /api/auth/exchange (to backend)
    ↓
Backend validates & issues RS256 tokens
    ↓
Session updated with tokens
    ↓
User redirected to dashboard
```

### **2. Sign In with Credentials**

```
User enters email & password
    ↓
POST /api/auth/callback/credentials
    ↓
NextAuth CredentialsProvider
    ├─ Find user by email
    ├─ Verify email is verified
    ├─ Compare password hash (Argon2)
    └─ Update lastLoginAt
    ↓
Exchange proof generated (sessionId = random UUID)
    ↓
POST /api/auth/exchange (to backend)
    ├─ HMAC verification
    ├─ Timestamp validation (60s window)
    ├─ User existence check
    └─ Issue RS256 token pair
    ↓
Session updated
    ↓
Redirect to dashboard
```

### **3. Sign In with Google**

```
User clicks "Sign in with Google"
    ↓
Redirect to Google OAuth consent screen
    ↓
User grants permission
    ↓
Google redirects back with authorization code
    ↓
NextAuth exchanges code for ID token & user profile
    ↓
Check: User exists in DB?
    ├─ YES: Update user record (lastLoginAt, name, image)
    └─ NO: Create new user (adapter auto-creates via Prisma)
    ↓
Exchange proof generated
    ↓
POST /api/v1/auth/exchange (to backend)
    ↓
Backend validates & issues tokens
    ↓
Session updated
    ↓
Redirect to dashboard
```

---

## 💾 Token Management

### **Access Token**

| Property | Value |
|----------|-------|
| **Algorithm** | RS256 (asymmetric) |
| **Expiry** | 15 minutes |
| **Signing** | Backend only (private key) |
| **Verification** | Anyone (public key) |
| **Storage** | HTTP-only NextAuth session cookie |
| **Transmitted** | Authorization header: `Bearer <token>` |

**Payload:**
```json
{
  "sub": "user-id-123",
  "email": "user@example.com",
  "role": "USER",
  "type": "access",
  "version": 1,
  "jti": "uuid-v4-for-revocation",
  "sid": "session-id",
  "iat": 1704067200,
  "exp": 1704068100
}
```

### **Refresh Token**

| Property | Value |
|----------|-------|
| **Algorithm** | RS256 |
| **Expiry** | 7 days |
| **Signing** | Backend only |
| **Storage** | HTTP-only NextAuth session cookie |
| **Usage** | Single-use rotation |
| **JTI Tracking** | Redis (per-user, per-session) |

**Payload:**
```json
{
  "sub": "user-id-123",
  "email": "user@example.com",
  "type": "refresh",
  "version": 1,
  "jti": "unique-per-token",
  "sid": "session-id",
  "iat": 1704067200,
  "exp": 1704672000
}
```

### **Session Storage**

Tokens are stored in NextAuth's JWT session cookie:

```typescript
// Session structure in memory
interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: string;
    emailVerified?: Date;
  };
  backendToken: string;              // Access token
  sessionId: string;                 // Unique per login
}
```

---

## 🔄 Token Exchange & Refresh

### **Initial Exchange** (After Login)

**Location**: `lib/auth/authOptions.ts` - `jwt` callback

```typescript
async jwt({ token, user }) {
  if (user && !token.backendToken) {
    // Generate HMAC proof
    const sessionId = crypto.randomUUID();
    const { timestamp, signature } = createExchangeProof(
      user.id,
      user.email,
      user.role,
      sessionId
    );

    // Exchange with backend
    const response = await fetch(`${BACKEND_URL}/api/auth/exchange`, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId,
        timestamp,
        signature,
      }),
    });

    const tokens = await response.json();
    
    // Store in token
    token.backendToken = tokens.accessToken;
    token.refreshToken = tokens.refreshToken;
    token.backendTokenExpiry = tokens.accessTokenExpiry;
    token.refreshTokenExpiry = tokens.refreshTokenExpiry;
  }
  return token;
}
```

### **HMAC Exchange Proof**

Why HMAC instead of a separate token?

- **Stateless**: No need to store exchange tokens
- **Proof of origin**: Only Next.js server knows `NEXTAUTH_SECRET`
- **Replay protection**: Timestamp window (60 seconds)
- **Timing-safe**: `crypto.timingSafeEqual` for comparison

**Proof generation:**

```typescript
function createExchangeProof(
  userId: string,
  email: string,
  role: string,
  sessionId: string
) {
  const timestamp = Date.now();
  const payload = `${userId}${email}${role}${sessionId}${timestamp}`;
  
  const signature = crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET!)
    .update(payload)
    .digest("hex");
  
  return { timestamp, signature };
}
```

### **Silent Refresh**

**Trigger**: Access token is within 1 minute of expiry

**Location**: `lib/auth/authOptions.ts` - `jwt` callback

```typescript
// On every request, check if token is near expiry
const nearExpiry = Date.now() > (token.backendTokenExpiry - 60_000);

if (nearExpiry && token.refreshToken) {
  // Prevent duplicate refresh: use lock per sessionId
  const existing = refreshLocks.get(sessionId);
  if (existing) return existing.catch(() => null);
  
  // Set refresh lock
  const promise = new Promise(/* ... */);
  refreshLocks.set(sessionId, promise);
  
  // Call refresh endpoint
  const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "POST",
    body: JSON.stringify({ refreshToken: token.refreshToken }),
  });
  
  if (response.ok) {
    const newTokens = await response.json();
    
    // Update with new pair
    token.backendToken = newTokens.accessToken;
    token.refreshToken = newTokens.refreshToken;
    token.backendTokenExpiry = newTokens.accessTokenExpiry;
    token.refreshTokenExpiry = newTokens.refreshTokenExpiry;
  }
  
  refreshLocks.delete(sessionId);
}

return token;
```

**Key features:**
- **Refresh lock**: Prevents duplicate refresh calls
- **Single-use JTI**: Backend invalidates old JTI
- **Graceful degradation**: If refresh fails, session stays valid until expiry
- **No automatic logout**: Users can still interact, next API call triggers refresh

---

## 📡 Real-Time Notifications (SSE)

### **Connecting to SSE Stream**

**Location**: `hooks/useNotifications.ts`

```typescript
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.backendToken) return; // Wait for auth

    const source = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/stream?token=${session.backendToken}`
    );

    source.addEventListener("notification", (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prev) => [notification, ...prev]);
    });

    source.addEventListener("error", () => {
      source.close();
      // Reconnect after 5 seconds
    });

    return () => source.close();
  }, [session?.backendToken]);

  return { notifications };
};
```

### **Backend SSE Verification**

**Backend flow** (for reference):

```
GET /api/notifications/stream?token=<accessToken>
    ↓
Extract token from query param
    ↓
verifyToken(token) using public key
    ↓
Extract userId from JWT
    ↓
Maintain connection per userId
    ↓
Send events: data: JSON\n\n
    ↓
On disconnect or error: cleanup & log
```

**Security notes:**
- Token verified server-side before connection
- userId extracted from JWT (never from URL)
- User can only receive their own notifications
- No user enumeration possible

### **Sending Notifications**

From within app components:

```typescript
// Notification automatically sent by backend when:
// - Task assigned to user
// - Comment mentions user
// - Task status changes
// - Team updates

// Frontend receives via SSE and updates React Query cache
```

---

## 🛡 Protected Routes

### **App Router Middleware**

**Location**: `middleware.ts` (if exists, or route-level checks)

```typescript
// Redirect unauthenticated users
if (!session) {
  return redirect("/authentication/login");
}

// Check role (if needed)
if (requiredRole && session.user.role !== requiredRole) {
  return redirect("/unauthorized");
}
```

### **Client Component Protection**

```typescript
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    redirect("/authentication/login");
  }

  return <div>Protected content for {session.user.email}</div>;
}
```

### **Server Component Protection**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/authentication/login");
  }

  return <div>Protected content</div>;
}
```

---

## 🔗 API Interceptors

### **Axios Request Interceptor**

**Location**: `lib/axios.ts`

```typescript
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get session with token caching
    const session = await getSession();
    
    // Attach bearer token
    if (session?.backendToken) {
      config.headers.Authorization = `Bearer ${session.backendToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
```

### **Axios Response Interceptor**

**Handles token expiry and replay attacks**:

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const code = error.response?.data?.code;
    const originalConfig = error.config;

    // Handle token expired
    if (code === "TOKEN_EXPIRED" && !originalConfig._retried) {
      originalConfig._retried = true;
      
      // Invalidate cache to force fresh session fetch
      invalidateTokenCache();
      
      // NextAuth automatically refreshes on next request
      const session = await getSession();
      
      if (session?.backendToken) {
        originalConfig.headers.Authorization = `Bearer ${session.backendToken}`;
        return axiosInstance(originalConfig); // Retry request
      }
    }

    // Handle replay attack
    if (code === "TOKEN_REPLAY_DETECTED") {
      invalidateTokenCache();
      signOut({ callbackUrl: "/authentication/login" });
    }

    return Promise.reject(error);
  }
);
```

### **Error Handling**

```typescript
const handleAxiosError = async (error: AxiosError) => {
  const status = error.response?.status;
  const code = error.response?.data?.code;

  switch (code) {
    case "TOKEN_EXPIRED":
      toast.error("Session expired. Please login again.");
      signOut({ callbackUrl: "/authentication/login" });
      break;
    case "TOKEN_REPLAY_DETECTED":
      toast.error("Security alert. Please login again.");
      signOut({ callbackUrl: "/authentication/login" });
      break;
    case "PERMISSION_DENIED":
      toast.error("You don't have permission to do this.");
      break;
    default:
      if (status === 401) {
        signOut({ callbackUrl: "/authentication/login" });
      }
  }
};
```

---

## 🚪 Logout & Session Management

### **Single Device Logout**

**Location**: `lib/auth/logout.ts`

```typescript
export async function logout(logoutAll = false): Promise<void> {
  try {
    // Notify backend to revoke token
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ logoutAll }),
    });
  } catch (err) {
    console.warn("Backend logout failed:", err);
  }

  // Clear session & redirect
  await signOut({ callbackUrl: "/authentication/login", redirect: true });
}
```

**Backend handles**:
- Revokes current access token JTI
- Deletes refresh token JTI from Redis
- Audit logs logout event

### **Logout All Devices**

```typescript
// Call with logoutAll flag
await logout(logoutAll = true);
```

**Backend behavior**:
- Revokes current access token
- Deletes ALL refresh token JTIs for user
- All other sessions fail on next refresh attempt
- Users naturally redirect to login

### **Session Expiry**

Handled automatically:

1. **Access token expires** (15 min)
   - User continues working
   - Next API call triggers silent refresh
   - If refresh token valid, continues seamlessly
   - If refresh token expired, gets 401

2. **Refresh token expires** (7 days)
   - Silent refresh returns 401
   - User sees "Session expired" message
   - Redirected to login

---

## 🔒 Rate Limiting

### **Login Rate Limiting** (Frontend)

**Location**: Axios interceptor or route handler

| Limit | Value |
|-------|-------|
| Window | 60 seconds |
| Max attempts | 5 per IP + email |
| Backend | Redis (prod) / in-memory (dev) |

**Response headers** (backend):
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1704067260
```

### **API Rate Limiting** (Backend)

Tier-based:

| Plan | Requests/minute |
|------|-----------------|
| Free | 60 |
| Pro | 300 |
| Enterprise | 1000 |

**Header response:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704067260
```

---

## ⚠️ Error Handling

### **Common Auth Errors**

| Error | Cause | Solution |
|-------|-------|----------|
| `INVALID_CREDENTIALS` | Wrong password | Show error, let user retry |
| `USER_NOT_FOUND` | Email doesn't exist | Show signup link |
| `EMAIL_NOT_VERIFIED` | User hasn't verified email | Show verification prompt |
| `TOKEN_EXPIRED` | Access token expired | Auto-refresh via interceptor |
| `TOKEN_REPLAY_DETECTED` | JTI already used | Force re-login for security |
| `PERMISSION_DENIED` | Insufficient role | Show 403 page |
| `SESSION_EXPIRED` | Refresh token expired | Redirect to login |

### **Error Response Format**

```json
{
  "success": false,
  "code": "TOKEN_EXPIRED",
  "message": "Your session has expired. Please login again."
}
```

---

## 🔐 Security Properties

### **What We Protect Against**

✅ **Credential theft**: Passwords hashed with Argon2id  
✅ **CSRF attacks**: HMAC proof validation  
✅ **Session hijacking**: HTTP-only cookies, secure flag  
✅ **Token replay**: Single-use JTIs, replay detection  
✅ **Brute force**: Rate limiting, exponential backoff  
✅ **Timing attacks**: `crypto.timingSafeEqual`  
✅ **Data tampering**: RS256 signature verification  
✅ **Cross-site leakage**: Workspace-scoped queries  
✅ **Email spoofing**: Email verification required  
✅ **Privilege escalation**: Role checks on every request  

### **Security Checklist**

- ✅ HTTPS only (enforced in production)
- ✅ Secure cookies (httpOnly, secure, sameSite=Lax)
- ✅ CORS configured (specific origins)
- ✅ No secrets in frontend code
- ✅ No secrets in version control
- ✅ Audit logging of security events
- ✅ Key rotation strategy (90 days or on breach)
- ✅ Timing-safe comparisons
- ✅ Input validation & sanitization
- ✅ Output escaping (React auto-escapes)

### **Password Hashing**

**Algorithm**: Argon2id

```typescript
// Hashing (during signup)
const hash = await argon2.hash(password);

// Verification (during login)
const isValid = await argon2.verify(hash, password);

// Timing attack protection
// If user not found: verify dummy hash to consume time
await argon2.verify(DUMMY_HASH, "invalid");
```

---

## 🧪 Troubleshooting

### **Issue: "Session not found"**

**Cause**: Axios interceptor can't fetch session

**Solution**:
```typescript
// Ensure session is available before making requests
const { data: session } = useSession();
if (!session?.backendToken) return null;

// Use api client which handles this automatically
const response = await api.get('/api/v1/tasks');
```

### **Issue: "Token expired" on every request**

**Cause**: Token caching not working or clock skew

**Solution**:
```typescript
// Clear token cache
invalidateTokenCache();

// Check server time sync
// Server time should be within 60s of client time
```

### **Issue: "HMAC verification failed"**

**Cause**: `NEXTAUTH_SECRET` mismatch

**Solution**:
```env
# Ensure same secret on frontend and backend
NEXTAUTH_SECRET=<very-long-random-string>
```

### **Issue: "Refresh token not rotating"**

**Cause**: Refresh endpoint not called or lock stuck

**Solution**:
```typescript
// Check if refresh is being called
// In dev tools: open Network tab, filter for /refresh
// Should see POST request 1 min before token expires

// Clear refresh locks if stuck
refreshLocks.clear();
```

### **Issue: "SSE connection drops randomly"**

**Cause**: Network issues or token expiry

**Solution**:
```typescript
// useNotifications has auto-reconnect
// If disconnected, waits 5s then reconnects
// Ensure backendToken is fresh

// Check EventSource status
const source = new EventSource(...);
source.addEventListener('error', () => {
  console.log('SSE error, will auto-reconnect');
});
```

### **Issue: "401 Unauthorized" on valid token**

**Cause**: 
1. Token validation failed on backend
2. User deleted from database
3. Email not verified

**Solution**:
```typescript
// Check token payload
const decoded = jwtDecode(token);
console.log(decoded);

// Verify email is verified
// Re-login with email verification

// Check user exists in backend DB
```

---

## 🔄 Environment Variables

### **Frontend (Next.js)**

```env
# NextAuth Configuration
NEXTAUTH_SECRET=<very-long-random-string>    # Must match backend
NEXTAUTH_URL=http://localhost:3000           # Frontend URL

# API Configuration
BACKEND_URL=http://localhost:5000            # Server-side only (no NEXT_PUBLIC)
NEXT_PUBLIC_API_URL=http://localhost:5000    # Client-side for SSE

# OAuth Providers
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>

# Optional
NEXTAUTH_DEBUG=true                          # Enable debug logging
NODE_OPTIONS=--dns-result-order=ipv4first
```

### **Backend (Express)**

```env
# Shared with Frontend
NEXTAUTH_SECRET=<same-as-frontend>           # HMAC proof verification

# JWT Configuration
JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem
# OR in production (base64 encoded)
JWT_PRIVATE_KEY=<base64-encoded-private-key>
JWT_PUBLIC_KEY=<base64-encoded-public-key>

# Redis
UPSTASH_REDIS_REST_URL=<redis-url>
UPSTASH_REDIS_REST_TOKEN=<redis-token>

# CORS
ALLOWED_ORIGIN=http://localhost:3000         # Frontend URL
```

### **Generating Secrets**

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate RSA key pair (backend only)
node scripts/generate-keys.js
```

---

## 🚀 Implementation Guide

### **Step 1: Setup NextAuth**

```typescript
// lib/auth/authOptions.ts
import { authOptions } from "@/lib/auth/authOptions";

// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export default NextAuth(authOptions);
```

### **Step 2: Setup Providers**

```typescript
// components/Providers/SessionProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
```

### **Step 3: Use in Components**

```typescript
"use client";

import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Not signed in</p>;

  return <p>Welcome {session.user.email}</p>;
}
```

### **Step 4: Make API Calls**

```typescript
import { api } from "@/lib/axios";

// Token automatically attached
const response = await api.get<TasksResponse>("/api/v1/tasks");
if (response?.success) {
  console.log(response.data);
}
```

### **Step 5: Real-Time Notifications**

```typescript
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationBell() {
  const { notifications, unreadCount } = useNotifications();

  return (
    <div>
      <span>Unread: {unreadCount}</span>
      {notifications.map((n) => (
        <div key={n.id}>{n.message}</div>
      ))}
    </div>
  );
}
```

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org)
- [JWT.io Debugger](https://jwt.io)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- Backend [AUTHENTICATION.md](https://github.com/gaziraihan1/focura-backend/blob/main/AUTHENTICATION.md)

---

## 👤 Support

- **Issues**: [GitHub Issues](https://github.com/gaziraihan1/focura-client/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gaziraihan1/focura-client/discussions)
- **Backend Repo**: [gaziraihan1/focura-backend](https://github.com/gaziraihan1/focura-backend)

---

**Last Updated**: April 5, 2026

**Maintainer**: Mohammad Raihan Gazi

