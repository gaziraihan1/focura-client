"use client";

import { CodeBlock, IC, Prose, RowList, SectionH, Warn } from "../";
export function AuthSection() {
  return (
    <div>
      <Prose>
        Focura uses a hybrid auth model. NextAuth manages sessions on the client; the Express backend is the sole authority for issuing RS256 JWTs. The private key never leaves the backend.
      </Prose>

      <SectionH>Token exchange flow</SectionH>
      <CodeBlock label="full auth flow">{`1. User signs in via NextAuth (credentials or Google OAuth)
2. NextAuth jwt() callback fires
3. Client POSTs to POST /api/auth/exchange with:
     { userId, email, signature (HMAC), timestamp }
4. Backend verifies HMAC using NEXTAUTH_SECRET (timing-safe compare)
5. Backend checks timestamp — rejects if >5 min old (replay protection)
6. Backend issues:
     accessToken  (RS256, 15 min expiry)
     refreshToken (RS256, 7 day expiry)
7. Tokens stored in NextAuth session (HTTP-only cookie)
8. Every API call: Axios interceptor attaches Authorization: Bearer <accessToken>
9. On 401: interceptor calls POST /api/auth/refresh, retries original request`}</CodeBlock>

      <SectionH>Key files</SectionH>
      <RowList items={[
        { label: "lib/auth/authOptions.ts", desc: "NextAuth config — providers, jwt(), session(), callbacks" },
        { label: "lib/axios.ts", desc: "Axios instance — request interceptor attaches token, response interceptor handles 401" },
        { label: "src/lib/auth/backendToken.ts", desc: "RS256 signing and verification using keys/private.pem and keys/public.pem" },
        { label: "src/lib/auth/tokenRevocation.ts", desc: "Redis-based JTI revocation for logout and token invalidation" },
        { label: "src/lib/auth/auditLog.ts", desc: "Structured security event logging for all auth actions" },
        { label: "src/middleware/auth.ts", desc: "authenticate() and authorize() Express middleware" },
      ]} />

      <SectionH>refreshLocks race condition fix</SectionH>
      <Prose>When multiple requests fire simultaneously on an expired token, only one refresh call should happen. The lock is implemented by capturing the Promise resolve handle synchronously:</Prose>
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

      <SectionH>Google OAuth — emailVerified timing</SectionH>
      <Prose>
        Google OAuth sets <IC>emailVerified</IC> via the <IC>linkAccount</IC> callback, which fires <em>after</em> the <IC>jwt()</IC> callback on the first sign-in. Guard against null:
      </Prose>
      <CodeBlock label="lib/auth/authOptions.ts">{`async jwt({ token, account }) {
  // account is only present on the first sign-in call
  if (account?.provider === "google") {
    token.emailVerified = token.email ? new Date().toISOString() : null;
  }
  return token;
}`}</CodeBlock>

      <SectionH>RSA key encoding</SectionH>
      <CodeBlock label="terminal — encode keys to base64 env vars">{`# Backend .env
JWT_PRIVATE_KEY=$(cat keys/private.pem | base64)
JWT_PUBLIC_KEY=$(cat keys/public.pem | base64)

# Decode at runtime in backendToken.ts
const privateKey = Buffer.from(process.env.JWT_PRIVATE_KEY!, "base64").toString("utf-8");`}</CodeBlock>

      <Warn>
        Never commit <IC>keys/private.pem</IC>. It is listed in <IC>.gitignore</IC>. If it&apos;s ever exposed, regenerate immediately with <IC>node scripts/generate-keys.js</IC> and rotate all active tokens.
      </Warn>
    </div>
  );
}
