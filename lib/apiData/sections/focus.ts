import { FULL_BASE, type ApiSection } from '../types';

export const focusSection: ApiSection = {
  id         : 'focus',
  title      : 'Focus Sessions',
  description: 'Manage Pomodoro, deep work, and custom focus sessions. Completed sessions are logged for analytics and optional task time-tracking.',
  endpoints  : [
    {
      id         : 'focus-list',
      method     : 'GET',
      path       : '/api/v1/focus',
      summary    : 'List focus sessions',
      description: 'Returns the caller\'s focus session history with optional date range filtering.',
      auth       : 'auth',
      queryParams: [
        { name: 'from',      type: 'string',  required: false, description: 'ISO date — sessions from this date' },
        { name: 'to',        type: 'string',  required: false, description: 'ISO date — sessions to this date' },
        { name: 'type',      type: 'string',  required: false, description: 'POMODORO | DEEP_WORK | SHORT_BREAK | LONG_BREAK | CUSTOM' },
        { name: 'completed', type: 'boolean', required: false, description: 'Filter completed or incomplete sessions' },
        { name: 'page',      type: 'number',  required: false, description: 'Default: 1' },
        { name: 'limit',     type: 'number',  required: false, description: 'Default: 20' },
      ],
      responses  : [
        { status: 200, description: 'Paginated session list', shape: [
          { name: 'data.sessions[].id',        type: 'string',  description: 'Session cuid' },
          { name: 'data.sessions[].type',      type: 'string',  description: 'Focus type' },
          { name: 'data.sessions[].duration',  type: 'number',  description: 'Duration in seconds' },
          { name: 'data.sessions[].completed', type: 'boolean', description: 'Was it completed?' },
          { name: 'data.sessions[].startedAt', type: 'string',  description: 'ISO 8601' },
          { name: 'data.sessions[].taskId',    type: 'string?', description: 'Linked task cuid, if any' },
        ]},
      ],
      examples: [
        { label: 'cURL', code: `curl "${FULL_BASE}/focus?from=2026-04-01&type=POMODORO&completed=true" \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['focus'],
    },
    {
      id         : 'focus-create',
      method     : 'POST',
      path       : '/api/v1/focus',
      summary    : 'Start a focus session',
      description: 'Logs the start of a focus session. Call PATCH /:id/complete when the session ends.',
      auth       : 'auth',
      bodyFields : [
        { name: 'type',     type: 'string',  required: true,  description: 'POMODORO | DEEP_WORK | SHORT_BREAK | LONG_BREAK | CUSTOM' },
        { name: 'duration', type: 'number',  required: true,  description: 'Planned duration in seconds' },
        { name: 'taskId',   type: 'string',  required: false, description: 'Optional linked task cuid' },
      ],
      responses  : [
        { status: 201, description: 'Session started', shape: [
          { name: 'data.id',        type: 'string', description: 'New session cuid' },
          { name: 'data.startedAt', type: 'string', description: 'ISO 8601 start timestamp' },
        ]},
      ],
      examples: [
        { label: 'Axios', code: `const { data } = await axios.post('/api/v1/focus', {\n  type    : 'POMODORO',\n  duration: 1500,        // 25 minutes in seconds\n  taskId  : 'cm_task_abc',\n}, { headers: { Authorization: \`Bearer \${token}\` } });` },
      ],
      tags: ['focus'],
    },
    {
      id         : 'focus-complete',
      method     : 'PATCH',
      path       : '/api/v1/focus/:id/complete',
      summary    : 'Complete a focus session',
      description: 'Marks a session as completed and records the end time. If linked to a task, creates a time entry on that task automatically.',
      auth       : 'auth',
      pathParams : [
        { name: 'id', type: 'string', required: true, description: 'Focus session cuid' },
      ],
      responses  : [
        { status: 200, description: 'Session completed, time entry created if task was linked' },
      ],
      examples: [
        { label: 'Axios', code: `await axios.patch(\`/api/v1/focus/\${sessionId}/complete\`, {},\n  { headers: { Authorization: \`Bearer \${token}\` } }\n);` },
      ],
      tags: ['focus'],
    },
  ],
};
