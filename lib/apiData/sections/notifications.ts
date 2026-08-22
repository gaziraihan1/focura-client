import { FULL_BASE, type ApiSection } from '../types';

export const notificationsSection: ApiSection = {
  id         : 'notifications',
  title      : 'Notifications',
  description: 'Real-time notifications via SSE. The /stream endpoint opens a persistent connection that pushes events. REST endpoints manage the notification inbox.',
  endpoints  : [
    {
      id         : 'notifications-stream',
      method     : 'GET',
      path       : '/api/v1/notifications/stream',
      summary    : 'Open SSE notification stream',
      description: 'Opens a persistent Server-Sent Events connection. The server pushes notification events in real-time. Reconnect automatically on disconnect with exponential backoff. Events are JSON-serialised notification objects preceded by "data: ".',
      auth       : 'auth',
      responses  : [
        { status: 200, description: 'EventStream opened (Content-Type: text/event-stream)', shape: [
          { name: 'event: notification', type: 'string', description: 'Notification event type' },
          { name: 'data.type',           type: 'string', description: 'NotificationType enum value' },
          { name: 'data.title',          type: 'string', description: 'Notification title' },
          { name: 'data.message',        type: 'string', description: 'Notification body' },
          { name: 'data.actionUrl',      type: 'string?', description: 'Deep-link URL' },
        ]},
      ],
      examples: [
        { label: 'EventSource (JS)', code: `// SSE is authenticated via a\n// query-param token (EventSource can't send custom headers).\nconst token = '<accessToken>'; // from session.backendToken\nconst es = new EventSource(\n  \`${FULL_BASE}/notifications/stream?token=\${token}\`\n);\n\nes.addEventListener('notification', (e) => {\n  const notification = JSON.parse(e.data);\n  console.log(notification.title);\n});\n\nes.onerror = () => {\n  // Browser auto-reconnects with backoff\n};` },
        { label: 'React hook', code: `useEffect(() => {\n  // No withCredentials: auth is via ?token=, not cookies.\n  const es = new EventSource(\n    \`\${API_BASE}/notifications/stream?token=\${accessToken}\`\n  );\n  es.addEventListener('notification', handler);\n  return () => es.close();\n}, [accessToken]);` },
      ],
      tags: ['notifications', 'sse'],
    },
    {
      id         : 'notifications-list',
      method     : 'GET',
      path       : '/api/v1/notifications',
      summary    : 'List notifications',
      description: 'Returns paginated notification inbox for the authenticated user.',
      auth       : 'auth',
      queryParams: [
        { name: 'read',  type: 'boolean', required: false, description: 'Filter by read status' },
        { name: 'page',  type: 'number',  required: false, description: 'Default: 1' },
        { name: 'limit', type: 'number',  required: false, description: 'Default: 20' },
      ],
      responses  : [
        { status: 200, description: 'Paginated notification list' },
      ],
      examples: [
        { label: 'cURL', code: `curl "${FULL_BASE}/notifications?read=false" \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['notifications'],
    },
    {
      id         : 'notifications-read-all',
      method     : 'PATCH',
      path       : '/api/v1/notifications/read-all',
      summary    : 'Mark all notifications as read',
      description: 'Marks every unread notification for the caller as read in a single operation.',
      auth       : 'auth',
      responses  : [
        { status: 200, description: 'All notifications marked as read' },
      ],
      examples: [
        { label: 'Axios', code: `await axios.patch('/api/v1/notifications/read-all', {},\n  { headers: { Authorization: \`Bearer \${token}\` } }\n);` },
      ],
      tags: ['notifications'],
    },
  ],
};
