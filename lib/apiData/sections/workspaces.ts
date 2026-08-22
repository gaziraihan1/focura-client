import { FULL_BASE, type ApiSection } from '../types';

export const workspacesSection: ApiSection = {
  id         : 'workspaces',
  title      : 'Workspaces',
  description: 'Create and manage workspaces — the top-level container for all projects, tasks, and team members in Focura.',
  endpoints  : [
    {
      id         : 'workspace-list',
      method     : 'GET',
      path       : '/api/v1/workspaces',
      summary    : 'List workspaces for current user',
      description: 'Returns all workspaces the authenticated user belongs to (owned or as a member).',
      auth       : 'auth',
      responses  : [
        { status: 200, description: 'Array of workspace objects', shape: [
          { name: 'data[].id',          type: 'string',  description: 'Workspace cuid' },
          { name: 'data[].name',         type: 'string',  description: 'Workspace name' },
          { name: 'data[].slug',         type: 'string',  description: 'Unique URL slug' },
          { name: 'data[].plan',         type: 'string',  description: 'FREE | PRO | BUSINESS | ENTERPRISE' },
          { name: 'data[].role',         type: 'string',  description: 'Caller\'s role: OWNER | ADMIN | MEMBER | GUEST' },
          { name: 'data[].memberCount',  type: 'number',  description: 'Total member count' },
        ]},
      ],
      examples   : [
        { label: 'cURL', code: `curl ${FULL_BASE}/workspaces \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['workspaces'],
    },
    {
      id         : 'workspace-create',
      method     : 'POST',
      path       : '/api/v1/workspaces',
      summary    : 'Create a new workspace',
      description: 'Creates a new workspace. The authenticated user becomes the Owner automatically.',
      auth       : 'auth',
      bodyFields : [
        { name: 'name',        type: 'string',  required: true,  description: 'Workspace display name' },
        { name: 'description', type: 'string',  required: false, description: 'Optional description' },
        { name: 'color',       type: 'string',  required: false, description: 'Hex accent colour', example: '#667eea' },
        { name: 'isPublic',    type: 'boolean', required: false, description: 'Public discoverability (default: false)' },
      ],
      responses  : [
        { status: 201, description: 'Workspace created', shape: [
          { name: 'data.id',   type: 'string', description: 'New workspace cuid' },
          { name: 'data.slug', type: 'string', description: 'Auto-generated unique slug' },
        ]},
        { status: 403, description: 'Plan workspace limit reached' },
      ],
      examples   : [
        {
          label: 'Axios',
          code: `const { data } = await axios.post('/api/workspaces',
{ name: 'Focura Engineering', color: '#667eea' },
{ headers: { Authorization: \`Bearer \${token}\` } }
);`,
        },
      ],
      tags: ['workspaces'],
    },
    {
      id         : 'workspace-get',
      method     : 'GET',
      path       : '/api/v1/workspaces/:workspaceId',
      summary    : 'Get workspace by ID',
      description: 'Returns the full workspace object including member count, subscription status, and current plan limits.',
      auth       : 'auth',
      pathParams : [
        { name: 'workspaceId', type: 'string', required: true, description: 'The workspace cuid' },
      ],
      responses  : [
        { status: 200, description: 'Workspace detail object' },
        { status: 403, description: 'Not a member of this workspace' },
        { status: 404, description: 'Workspace not found' },
      ],
      examples   : [
        { label: 'cURL', code: `curl ${FULL_BASE}/workspaces/cm_ws_abc123 \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['workspaces'],
    },
    {
      id         : 'workspace-update',
      method     : 'PUT',
      path       : '/api/v1/workspaces/:workspaceId',
      summary    : 'Update workspace settings',
      description: 'Updates workspace metadata. Requires OWNER or ADMIN role.',
      auth       : 'auth',
      pathParams : [
        { name: 'workspaceId', type: 'string', required: true, description: 'The workspace cuid' },
      ],
      bodyFields : [
        { name: 'name',         type: 'string',  required: false, description: 'New display name' },
        { name: 'description',  type: 'string',  required: false, description: 'New description' },
        { name: 'color',        type: 'string',  required: false, description: 'New accent colour' },
        { name: 'allowInvites', type: 'boolean', required: false, description: 'Toggle member invitations' },
      ],
      responses  : [
        { status: 200, description: 'Workspace updated' },
        { status: 403, description: 'Insufficient role — OWNER or ADMIN required' },
      ],
      examples   : [
        { label: 'cURL', code: `curl -X PUT ${FULL_BASE}/workspaces/cm_ws_abc123 \\\n  -H "Authorization: Bearer <token>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Updated Name","color":"#ff6b6b"}'` },
      ],
      tags: ['workspaces'],
    },
    {
      id         : 'workspace-delete',
      method     : 'DELETE',
      path       : '/api/v1/workspaces/:workspaceId',
      summary    : 'Delete workspace',
      description: 'Permanently deletes the workspace and all its data — projects, tasks, files, members. Irreversible. OWNER only.',
      auth       : 'auth',
      pathParams : [
        { name: 'workspaceId', type: 'string', required: true, description: 'The workspace cuid' },
      ],
      responses  : [
        { status: 200, description: 'Workspace deleted' },
        { status: 403, description: 'Only OWNER can delete' },
      ],
      examples   : [
        { label: 'cURL', code: `curl -X DELETE ${FULL_BASE}/workspaces/cm_ws_abc123 \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['workspaces'],
    },
    {
      id         : 'workspace-members',
      method     : 'GET',
      path       : '/api/v1/workspaces/:workspaceId/members',
      summary    : 'List workspace members',
      description: 'Returns all members with their roles, joined date, and basic profile info.',
      auth       : 'auth',
      pathParams : [
        { name: 'workspaceId', type: 'string', required: true, description: 'The workspace cuid' },
      ],
      responses  : [
        { status: 200, description: 'Array of member objects', shape: [
          { name: 'data[].userId',    type: 'string', description: 'Member user cuid' },
          { name: 'data[].role',      type: 'string', description: 'OWNER | ADMIN | MEMBER | GUEST' },
          { name: 'data[].joinedAt',  type: 'string', description: 'ISO 8601 timestamp' },
          { name: 'data[].user.name', type: 'string', description: 'Display name' },
        ]},
      ],
      examples   : [
        { label: 'cURL', code: `curl ${FULL_BASE}/workspaces/cm_ws_abc123/members \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['workspaces', 'members'],
    },
    {
      id         : 'workspace-invite',
      method     : 'POST',
      path       : '/api/v1/workspaces/:workspaceId/invitations',
      summary    : 'Invite a member',
      description: 'Sends an email invitation to join the workspace. The link expires in 7 days. Requires OWNER or ADMIN.',
      auth       : 'auth',
      pathParams : [
        { name: 'workspaceId', type: 'string', required: true, description: 'The workspace cuid' },
      ],
      bodyFields : [
        { name: 'email', type: 'string', required: true,  description: 'Email to invite' },
        { name: 'role',  type: 'string', required: false, description: 'ADMIN | MEMBER | GUEST (default: MEMBER)' },
      ],
      responses  : [
        { status: 201, description: 'Invitation sent' },
        { status: 403, description: 'Member limit reached or insufficient role' },
        { status: 409, description: 'Email already a member' },
      ],
      examples   : [
        { label: 'Axios', code: `await axios.post(\`/api/v1/workspaces/\${wsId}/invitations\`,\n  { email: 'new@example.com', role: 'MEMBER' },\n  { headers: { Authorization: \`Bearer \${token}\` } }\n);` },
      ],
      tags: ['workspaces', 'members'],
    },
  ],
};
