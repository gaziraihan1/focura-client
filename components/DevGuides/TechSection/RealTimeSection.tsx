"use client";

import { CodeBlock, IC, Prose, SectionH, Tip } from "../";

export function RealtimeSection() {
  return (
    <div>
      <Prose>
        Focura uses Server-Sent Events (SSE) for real-time notifications. The backend maintains a persistent SSE stream per user. When a task is assigned, a comment is posted, or a meeting is scheduled, the backend pushes an event to all relevant connected clients.
      </Prose>

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

      <SectionH>Notification URL convention</SectionH>
      <Prose>All notification URLs use workspace slugs (not IDs) for clean deep links:</Prose>
      <CodeBlock label="src/utils/notification.helpers.ts">{`const slug = await getWorkspaceSlug(workspaceId);
const url = \`/\${slug}/tasks/\${taskId}\`;`}</CodeBlock>

      <Tip>SSE connections drop on deployment restarts. The frontend <IC>EventSource</IC> auto-reconnects, but notify users if they&apos;re offline for extended periods to prompt a manual refresh.</Tip>
    </div>
  );
}