"use client";

import { CodeBlock, IC, Prose, RowList, SectionH, StepList, Tip } from "../";
export function SetupSection() {
  return (
    <div>
      <SectionH>Prerequisites</SectionH>
      <RowList items={[
        { label: "Node.js", desc: "v20 or higher" },
        { label: "npm", desc: "v10+ (comes with Node 20)" },
        { label: "PostgreSQL", desc: "Supabase project (free tier works)" },
        { label: "Redis", desc: "Upstash Redis instance (free tier works)" },
        { label: "Google OAuth", desc: "OAuth 2.0 credentials for Google sign-in" },
      ]} />

      <SectionH>1 — Clone both repos</SectionH>
      <CodeBlock label="terminal">{`git clone https://github.com/gaziraihan1/focura-backend.git
git clone https://github.com/gaziraihan1/focura-client.git`}</CodeBlock>

      <SectionH>2 — Backend setup</SectionH>
      <StepList steps={[
        {
          title: "Install dependencies",
          desc: <CodeBlock label="focura-backend/">{`cd focura-backend
npm install`}</CodeBlock>,
        },
        {
          title: "Generate RSA key pair",
          desc: <>
            <Prose>Run the one-time key generator. This writes <IC>keys/private.pem</IC> and <IC>keys/public.pem</IC>.</Prose>
            <CodeBlock label="focura-backend/">{`node scripts/generate-keys.js`}</CodeBlock>
          </>,
        },
        {
          title: "Configure environment variables",
          desc: <CodeBlock label=".env (backend)">{`DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."        # Supabase direct (no pooler)
UPSTASH_REDIS_URL="rediss://..."
UPSTASH_REDIS_TOKEN="..."
JWT_PRIVATE_KEY="$(cat keys/private.pem | base64)"
JWT_PUBLIC_KEY="$(cat keys/public.pem | base64)"
NEXTAUTH_SECRET="your-shared-secret"  # same value as client
PORT=4000`}</CodeBlock>,
        },
        {
          title: "Run Prisma migrations and seed",
          desc: <CodeBlock label="focura-backend/">{`npx prisma migrate dev
npx prisma db seed`}</CodeBlock>,
        },
        {
          title: "Start the backend",
          desc: <CodeBlock label="focura-backend/">{`npm run dev
# Server running on http://localhost:4000`}</CodeBlock>,
        },
      ]} />

      <SectionH>3 — Frontend setup</SectionH>
      <StepList steps={[
        {
          title: "Install dependencies",
          desc: <CodeBlock label="focura-client/">{`cd focura-client
npm install`}</CodeBlock>,
        },
        {
          title: "Configure environment variables",
          desc: <CodeBlock label=".env.local (client)">{`NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-shared-secret"  # same as backend
NEXT_PUBLIC_API_URL="http://localhost:4000"   # client-side
BACKEND_URL="http://localhost:4000"           # server-side only
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."`}</CodeBlock>,
        },
        {
          title: "Start the frontend",
          desc: <CodeBlock label="focura-client/">{`npm run dev
# App running on http://localhost:3000`}</CodeBlock>,
        },
      ]} />

      <Tip>
        <IC>NEXT_PUBLIC_API_URL</IC> is used in browser-side Axios calls. <IC>BACKEND_URL</IC> (no prefix) is used only in server components and NextAuth callbacks — never expose it to the client.
      </Tip>
    </div>
  );
}