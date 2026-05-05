"use client";
import { CodeBlock, IC, RowList, SectionH, Table, Tip } from "../";

export function ConventionsSection() {
  return (
    <div>
      <SectionH>TypeScript rules</SectionH>
      <RowList items={[
        { label: "No any", desc: "TypeScript's any disables type checking — use unknown and narrow, or define the type" },
        { label: "satisfies operator", desc: "Use satisfies Prisma.TaskSelect on selects for type-safe field projection without widening" },
        { label: "Strict nulls", desc: "Always handle null/undefined — use optional chaining (?.) and nullish coalescing (??)" },
        { label: "Interfaces over types", desc: "Use interface for object shapes; type for unions, intersections, and aliases" },
      ]} />

      <SectionH>Naming conventions</SectionH>
      <Table
        headers={["Thing", "Convention", "Example"]}
        rows={[
          ["Components", "PascalCase", "TaskCard, MeetingFormModal"],
          ["Hooks", "camelCase + use prefix", "useTasks, useCreateTask"],
          ["Query keys", "camelCase + Keys suffix", "taskKeys, projectKeys"],
          ["Backend modules", "camelCase folder", "focusSession, dailyTask"],
          ["Module files", "[module].[role].ts", "task.mutation.ts, task.access.ts"],
          ["DB migrations", "snake_case descriptor", "add_reaction, add_project_slug"],
          ["Branches", "prefix/descriptor", "feature/reactions, fix/refresh-lock"],
        ]}
      />

      <SectionH>Commit message format</SectionH>
      <CodeBlock label="examples">{`feat: add emoji reactions to tasks
fix: resolve refreshLocks race condition in authOptions
refactor: extract resolveWorkspaceId into shared middleware
docs: update ARCHITECTURE.md with SSE stream pattern
test: add useCreateTask mutation tests`}</CodeBlock>

      <SectionH>Branching strategy</SectionH>
      <RowList items={[
        { label: "main", desc: "Stable, production-ready — never commit directly" },
        { label: "dev", desc: "Active development — all PRs target this branch" },
        { label: "feature/*", desc: "New features — always branch from dev" },
        { label: "fix/*", desc: "Bug fixes — always branch from dev" },
        { label: "refactor/*", desc: "Refactoring without behavior change" },
      ]} />

      <SectionH>What not to do</SectionH>
      <RowList items={[
        { label: "No Prisma in controllers", desc: "Prisma queries belong in .query.ts or .mutation.ts — never inline in controllers" },
        { label: "No API calls in components", desc: "Components render data from hooks — they never call api.get() directly" },
        { label: "No logic in pages", desc: "Next.js pages import and render — business logic belongs in hooks" },
        { label: "No cross-module imports", desc: "Modules should not import from each other — use shared utils/ or lib/ instead" },
        { label: "No hardcoded workspace IDs", desc: "Always resolve workspaceId dynamically — never hardcode in queries" },
      ]} />

      <Tip>
        Before opening a PR: run <IC>npm run build</IC> on the client (catches type errors the dev server misses) and manually test the affected feature end-to-end.
      </Tip>
    </div>
  );
}