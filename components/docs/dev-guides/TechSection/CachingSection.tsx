"use client";

import type { GuideArticle } from "@/types/guides.types";
import { CodeBlock, IC, Prose, SectionH, Tip } from "../";

export const cachingArticles: GuideArticle[] = [
  {
    id: "upstash-redis",
    title: "Upstash Redis",
    summary:
      "Upstash Redis is used for API response caching to reduce DB load and for JWT JTI revocation so logout is instant without waiting for token expiry.",
    content: (
      <Prose>
        Upstash Redis is used for two things: API response caching (reduce DB load) and JWT JTI
        revocation (instant logout without waiting for token expiry).
      </Prose>
    ),
  },
  {
    id: "connection-tls",
    title: "Connection (TLS required)",
    summary:
      "Upstash requires the rediss:// TLS protocol — using redis:// silently fails with connection errors in production.",
    content: (
      <>
        <SectionH>Connection (TLS required)</SectionH>
        <CodeBlock label="src/lib/redis.ts">{`import { Redis } from "@upstash/redis";

// Upstash requires TLS — use the rediss:// protocol
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,  // rediss://...
  token: process.env.UPSTASH_REDIS_TOKEN!,
});`}</CodeBlock>
      </>
    ),
  },
  {
    id: "cache-invalidation",
    title: "Cache invalidation — invalidateTaskCaches",
    summary:
      "When a task is mutated, invalidateTaskCaches clears cached lists by workspace and by each affected user.",
    content: (
      <>
        <SectionH>Cache invalidation — invalidateTaskCaches</SectionH>
        <Prose>
          When a task is mutated, all affected users&apos; cached task lists must be cleared. The
          helper invalidates by workspace and by individual user:
        </Prose>
        <CodeBlock label="task.mutation.ts">{`await invalidateTaskCaches({
  workspaceId,
  projectId: task.projectId,
  affectedUserIds: [task.assigneeId, previousAssigneeId].filter(Boolean),
});`}</CodeBlock>
      </>
    ),
  },
  {
    id: "optimistic-updates",
    title: "Optimistic updates + stale cache",
    summary:
      "For optimistic updates, set staleTime: 0 and delay invalidateQueries so Redis can't overwrite the optimistic state before the server confirms.",
    content: (
      <>
        <SectionH>Optimistic updates + stale cache</SectionH>
        <Prose>
          When using optimistic updates (e.g. plan change), set <IC>staleTime: 0</IC> and add a
          delayed <IC>invalidateQueries</IC> call to prevent the Redis cache from overwriting the
          optimistic state before the server confirms:
        </Prose>
        <CodeBlock label="hooks/useChangePlan.ts">{`onMutate: async (newPlan) => {
  await qc.cancelQueries({ queryKey: planKeys.current(workspaceId) });
  const snapshot = qc.getQueryData(planKeys.current(workspaceId));
  qc.setQueryData(planKeys.current(workspaceId), newPlan); // optimistic
  return { snapshot };
},
onSettled: () => {
  // Delay invalidation so Redis cache has time to clear before refetch
  setTimeout(() => {
    qc.invalidateQueries({ queryKey: planKeys.current(workspaceId) });
  }, 500);
},`}</CodeBlock>
      </>
    ),
  },
  {
    id: "jwt-revocation",
    title: "JWT revocation",
    summary:
      "On logout the JTI is stored in Redis with a TTL equal to the remaining token lifetime, and authenticate middleware rejects revoked tokens.",
    content: (
      <>
        <SectionH>JWT revocation</SectionH>
        <CodeBlock label="src/lib/auth/tokenRevocation.ts">{`// On logout: store the JTI in Redis with TTL = remaining token lifetime
await redis.set(\`revoked:\${jti}\`, "1", { ex: remainingSeconds });

// In authenticate middleware: check before accepting any token
const isRevoked = await redis.get(\`revoked:\${decoded.jti}\`);
if (isRevoked) throw new AppError("Token revoked", 401);`}</CodeBlock>

        <Tip>
          Upstash Redis requires the <IC>rediss://</IC> (TLS) scheme. Using <IC>redis://</IC> will
          silently fail with connection errors in production.
        </Tip>
      </>
    ),
  },
];
