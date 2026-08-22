import { FULL_BASE, type ApiSection } from '../types';

export const commentsSection: ApiSection = {
  id         : 'comments',
  title      : 'Comments',
  description: 'Task-scoped comments with @mention support. Creating a comment triggers real-time SSE notifications to all task assignees and the task creator.',
  endpoints  : [
    {
      id         : 'comments-list',
      method     : 'GET',
      path       : '/api/v1/tasks/:taskId/comments',
      summary    : 'List comments on a task',
      description: 'Returns all top-level comments and their nested replies for the given task.',
      auth       : 'auth',
      pathParams : [
        { name: 'taskId', type: 'string', required: true, description: 'Parent task cuid' },
      ],
      responses  : [
        { status: 200, description: 'Array of comment threads', shape: [
          { name: 'data[].id',            type: 'string', description: 'Comment cuid' },
          { name: 'data[].content',       type: 'string', description: 'Markdown content' },
          { name: 'data[].user',          type: 'object', description: 'Author profile' },
          { name: 'data[].replies',       type: 'array',  description: 'Nested reply comments' },
          { name: 'data[].mentions',      type: 'array',  description: 'Mentioned users' },
          { name: 'data[].createdAt',     type: 'string', description: 'ISO 8601' },
        ]},
      ],
      examples: [
        { label: 'cURL', code: `curl ${FULL_BASE}/tasks/cm_task_abc/comments \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['comments'],
    },
    {
      id         : 'comments-create',
      method     : 'POST',
      path       : '/api/v1/tasks/:taskId/comments',
      summary    : 'Create a comment',
      description: 'Adds a comment to a task. Include mentionedUserIds to trigger @mention notifications via SSE.',
      auth       : 'auth',
      pathParams : [
        { name: 'taskId', type: 'string', required: true, description: 'Parent task cuid' },
      ],
      bodyFields : [
        { name: 'content',          type: 'string',   required: true,  description: 'Markdown comment content' },
        { name: 'parentId',         type: 'string',   required: false, description: 'Parent comment cuid (for reply)' },
        { name: 'mentionedUserIds', type: 'string[]', required: false, description: 'Users to notify with @mention' },
      ],
      responses  : [
        { status: 201, description: 'Comment created' },
      ],
      examples: [
        { label: 'Axios', code: `await axios.post(\`/api/v1/tasks/\${taskId}/comments\`, {\n  content: 'Looks good to me! @raihan can you review?',\n  mentionedUserIds: ['cm_user_raihan'],\n}, { headers: { Authorization: \`Bearer \${token}\` } });` },
      ],
      tags: ['comments'],
    },
  ],
};
