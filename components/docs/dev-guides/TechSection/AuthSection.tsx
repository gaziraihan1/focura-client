"use client";

import type { GuideArticle } from "@/types/guides.types";
import { CodeBlock, IC, Prose, RowList, SectionH, Warn } from "../";

export const authArticles: GuideArticle[] = [
  {
    id: "hybrid-auth-model",
    title: "Hybrid auth model",
    summary:
      "NextAuth manages client sessions while the Express backend is the sole authority for issuing RS256 JWTs — the private key never leaves the backend.",
    content: (
      <Prose>
        Gablura uses a hybrid auth model. NextAuth manages sessions on the client; the Express
        backend is the sole authority for issuing RS256 JWTs. The private key never leaves the
        backend.
      </Prose>
    ),
  },
  {
    id: "token-exchange-flow",
    title: "Token exchange flow",
    summary:
      "Sign-in via NextAuth, HMAC proof to the backend, RS256 access and refresh token issuance, HTTP-only cookie storage, and automatic refresh on 401.",
    content: (
      <>
        <SectionH>Token exchange flow</SectionH>
        <CodeBlock label="full auth flow">{`1. User signs in via NextAuth (credentials or Google OAuth)
2. NextAuth jwt() callback fires
3. Client POSTs to POST /api/v1/auth/exchange with:
     { userId, email, signature (HMAC), timestamp }
4. Backend verifies HMAC using NEXTAUTH_SECRET (timing-safe compare)
5. Backend checks timestamp — rejects if >5 min old (replay protection)
6. Backend issues:
     accessToken  (RS256, 15 min expiry)
     refreshToken (RS256, 7 day expiry)
7. Tokens stored in NextAuth session (HTTP-only cookie)
8. Every API call: Axios interceptor attaches Authorization: Bearer <accessToken>
9. On 401: interceptor calls POST /api/v1/auth/refresh, retries original request`}</CodeBlock>
      </>
    ),
  },
  {
    id: "key-files",
    title: "Key files",
    summary:
      "authOptions.ts, lib/axios.ts, backendToken.ts, tokenRevocation.ts, auditLog.ts and the Express auth middleware — where each auth concern lives.",
    content: (
      <>
        <SectionH>Key files</SectionH>
        <RowList
          items={[
            { label: "lib/auth/authOptions.ts", desc: "NextAuth config — providers, jwt(), session(), callbacks" },
            { label: "lib/axios.ts", desc: "Axios instance — request interceptor attaches token, response interceptor handles 401" },
            { label: "src/lib/auth/backendToken.ts", desc: "RS256 signing and verification using keys/private.pem and keys/public.pem" },
            { label: "src/lib/auth/tokenRevocation.ts", desc: "Redis-based JTI revocation for logout and token invalidation" },
            { label: "src/lib/auth/auditLog.ts", desc: "Structured security event logging for all auth actions" },
            { label: "src/middleware/auth.ts", desc: "authenticate() and authorize() Express middleware" },
          ]}
        />
      </>
    ),
  },
  {
    id: "refresh-locks",
    title: "refreshLocks race condition fix",
    summary:
      "When multiple requests fire on an expired token, only one refresh runs — implemented by capturing the Promise resolve handle synchronously.",
    content: (
      <>
        <SectionH>refreshLocks race condition fix</SectionH>
        <Prose>
          When multiple requests fire simultaneously on an expired token, only one refresh call
          should happen. The lock is implemented by capturing the Promise resolve handle
          synchronously:
        </Prose>
        <CodeBlock label="lib/auth/authOptions.ts">{`let refreshPromise: Promise<Tokens> | null = null;

async function refreshTokens(token: JWT): Promise<JWT> {
  if (!refreshPromise) {
    // Capture resolve synchronously BEFORE any await
    let resolve!: (t: Tokens) => void;
    refreshPromise = new Promise(r => { resolve = r; });

    const fresh = await callRefreshEndpoint(token.refreshToken);
    resolve(fresh);
    refreshPromise = null;
    return { ...token, ...fresh };
  }
  const fresh = await refreshPromise;
  return { ...token, ...fresh };
}`}</CodeBlock>
      </>
    ),
  },
  {
    id: "google-oauth-email-verified",
    title: "Google OAuth — emailVerified timing",
    summary:
      "Google OAuth sets emailVerified via the linkAccount callback, which fires after jwt() on first sign-in — guard against null in the jwt callback.",
    content: (
      <>
        <SectionH>Google OAuth — emailVerified timing</SectionH>
        <Prose>
          Google OAuth sets <IC>emailVerified</IC> via the <IC>linkAccount</IC> callback, which fires{" "}
          <em>after</em> the <IC>jwt()</IC> callback on the first sign-in. Guard against null:
        </Prose>
        <CodeBlock label="lib/auth/authOptions.ts">{`async jwt({ token, account }) {
  // account is only present on the first sign-in call
  if (account?.provider === "google") {
    token.emailVerified = token.email ? new Date().toISOString() : null;
  }
  return token;
}`}</CodeBlock>
      </>
    ),
  },
  {
    id: "rsa-key-encoding",
    title: "RSA key encoding",
    summary:
      "Base64-encode the RSA key files into JWT_PRIVATE_KEY / JWT_PUBLIC_KEY env vars and decode them at runtime — never commit keys/private.pem.",
    content: (
      <>
        <SectionH>RSA key encoding</SectionH>
        <CodeBlock label="terminal — encode keys to base64 env vars">{`# Backend .env
JWT_PRIVATE_KEY=$(cat keys/private.pem | base64)
JWT_PUBLIC_KEY=$(cat keys/public.pem | base64)

# Decode at runtime in backendToken.ts
const privateKey = Buffer.from(process.env.JWT_PRIVATE_KEY!, "base64").toString("utf-8");`}</CodeBlock>

        <Warn>
          Never commit <IC>keys/private.pem</IC>. It is listed in <IC>.gitignore</IC>. If it&apos;s
          ever exposed, regenerate immediately with <IC>node scripts/generate-keys.js</IC> and
          rotate all active tokens.
        </Warn>
      </>
    ),
  },
];
