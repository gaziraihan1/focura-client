import { Wifi, AlertTriangle } from 'lucide-react';

const eventTypes = [
  { type: 'TASK_ASSIGNED',       description: 'A task was assigned to you' },
  { type: 'TASK_COMPLETED',      description: 'A task you created or are assigned to was completed' },
  { type: 'TASK_COMMENTED',      description: 'A comment was added to a task you\'re involved with' },
  { type: 'MENTION',             description: 'You were @mentioned in a comment' },
  { type: 'TASK_DUE_SOON',       description: 'A task assigned to you is due within 24 hours' },
  { type: 'TASK_OVERDUE',        description: 'A task assigned to you has passed its due date' },
  { type: 'MEMBER_JOINED',       description: 'A new member joined a workspace you belong to' },
  { type: 'MEMBER_REMOVED',      description: 'A member was removed from the workspace' },
  { type: 'ROLE_UPDATED',        description: 'Your workspace role was changed' },
  { type: 'WORKSPACE_INVITE',    description: 'You received a workspace invitation' },
  { type: 'PROJECT_UPDATE',      description: 'A project you\'re a member of was updated' },
  { type: 'FILE_SHARED',         description: 'A file was uploaded to a project or task you are on' },
  { type: 'MEETING_CREATED',     description: 'A new meeting was created in your workspace' },
  { type: 'MEETING_UPDATED',     description: 'A meeting you\'re attending was updated' },
  { type: 'MEETING_CANCELLED',   description: 'A meeting you\'re attending was cancelled' },
  { type: 'MEETING_REMINDER',    description: 'A meeting you\'re attending starts in 15 minutes' },
  { type: 'DEADLINE_REMINDER',   description: 'A task deadline reminder' },
  { type: 'ANNOUNCEMENT',        description: 'A workspace announcement was posted' },
];

const sseExampleEvent = `// Raw SSE stream from the server:

event: notification
data: {
  "id"       : "cm_notif_abc123",
  "type"     : "TASK_ASSIGNED",
  "title"    : "Task assigned to you",
  "message"  : "Raihan assigned 'Implement dark mode' to you",
  "read"     : false,
  "actionUrl": "/workspace/cm_ws_xyz/tasks/cm_task_abc",
  "createdAt": "2026-04-30T14:22:00.000Z",
  "sender"   : {
    "id"   : "cm_user_raihan",
    "name" : "Mohammad Raihan",
    "image": "https://res.cloudinary.com/..."
  }
}`;

const reactHookExample = `// hooks/useNotifications.ts
import { useEffect, useCallback } from 'react';
import { useQueryClient }         from '@tanstack/react-query';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

export function useNotifications() {
  const queryClient = useQueryClient();

  const handleEvent = useCallback((event: MessageEvent) => {
    const notification = JSON.parse(event.data);

    // 1. Optimistically add to local notification list
    queryClient.setQueryData(['notifications'], (old: any) => ({
      ...old,
      data: {
        ...old?.data,
        notifications: [notification, ...(old?.data?.notifications ?? [])],
      },
    }));

    // 2. Invalidate relevant queries based on notification type
    if (['TASK_ASSIGNED', 'TASK_COMPLETED'].includes(notification.type)) {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
    if (notification.type === 'MEMBER_JOINED') {
      queryClient.invalidateQueries({ queryKey: ['workspace-members'] });
    }
  }, [queryClient]);

  useEffect(() => {
    const es = new EventSource(\`\${API}/api/v1/notifications/stream\`, {
      withCredentials: true,   // sends HTTP-only auth cookie
    });

    es.addEventListener('notification', handleEvent);

    es.onerror = () => {
      // Browser auto-reconnects with exponential backoff
      console.warn('SSE connection error — reconnecting…');
    };

    return () => {
      es.removeEventListener('notification', handleEvent);
      es.close();
    };
  }, [handleEvent]);
}`;

export const ApiDocsSSE = () => {
  return (
    <section id='sse-guide' className='scroll-mt-24'>
      <div className='flex items-start gap-3 mb-6'>
        <div className='shrink-0 w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'>
          <Wifi className='w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400' strokeWidth={1.8} />
        </div>
        <div>
          <h2 className='text-xl font-bold text-neutral-900 dark:text-neutral-100'>
            Real-time Events (SSE)
          </h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>
            Focura uses Server-Sent Events for real-time push notifications. Each
            authenticated user maintains a persistent GET connection to the stream
            endpoint. No WebSocket infrastructure required.
          </p>
        </div>
      </div>

      {/* Connection info */}
      <div className='grid sm:grid-cols-3 gap-3 mb-6'>
        {[
          { label: 'Protocol',      value: 'Server-Sent Events (SSE)'  },
          { label: 'Endpoint',      value: 'GET /api/v1/notifications/stream' },
          { label: 'Content-Type',  value: 'text/event-stream'         },
        ].map(({ label, value }) => (
          <div key={label} className='rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4'>
            <p className='text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1'>
              {label}
            </p>
            <code className='text-xs font-mono text-neutral-800 dark:text-neutral-200'>
              {value}
            </code>
          </div>
        ))}
      </div>

      {/* Raw event example */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5'>
        <div className='px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>
            SSE Event Shape
          </p>
        </div>
        <pre className='overflow-x-auto p-5 text-[12px] font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950/60 leading-relaxed'>
          <code>{sseExampleEvent}</code>
        </pre>
      </div>

      {/* Notification event types */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5'>
        <div className='px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>
            Notification Event Types ({eventTypes.length} total)
          </p>
        </div>
        <div className='grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 dark:divide-neutral-800'>
          {[eventTypes.slice(0, Math.ceil(eventTypes.length / 2)), eventTypes.slice(Math.ceil(eventTypes.length / 2))].map((col, ci) => (
            <div key={ci} className='divide-y divide-neutral-100 dark:divide-neutral-800'>
              {col.map(({ type, description }) => (
                <div key={type} className='flex items-start gap-3 px-4 py-2.5'>
                  <code className='shrink-0 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded px-1.5 py-0.5 mt-0.5 whitespace-nowrap'>
                    {type}
                  </code>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed'>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* React hook example */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5'>
        <div className='px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>
            React + TanStack Query Integration
          </p>
        </div>
        <pre className='overflow-x-auto p-5 text-[12px] font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950/60 leading-relaxed'>
          <code>{reactHookExample}</code>
        </pre>
      </div>

      <div className='flex items-start gap-2.5 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 px-4 py-3.5'>
        <AlertTriangle className='w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' strokeWidth={2} />
        <div className='space-y-1 text-xs text-amber-800 dark:text-amber-300 leading-relaxed'>
          <p><strong className='font-semibold'>Corporate firewalls and VPNs</strong> may block persistent HTTP connections. If SSE fails, the browser will attempt automatic reconnection with exponential backoff.</p>
          <p><strong className='font-semibold'>Connection limits:</strong> Browsers cap SSE connections per domain at 6 (HTTP/1.1) or unlimited (HTTP/2). Focura runs on HTTP/2 in production on Render.com.</p>
        </div>
      </div>
    </section>
  );
};
