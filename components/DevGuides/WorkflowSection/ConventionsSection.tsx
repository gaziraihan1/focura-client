"use client";

import type { GuideArticle } from "@/types/guides.types";
import { CodeBlock, IC, RowList, SectionH, Table, Tip } from "../";

export const conventionsArticles: GuideArticle[] = [
  {
    id: "typescript-rules",
    title: "TypeScript rules",
    summary:
      "No any — use unknown and narrow; satisfies operator for Prisma selects; strict null handling; interfaces for shapes and type for unions.",
    content: (
      <>
        <SectionH>TypeScript rules</SectionH>
        <RowList
          items={[
            { label: "No any", desc: "TypeScript's any disables type checking — use unknown and narrow, or define the type" },
            { label: "satisfies operator", desc: "Use satisfies Prisma.TaskSelect on selects for type-safe field projection without widening" },
            { label: "Strict nulls", desc: "Always handle null/undefined — use optional chaining (?.) and nullish coalescing (??)" },
            { label: "Interfaces over types", desc: "Use interface for object shapes; type for unions, intersections, and aliases" },
          ]}
        />
      </>
    ),
  },
  {
    id: "naming-conventions",
    title: "Naming conventions",
    summary:
      "PascalCase components, camelCase hooks with use prefix, Keys-suffixed query key factories, [module].[role].ts backend files and snake_case migrations.",
    content: (
      <>
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
      </>
    ),
  },
  {
    id: "commit-message-format",
    title: "Commit message format",
    summary:
      "Conventional commits — feat, fix, refactor, docs and test prefixes with concise descriptions.",
    content: (
      <>
        <SectionH>Commit message format</SectionH>
        <CodeBlock label="examples">{`feat: add emoji reactions to tasks
fix: resolve refreshLocks race condition in authOptions
refactor: extract resolveWorkspaceId into shared middleware
docs: update ARCHITECTURE.md with SSE stream pattern
test: add useCreateTask mutation tests`}</CodeBlock>
      </>
    ),
  },
  {
    id: "branching-strategy",
    title: "Branching strategy",
    summary:
      "main is stable and protected, dev is the integration target, and feature, fix and refactor branches always branch from dev.",
    content: (
      <>
        <SectionH>Branching strategy</SectionH>
        <RowList
          items={[
            { label: "main", desc: "Stable, production-ready — never commit directly" },
            { label: "dev", desc: "Active development — all PRs target this branch" },
            { label: "feature/*", desc: "New features — always branch from dev" },
            { label: "fix/*", desc: "Bug fixes — always branch from dev" },
            { label: "refactor/*", desc: "Refactoring without behavior change" },
          ]}
        />
      </>
    ),
  },
  {
    id: "what-not-to-do",
    title: "What not to do",
    summary:
      "No Prisma in controllers, no API calls in components, no logic in pages, no cross-module imports, and no hardcoded workspace IDs.",
    content: (
      <>
        <SectionH>What not to do</SectionH>
        <RowList
          items={[
            { label: "No Prisma in controllers", desc: "Prisma queries belong in .query.ts or .mutation.ts — never inline in controllers" },
            { label: "No API calls in components", desc: "Components render data from hooks — they never call api.get() directly" },
            { label: "No logic in pages", desc: "Next.js pages import and render — business logic belongs in hooks" },
            { label: "No cross-module imports", desc: "Modules should not import from each other — use shared utils/ or lib/ instead" },
            { label: "No hardcoded workspace IDs", desc: "Always resolve workspaceId dynamically — never hardcode in queries" },
          ]}
        />

        <Tip>
          Before opening a PR: run <IC>npm run build</IC> on the client (catches type errors the dev
          server misses) and manually test the affected feature end-to-end.
        </Tip>
      </>
    ),
  },
];
