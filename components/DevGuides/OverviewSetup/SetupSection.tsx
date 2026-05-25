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
          desc: <CodeBlock label=".env (backend)">{`# Runtime (pooler)
DATABASE_URL="postgresql://..."
# Direct (for migrations / introspection)
DIRECT_URL="postgresql://..."

# Server
NODE_ENV="development"
PORT=5000
CLIENT_URL="http://localhost:3000"

ACCESS_TOKEN_SECRET="your secret here"   # use a secure random string
NEXTAUTH_SECRET="your secret here"   # use a secure random string
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_API_URL="https://focura-backend-vr75.onrender.com"  # use this to connect to deployed backend

# Development - load from files
JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem

REDIS_URL=redis://127.0.0.1:6379

EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your email here"   
EMAIL_SERVER_PASSWORD="your email password or app password"
EMAIL_FROM="Focura <your email here>"
UPSTASH_REDIS_REST_URL="https://us1-focura-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your upstash rest token here"
JWT_EXPIRES_IN="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Set to 'paddle' to use Paddle. Set to 'stripe' to revert. No code changes.
PAYMENT_PROVIDER=paddle

# ── Paddle Billing ───────────────────────────────────────────────────────────
# PADDLE_API_KEY="your paddle api key here"
# PADDLE_WEBHOOK_SECRET="your paddle webhook secret here"
# PADDLE_PRICE_PRO_MONTHLY="your paddle price id here"
# PADDLE_PRICE_PRO_YEARLY="your paddle price id here"
# PADDLE_PRICE_BUSINESS_MONTHLY="your paddle price id here"
# PADDLE_PRICE_BUSINESS_YEARLY="your paddle price id here"

# ── Stripe Billing (if needed) ───────────────────────────────────────────────────────────
STRIPE_PRICE_PRO_MONTHLY="stripe price id here"
STRIPE_PRICE_PRO_YEARLY="stripe price id here"
STRIPE_PRICE_BUSINESS_MONTHLY="stripe price id here"
STRIPE_PRICE_BUSINESS_YEARLY="stripe price id here"

STRIPE_WEBHOOK_SECRET="stripe webhook secret here"
STRIPE_SECRET_KEY="stripe secret key here"

CACHE_TTL_WORKSPACE_METADATA=3600    # Workspace by ID/slug (default: 1 hour)
CACHE_TTL_LABEL_LIST=1800            # Label lists (default: 30 minutes)
CACHE_TTL_ANALYTICS=3600             # Analytics data (default: 1 hour)
CACHE_TTL_WORKSPACE_OVERVIEW=3600    # Workspace overview (default: 1 hour)
CACHE_TTL_WORKSPACE_STATS=1800  

FOCURA_ADMIN_IDS="comma-separated list of user IDs that can access the admin dashboard"`}</CodeBlock>,
        },
        {
          title: "Run Prisma migrations and seed",
          desc: <CodeBlock label="focura-backend/">{`npx prisma migrate dev
npx prisma db seed`}</CodeBlock>,
        },
        {
          title: "Start the backend",
          desc: <CodeBlock label="focura-backend/">{`npm run dev
# Server running on http://localhost:5000`}</CodeBlock>,
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
          desc: <CodeBlock label=".env.local (client)">{`DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your secreyt here"   # use a secure random string
NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_API_URL="https://focura-backend-vr75.onrender.com"  # use this to connect to deployed backend
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your email here"   
EMAIL_SERVER_PASSWORD="your email password or app password"
EMAIL_FROM="From <your email here></your>"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NODE_OPTIONS=--dns-result-order=ipv4first`}</CodeBlock>,
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