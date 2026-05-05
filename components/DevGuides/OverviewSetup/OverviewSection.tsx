"use client";

import { IC, InfoCard, Prose, RowList, SectionH, Table, Tip } from "../";

export function OverviewSection() {
  return (
    <div>
      <Prose>
        Focura is a full-stack TypeScript SaaS split across two repositories: a Next.js 16 client and an Express.js backend. Both share a PostgreSQL database via Prisma and communicate over HTTPS with RS256 JWT tokens.
      </Prose>

      <SectionH>Tech stack</SectionH>
      <Table
        headers={["Layer", "Technology"]}
        rows={[
          ["Frontend runtime", "Next.js 16 (App Router) + React 19"],
          ["Language", "TypeScript throughout"],
          ["Styling", "Tailwind CSS v4 + tw-animate-css"],
          ["State / data", "TanStack Query (React Query) v5"],
          ["Auth (client)", "NextAuth.js v5"],
          ["HTTP client", "Axios (custom instance in lib/axios.ts)"],
          ["Backend runtime", "Node.js + Express.js"],
          ["ORM", "Prisma + PostgreSQL (Supabase)"],
          ["Auth (server)", "RS256 JWT — private key on backend only"],
          ["Caching", "Upstash Redis (ioredis, TLS)"],
          ["Real-time", "Server-Sent Events (SSE)"],
          ["Job scheduling", "node-cron"],
          ["Testing", "Vitest + React Testing Library + MSW"],
        ]}
      />

      <SectionH>Repository structure</SectionH>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <InfoCard icon="🖥" title="focura-client">
          Next.js 16 frontend. Folders: <IC>app/</IC> <IC>components/</IC> <IC>hooks/</IC> <IC>lib/</IC> <IC>types/</IC> <IC>constants/</IC> <IC>context/</IC> <IC>utils/</IC> <IC>tests/</IC>
        </InfoCard>
        <InfoCard icon="⚙️" title="focura-backend">
          Express.js API. Folders: <IC>src/modules/</IC> <IC>src/middleware/</IC> <IC>src/lib/</IC> <IC>src/sockets/</IC> <IC>src/crons/</IC> <IC>prisma/</IC> <IC>keys/</IC>
        </InfoCard>
      </div>

      <SectionH>Backend modules</SectionH>
      <RowList items={[
        { label: "activity", desc: "Audit trail — logs every task/workspace mutation" },
        { label: "analytics", desc: "DAU stats, workspace usage, productivity metrics" },
        { label: "attachment", desc: "File attachment CRUD linked to tasks" },
        { label: "calendar", desc: "Scheduling logic, insights, aggregation" },
        { label: "comment", desc: "Task comments, @mention parsing, replies" },
        { label: "dailyTask", desc: "Daily task list with cron-based reset" },
        { label: "fileManagement", desc: "File listing, filters, workspace-scoped storage" },
        { label: "focusSession", desc: "Focus Mode sessions, analytics, stats" },
        { label: "label", desc: "Per-project task labels with color" },
        { label: "notification", desc: "SSE notification records, mark-read" },
        { label: "project", desc: "Project CRUD, members, slug, stats" },
        { label: "storage", desc: "Signed upload URLs, storage quota" },
        { label: "task", desc: "Full task lifecycle, filters, activity, notifications" },
        { label: "upload", desc: "Multipart upload handler" },
        { label: "workspace", desc: "Workspace CRUD, member roles, invitations" },
      ]} />

      <Tip>Every module is self-contained. Adding a new domain feature means creating a new folder under <IC>src/modules/</IC> — you never touch other modules.</Tip>
    </div>
  );
}
