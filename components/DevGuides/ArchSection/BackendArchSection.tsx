"use client";
import { CodeBlock, IC, Prose, RowList, SectionH, Warn, } from "../";
export function BackendArchSection() {
  return (
    <div>
      <Prose>
        The backend is a modular monolith. Every domain (task, project, workspace, etc.) is a self-contained module under <IC>src/modules/</IC>. Modules share one Express server and one Prisma client instance.
      </Prose>

      <SectionH>Module file conventions</SectionH>
      <Prose>Each module follows this exact file naming pattern:</Prose>
      <RowList items={[
        { label: "[module].routes.ts", desc: "Express router — defines HTTP routes and attaches middleware" },
        { label: "[module].controller.ts", desc: "Thin request handlers. Parses req, calls service layer, sends res" },
        { label: "[module].query.ts", desc: "All read operations — Prisma findMany, findUnique, counts" },
        { label: "[module].mutation.ts", desc: "All write operations — create, update, delete via Prisma" },
        { label: "[module].access.ts", desc: "Authorization checks — throws 403 if the caller lacks permission" },
        { label: "[module].validators.ts", desc: "Input validation using Zod or manual checks" },
        { label: "[module].types.ts", desc: "TypeScript interfaces and types local to this module" },
        { label: "[module].selects.ts", desc: "Prisma select objects — reusable field projections" },
        { label: "[module].activity.ts", desc: "Activity log helpers called after mutations (modules that track changes)" },
        { label: "[module].notifications.ts", desc: "SSE notification helpers (modules that emit events)" },
        { label: "index.ts", desc: "Barrel — re-exports the router for registration in src/index.ts" },
      ]} />

      <SectionH>Request flow</SectionH>
      <CodeBlock label="request lifecycle">{`Request
  → authenticate middleware   (validates RS256 JWT, attaches req.user)
  → authorize middleware      (checks workspace role if needed)
  → [module].routes.ts        (matches the route)
  → [module].controller.ts    (parses params/body)
  → [module].access.ts        (throws 403 if unauthorized)
  → [module].validators.ts    (throws 400 if input invalid)
  → [module].query.ts         (reads) or [module].mutation.ts (writes)
  → [module].activity.ts      (logs what changed)
  → [module].notifications.ts (emits SSE event if needed)
  → res.json(result)`}</CodeBlock>

      <SectionH>resolveWorkspaceId helper</SectionH>
      <Prose>
        Many routes accept workspaceId from different places. Use the shared helper to normalize it:
      </Prose>
      <CodeBlock label="middleware/auth.ts">{`// Resolves workspaceId from params, body, or query — in that priority order
export function resolveWorkspaceId(req: Request): string {
  const id =
    req.params.workspaceId ??
    req.params.id ??
    req.body?.workspaceId ??
    req.query?.workspaceId;

  if (!id) throw new AppError("workspaceId is required", 400);
  return id;
}`}</CodeBlock>

      <SectionH>Controller pattern</SectionH>
      <CodeBlock label="task.controller.ts">{`export class TaskController {
  static async createTask(req: Request, res: Response) {
    const workspaceId = resolveWorkspaceId(req);
    const { userId } = req.user!;

    await TaskAccess.canCreateTask(workspaceId, userId);
    const validated = TaskValidators.create(req.body);
    const task = await TaskMutation.create(workspaceId, userId, validated);
    await TaskActivity.log("CREATED", task, userId);
    await TaskNotifications.notifyAssignee(task);

    res.status(201).json(task);
  }
}`}</CodeBlock>

      <Warn>
        Keep controllers thin. If you find yourself writing conditional logic or Prisma queries inside a controller, move it to <IC>[module].access.ts</IC> or <IC>[module].mutation.ts</IC>.
      </Warn>
    </div>
  );
}