"use client";

import type { GuideArticle } from "@/types/guides.types";
import { CodeBlock, IC, Prose, SectionH, Tip } from "../";

export const realtimeArticles: GuideArticle[] = [
  {
    id: "sse-overview",
    title: "SSE overview",
    summary:
      "Focura uses Server-Sent Events for real-time notifications, pushing task, comment, and meeting events to all connected clients.",
    content: (
      <Prose>
        Focura uses Server-Sent Events (SSE) for real-time notifications. The backend maintains a
        persistent SSE stream per user. When a task is assigned, a comment is posted, or a meeting
        is scheduled, the backend pushes an event to all relevant connected clients.
      </Prose>
    ),
  },
  {
    id: "backend-stream-manager",
    title: "Backend — stream manager",
    summary:
      "A userId → Response map registers SSE clients and writes JSON events to them on notifyUser.",
    content: (
      <>
        <SectionH>Backend — stream manager</SectionH>
        <CodeBlock label="src/sockets/notification.stream.ts">{`// Map of userId → SSE response object
const clients = new Map<string, Response>();

export function addClient(userId: string, res: Response) {
  clients.set(userId, res);
  res.on("close", () => clients.delete(userId));
}

export function notifyUser(userId: string, event: NotificationEvent) {
  const client = clients.get(userId);
  if (client) {
    client.write(\`data: \${JSON.stringify(event)}\\n\\n\`);
  }
}`}</CodeBlock>
      </>
    ),
  },
  {
    id: "backend-sse-endpoint",
    title: "Backend — SSE endpoint",
    summary:
      "The /stream route sets event-stream headers, registers the client, and pings every 30 seconds to prevent proxy timeouts.",
    content: (
      <>
        <SectionH>Backend — SSE endpoint</SectionH>
        <CodeBlock label="notification.routes.ts">{`router.get("/stream", authenticate, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addClient(req.user!.userId, res);

  // Keep-alive ping every 30s to prevent proxy timeouts
  const ping = setInterval(() => res.write(": ping\\n\\n"), 30_000);
  req.on("close", () => clearInterval(ping));
});`}</CodeBlock>
      </>
    ),
  },
  {
    id: "frontend-consuming-sse",
    title: "Frontend — consuming SSE",
    summary:
      "The frontend opens an EventSource with credentials and invalidates notification queries on every message.",
    content: (
      <>
        <SectionH>Frontend — consuming SSE</SectionH>
        <CodeBlock label="hooks/useNotificationStream.ts">{`useEffect(() => {
  const es = new EventSource(
    \`\${process.env.NEXT_PUBLIC_API_URL}/notifications/stream\`,
    { withCredentials: true }
  );

  es.onmessage = (e) => {
    const event = JSON.parse(e.data);
    qc.invalidateQueries({ queryKey: notificationKeys.all() });
    // Optionally show a toast
  };

  return () => es.close();
}, []);`}</CodeBlock>
      </>
    ),
  },
  {
    id: "notification-url-convention",
    title: "Notification URL convention",
    summary:
      "Notification URLs use workspace slugs instead of IDs for clean deep links — e.g. /[slug]/tasks/[taskId].",
    content: (
      <>
        <SectionH>Notification URL convention</SectionH>
        <Prose>All notification URLs use workspace slugs (not IDs) for clean deep links:</Prose>
        <CodeBlock label="src/utils/notification.helpers.ts">{`const slug = await getWorkspaceSlug(workspaceId);
const url = \`/\${slug}/tasks/\${taskId}\`;`}</CodeBlock>

        <Tip>
          SSE connections drop on deployment restarts. The frontend <IC>EventSource</IC>{" "}
          auto-reconnects, but notify users if they&apos;re offline for extended periods to prompt a
          manual refresh.
        </Tip>
      </>
    ),
  },
];
