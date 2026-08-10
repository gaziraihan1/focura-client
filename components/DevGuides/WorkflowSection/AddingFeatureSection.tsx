"use client";

import type { GuideArticle } from "@/types/guides.types";
import { CodeBlock, FileTree, Prose, SectionH, Tip } from "../";

export const addingFeatureArticles: GuideArticle[] = [
  {
    id: "walkthrough-overview",
    title: "Walkthrough overview",
    summary:
      "An end-to-end guide to adding a new feature, using a hypothetical Reaction (emoji reactions on tasks) feature as the example.",
    content: (
      <>
        <Prose>
          This is an end-to-end walkthrough of adding a new feature — using a hypothetical
          &quot;Reaction&quot; feature (emoji reactions on tasks) as the example.
        </Prose>
        <Tip>
          Follow this exact order every time: schema → migration → access → mutation/query →
          controller → routes → types → hook → component. Skipping layers causes cascading issues.
        </Tip>
      </>
    ),
  },
  {
    id: "backend-steps",
    title: "Backend — module, schema, access & routes",
    summary:
      "Create the reaction module folder structure, define the Prisma model with a unique constraint, implement access checks, and register routes in src/index.ts.",
    content: (
      <>
        <SectionH>Step 1 — Backend: create the module</SectionH>
        <FileTree>{`src/modules/reaction/
├── reaction.routes.ts
├── reaction.controller.ts
├── reaction.access.ts
├── reaction.validators.ts
├── reaction.mutation.ts
├── reaction.query.ts
├── reaction.selects.ts
├── reaction.types.ts
└── index.ts`}</FileTree>

        <SectionH>Step 2 — Backend: define the Prisma model</SectionH>
        <CodeBlock label="prisma/schema.prisma">{`model Reaction {
  id          String   @id @default(cuid())
  emoji       String
  userId      String
  taskId      String
  workspaceId String
  createdAt   DateTime @default(now())

  user      User      @relation(fields: [userId], references: [id])
  task      Task      @relation(fields: [taskId], references: [id], onDelete: Cascade)
  workspace Workspace @relation(fields: [workspaceId], references: [id])

  @@unique([userId, taskId, emoji])
}`}</CodeBlock>
        <CodeBlock label="terminal">{`npx prisma migrate dev --name add-reaction`}</CodeBlock>

        <SectionH>Step 3 — Backend: implement access + mutation + query</SectionH>
        <CodeBlock label="reaction.access.ts">{`export class ReactionAccess {
  static async canReact(workspaceId: string, userId: string) {
    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!member) throw new AppError("Not a workspace member", 403);
  }
}`}</CodeBlock>

        <SectionH>Step 4 — Backend: register routes in src/index.ts</SectionH>
        <CodeBlock label="src/index.ts">{`import reactionRoutes from "./modules/reaction";
app.use("/api/v1/workspaces/:workspaceId/reactions", authenticate, reactionRoutes);`}</CodeBlock>
      </>
    ),
  },
  {
    id: "frontend-steps",
    title: "Frontend — types, hook & component",
    summary:
      "Add the Reaction types, build a useAddReaction mutation hook with keyed cache invalidation, and wire up a React component.",
    content: (
      <>
        <SectionH>Step 5 — Frontend: add types</SectionH>
        <CodeBlock label="types/reaction.types.ts">{`export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  user: { name: string; image: string };
}

export interface AddReactionInput {
  emoji: string;
  taskId: string;
}`}</CodeBlock>

        <SectionH>Step 6 — Frontend: create the hook</SectionH>
        <CodeBlock label="hooks/useReactions.ts">{`export const reactionKeys = {
  task: (workspaceId: string, taskId: string) =>
    ["reactions", workspaceId, taskId] as const,
};

export function useAddReaction(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddReactionInput) =>
      api
        .post(\`/workspaces/\${workspaceId}/reactions\`, data)
        .then(r => r.data),
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({
        queryKey: reactionKeys.task(workspaceId, taskId),
      });
    },
  });
}`}</CodeBlock>

        <SectionH>Step 7 — Frontend: build the component</SectionH>
        <CodeBlock label="components/Task/ReactionPicker.tsx">{`"use client";

export function ReactionPicker({ workspaceId, taskId }: Props) {
  const { mutate: addReaction } = useAddReaction(workspaceId);

  return (
    <div className="flex gap-1">
      {EMOJIS.map(emoji => (
        <button
          key={emoji}
          onClick={() => addReaction({ emoji, taskId })}
          className="text-lg hover:scale-125 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}`}</CodeBlock>
      </>
    ),
  },
];
