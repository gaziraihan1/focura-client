"use client"
import { IC, SectionH, Table, Tip, Warn } from "../";
export function EnvVarsSection() {
  return (
    <div>
      <SectionH>Client (.env.local)</SectionH>
      <Table
        headers={["Variable", "Required", "Description"]}
        rows={[
          ["NEXTAUTH_URL", "✓", "Full URL of the Next.js app e.g. http://localhost:3000"],
          ["NEXTAUTH_SECRET", "✓", "Shared secret between client and backend for HMAC proof"],
          ["NEXT_PUBLIC_API_URL", "✓", "Backend URL used in browser (Axios baseURL)"],
          ["BACKEND_URL", "✓", "Backend URL used in server components / NextAuth only"],
          ["GOOGLE_CLIENT_ID", "✓", "Google OAuth client ID"],
          ["GOOGLE_CLIENT_SECRET", "✓", "Google OAuth client secret"],
        ]}
      />

      <SectionH>Backend (.env)</SectionH>
      <Table
        headers={["Variable", "Required", "Description"]}
        rows={[
          ["DATABASE_URL", "✓", "Pooled Supabase PostgreSQL connection string"],
          ["DIRECT_URL", "✓", "Direct (non-pooled) Supabase connection — migrations only"],
          ["JWT_PRIVATE_KEY", "✓", "Base64-encoded RSA private key (from keys/private.pem)"],
          ["JWT_PUBLIC_KEY", "✓", "Base64-encoded RSA public key (from keys/public.pem)"],
          ["NEXTAUTH_SECRET", "✓", "Same value as the client — used to verify HMAC proofs"],
          ["UPSTASH_REDIS_URL", "✓", "Upstash Redis URL — must use rediss:// (TLS)"],
          ["UPSTASH_REDIS_TOKEN", "✓", "Upstash Redis auth token"],
          ["FOCURA_ADMIN_IDS", "○", "Comma-separated user IDs with platform admin access"],
          ["PORT", "○", "HTTP port, defaults to 4000"],
        ]}
      />

      <Warn>
        Never use <IC>NEXT_PUBLIC_</IC> prefix for secrets. Anything prefixed <IC>NEXT_PUBLIC_</IC> is embedded into the client JavaScript bundle and visible to anyone in the browser.
      </Warn>

      <Tip>
        Use <IC>.env.example</IC> files in both repos (committed to git) with placeholder values. The real <IC>.env</IC> / <IC>.env.local</IC> files are in <IC>.gitignore</IC>.
      </Tip>
    </div>
  );
}