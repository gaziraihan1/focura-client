"use client";
import { CodeBlock, IC, Prose, RowList, SectionH, Warn } from "../";

export function DatabaseSection() {
  return (
    <div>
      <Prose>
        Focura uses PostgreSQL (hosted on Supabase) accessed via Prisma ORM. The schema enforces workspace isolation — every major model carries a <IC>workspaceId</IC> field.
      </Prose>

      <SectionH>Two connection URLs</SectionH>
      <CodeBlock label=".env (backend)">{`# Pooled connection — used for all Prisma queries
DATABASE_URL="postgresql://postgres.xyz:PASSWORD@aws-0-ap.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection — used only for migrations (no pooler)
DIRECT_URL="postgresql://postgres.xyz:PASSWORD@aws-0-ap.supabase.com:5432/postgres"`}</CodeBlock>

      <Warn>
        The <IC>DIRECT_URL</IC> host must use the Supabase <em>direct</em> host (not the pooler). Using the pooler host for migrations will cause timeout errors.
      </Warn>

      <SectionH>Workspace isolation pattern</SectionH>
      <CodeBlock label="Every query must be workspace-scoped">{`// ✅ Workspace-safe
const tasks = await prisma.task.findMany({
  where: { workspaceId, project: { workspaceId } },
});

// ❌ Never query without workspaceId — cross-tenant data leak
const tasks = await prisma.task.findMany({
  where: { assigneeId: userId },
});`}</CodeBlock>

      <SectionH>Selects pattern</SectionH>
      <Prose>Reusable Prisma <IC>select</IC> objects live in <IC>[module].selects.ts</IC> to avoid N+1 queries and keep projections consistent:</Prose>
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

      <SectionH>Unique project slugs</SectionH>
      <CodeBlock label="prisma/schema.prisma">{`model Project {
  id          String  @id @default(cuid())
  workspaceId String
  slug        String

  @@unique([workspaceId, slug])  // slug is unique per workspace, not globally
}`}</CodeBlock>

      <SectionH>Common Prisma commands</SectionH>
      <RowList items={[
        { label: "npx prisma migrate dev", desc: "Create and apply a new migration in development" },
        { label: "npx prisma migrate deploy", desc: "Apply pending migrations in production" },
        { label: "npx prisma db seed", desc: "Run seed file — required after fresh migration (populates Plan table etc.)" },
        { label: "npx prisma studio", desc: "Open visual database browser at localhost:5555" },
        { label: "npx prisma generate", desc: "Regenerate Prisma client after schema changes" },
      ]} />
    </div>
  );
}