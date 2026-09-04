"use client";

import type { GuideArticle } from "@/types/guides.types";
import { CodeBlock, IC, Prose, RowList, SectionH, Warn } from "../";

export const databaseArticles: GuideArticle[] = [
  {
    id: "postgres-plus-prisma",
    title: "PostgreSQL + Prisma",
    summary:
      "PostgreSQL hosted on Supabase accessed via Prisma ORM, with workspace isolation enforced on every major model through a workspaceId field.",
    content: (
      <Prose>
        Gablura uses PostgreSQL (hosted on Supabase) accessed via Prisma ORM. The schema enforces
        workspace isolation — every major model carries a <IC>workspaceId</IC> field.
      </Prose>
    ),
  },
  {
    id: "two-connection-urls",
    title: "Two connection URLs",
    summary:
      "DATABASE_URL is the pooled connection for queries; DIRECT_URL is the direct connection used only for migrations — never run migrations through the pooler.",
    content: (
      <>
        <SectionH>Two connection URLs</SectionH>
        <CodeBlock label=".env (backend)">{`# Pooled connection — used for all Prisma queries
DATABASE_URL="postgresql://postgres.xyz:PASSWORD@aws-0-ap.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection — used only for migrations (no pooler)
DIRECT_URL="postgresql://postgres.xyz:PASSWORD@aws-0-ap.supabase.com:5432/postgres"`}</CodeBlock>

        <Warn>
          The <IC>DIRECT_URL</IC> host must use the Supabase <em>direct</em> host (not the pooler).
          Using the pooler host for migrations will cause timeout errors.
        </Warn>
      </>
    ),
  },
  {
    id: "workspace-isolation",
    title: "Workspace isolation pattern",
    summary:
      "Every Prisma query must be workspace-scoped — querying without workspaceId is a cross-tenant data leak.",
    content: (
      <>
        <SectionH>Workspace isolation pattern</SectionH>
        <CodeBlock label="Every query must be workspace-scoped">{`// ✅ Workspace-safe
const tasks = await prisma.task.findMany({
  where: { workspaceId, project: { workspaceId } },
});

// ❌ Never query without workspaceId — cross-tenant data leak
const tasks = await prisma.task.findMany({
  where: { assigneeId: userId },
});`}</CodeBlock>
      </>
    ),
  },
  {
    id: "selects-pattern",
    title: "Selects pattern",
    summary:
      "Reusable Prisma select objects in [module].selects.ts avoid N+1 queries and keep projections consistent with the satisfies operator.",
    content: (
      <>
        <SectionH>Selects pattern</SectionH>
        <Prose>
          Reusable Prisma <IC>select</IC> objects live in <IC>[module].selects.ts</IC> to avoid N+1
          queries and keep projections consistent:
        </Prose>
        <CodeBlock label="task.selects.ts">{`export const taskSelect = {
  id: true,
  title: true,
  status: true,
  priority: true,
  dueDate: true,
  assignee: { select: { id: true, name: true, image: true } },
  labels: { select: { id: true, name: true, color: true } },
  _count: { select: { subtasks: true, comments: true } },
} satisfies Prisma.TaskSelect;`}</CodeBlock>
      </>
    ),
  },
  {
    id: "unique-project-slugs",
    title: "Unique project slugs",
    summary:
      "Project slugs are unique per workspace, not globally — enforced with @@unique([workspaceId, slug]).",
    content: (
      <>
        <SectionH>Unique project slugs</SectionH>
        <CodeBlock label="prisma/schema.prisma">{`model Project {
  id          String  @id @default(cuid())
  workspaceId String
  slug        String

  @@unique([workspaceId, slug])  // slug is unique per workspace, not globally
}`}</CodeBlock>
      </>
    ),
  },
  {
    id: "common-prisma-commands",
    title: "Common Prisma commands",
    summary:
      "migrate dev, migrate deploy, db seed, studio and generate — the everyday Prisma workflow commands and when to use each.",
    content: (
      <>
        <SectionH>Common Prisma commands</SectionH>
        <RowList
          items={[
            { label: "npx prisma migrate dev", desc: "Create and apply a new migration in development" },
            { label: "npx prisma migrate deploy", desc: "Apply pending migrations in production" },
            { label: "npx prisma db seed", desc: "Run seed file — required after fresh migration (populates Plan table etc.)" },
            { label: "npx prisma studio", desc: "Open visual database browser at localhost:5555" },
            { label: "npx prisma generate", desc: "Regenerate Prisma client after schema changes" },
          ]}
        />
      </>
    ),
  },
];
