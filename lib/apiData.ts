// ─────────────────────────────────────────────────────────────────────────────
// Focura API — Complete Endpoint Registry
// Source of truth for the API docs page. Derived from focura-backend routes.
// ─────────────────────────────────────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type AuthLevel  = 'public' | 'auth' | 'admin';

export interface ParamDef {
  name       : string;
  type       : string;
  required   : boolean;
  description: string;
  example   ?: string;
}

export interface BodyField {
  name       : string;
  type       : string;
  required   : boolean;
  description: string;
  example   ?: string | number | boolean;
}

export interface ResponseField {
  name       : string;
  type       : string;
  description: string;
}

export interface CodeExample {
  label  : string;   // 'cURL' | 'TypeScript' | 'Axios'
  code   : string;
}

export interface Endpoint {
  id          : string;
  method      : HttpMethod;
  path        : string;
  summary     : string;
  description : string;
  auth        : AuthLevel;
  pathParams ?: ParamDef[];
  queryParams?: ParamDef[];
  bodyFields ?: BodyField[];
  responses   : { status: number; description: string; shape?: ResponseField[] }[];
  examples    : CodeExample[];
  tags        : string[];
  deprecated ?: boolean;
}

export interface ApiSection {
  id         : string;
  title      : string;
  description: string;
  endpoints  : Endpoint[];
}

// ─── Base config ──────────────────────────────────────────────────────────────
export const API_BASE_URL     = 'https://focura-backend-vr75.onrender.com';
export const API_VERSION      = 'v1';
export const API_PREFIX       = '/api/v1';
export const FULL_BASE        = `${API_BASE_URL}${API_PREFIX}`;

// ─── Endpoint registry ────────────────────────────────────────────────────────
export const API_SECTIONS: ApiSection[] = [
  // ── AUTH ──────────────────────────────────────────────────────────────────
  {
    id         : 'auth',
    title      : 'Authentication',
    description: 'Register, login, logout, token exchange, refresh, and session management. Focura uses a dual-token system: NextAuth issues a session on the frontend, which is exchanged for a backend RS256 JWT via HMAC proof. All subsequent API requests use that JWT in the Authorization header.',
    endpoints  : [
      {
        id         : 'auth-register',
        method     : 'POST',
        path       : '/api/auth/register',
        summary    : 'Register a new user',
        description: 'Creates a new user account. Sends a verification email. Returns the user object (no token — login separately).',
        auth       : 'public',
        bodyFields : [
          { name: 'name',     type: 'string',  required: true,  description: 'Full display name', example: 'Mohammad Raihan' },
          { name: 'email',    type: 'string',  required: true,  description: 'Valid email address', example: 'raihan@example.com' },
          { name: 'password', type: 'string',  required: true,  description: 'Min 8 characters', example: 'SecurePass123!' },
        ],
        responses  : [
          { status: 201, description: 'User created successfully', shape: [
            { name: 'success', type: 'boolean', description: 'Always true on 2xx' },
            { name: 'message', type: 'string',  description: 'Human-readable result' },
            { name: 'data.id', type: 'string',  description: 'New user cuid' },
            { name: 'data.email', type: 'string', description: 'Registered email' },
          ]},
          { status: 409, description: 'Email already registered' },
          { status: 422, description: 'Validation error — field errors returned' },
        ],
        examples   : [
          {
            label: 'cURL',
            code: `curl -X POST ${FULL_BASE}/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Mohammad Raihan",
    "email": "raihan@example.com",
    "password": "SecurePass123!"
  }'`,
          },
          {
            label: 'Axios',
            code: `const { data } = await axios.post('/api/auth/register', {
  name    : 'Mohammad Raihan',
  email   : 'raihan@example.com',
  password: 'SecurePass123!',
});`,
          },
        ],
        tags: ['auth', 'public'],
      },
      {
        id         : 'auth-login',
        method     : 'POST',
        path       : '/api/auth/login',
        summary    : 'Login with email & password',
        description: 'Validates credentials and issues an HTTP-only refresh token cookie + short-lived access token. Use the access token as a Bearer token for subsequent requests.',
        auth       : 'public',
        bodyFields : [
          { name: 'email',    type: 'string',  required: true, description: 'Registered email address' },
          { name: 'password', type: 'string',  required: true, description: 'Account password' },
        ],
        responses  : [
          { status: 200, description: 'Login successful', shape: [
            { name: 'success',              type: 'boolean', description: 'true' },
            { name: 'data.accessToken',     type: 'string',  description: 'Short-lived RS256 JWT (15 min)' },
            { name: 'data.user.id',         type: 'string',  description: 'User cuid' },
            { name: 'data.user.email',      type: 'string',  description: 'User email' },
            { name: 'data.user.role',       type: 'string',  description: 'USER | ADMIN | SUPER_ADMIN' },
          ]},
          { status: 401, description: 'Invalid credentials' },
          { status: 403, description: 'Account banned or unverified' },
        ],
        examples   : [
          {
            label: 'cURL',
            code: `curl -X POST ${FULL_BASE}/auth/login \\
  -H "Content-Type: application/json" \\
  -c cookies.txt \\
  -d '{"email":"raihan@example.com","password":"SecurePass123!"}'`,
          },
          {
            label: 'Axios',
            code: `const { data } = await axios.post('/api/auth/login',
  { email: 'raihan@example.com', password: 'SecurePass123!' },
  { withCredentials: true }   // sends/receives HTTP-only cookie
);
const token = data.data.accessToken;`,
          },
        ],
        tags: ['auth', 'public'],
      },
      {
        id         : 'auth-exchange',
        method     : 'POST',
        path       : '/api/auth/exchange',
        summary    : 'Exchange NextAuth session for backend JWT',
        description: 'Used by the Next.js frontend only. After NextAuth creates a session, it sends an HMAC-signed proof to this endpoint and receives a backend RS256 JWT. External API consumers should use /login instead.',
        auth       : 'public',
        bodyFields : [
          { name: 'proof',   type: 'string',  required: true, description: 'HMAC-SHA256 signature of the session payload' },
          { name: 'payload', type: 'object',  required: true, description: 'The session data object being proven' },
        ],
        responses  : [
          { status: 200, description: 'JWT issued', shape: [
            { name: 'data.accessToken',  type: 'string', description: 'RS256 JWT (15 min expiry)' },
            { name: 'data.refreshToken', type: 'string', description: 'Opaque token stored HTTP-only' },
          ]},
          { status: 401, description: 'Invalid HMAC proof' },
        ],
        examples   : [
          {
            label: 'cURL',
            code: `curl -X POST ${FULL_BASE}/auth/exchange \\
  -H "Content-Type: application/json" \\
  -d '{"proof":"<hmac_signature>","payload":{...}}'`,
          },
        ],
        tags: ['auth', 'internal'],
      },
      {
        id         : 'auth-refresh',
        method     : 'POST',
        path       : '/api/v1/auth/refresh',
        summary    : 'Refresh access token',
        description: 'Issues a new access token using the HTTP-only refresh token cookie. The old refresh token is rotated (revoked and a new one issued). Implement silent refresh 60 seconds before access token expiry.',
        auth       : 'public',
        responses  : [
          { status: 200, description: 'New access token issued', shape: [
            { name: 'data.accessToken', type: 'string', description: 'Fresh RS256 JWT' },
          ]},
          { status: 401, description: 'Refresh token missing, expired, or revoked' },
        ],
        examples   : [
          {
            label: 'cURL',
            code: `curl -X POST ${FULL_BASE}/auth/refresh \\
  -b cookies.txt -c cookies.txt`,
          },
          {
            label: 'Axios',
            code: `// Axios interceptor — automatic silent refresh
axios.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401 && !error.config._retry) {
    error.config._retry = true;
    const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
    axios.defaults.headers.common['Authorization'] = \`Bearer \${data.data.accessToken}\`;
    return axios(error.config);
  }
  return Promise.reject(error);
});`,
          },
        ],
        tags: ['auth'],
      },
      {
        id         : 'auth-logout',
        method     : 'POST',
        path       : '/api/v1/auth/logout',
        summary    : 'Logout current session',
        description: 'Revokes the current refresh token in Redis and clears the HTTP-only cookie. The access token remains valid until its 15-minute expiry.',
        auth       : 'auth',
        responses  : [
          { status: 200, description: 'Logged out successfully' },
        ],
        examples   : [
          {
            label: 'cURL',
            code: `curl -X POST ${FULL_BASE}/auth/logout \\
  -H "Authorization: Bearer <access_token>" \\
  -b cookies.txt`,
          },
        ],
        tags: ['auth'],
      },
      {
        id         : 'auth-me',
        method     : 'GET',
        path       : '/api/v1/auth/profile',
        summary    : 'Get current authenticated user',
        description: 'Returns the full user object for the authenticated caller. Use this to hydrate app state on boot.',
        auth       : 'auth',
        responses  : [
          { status: 200, description: 'Current user object', shape: [
            { name: 'data.id',       type: 'string',  description: 'User cuid' },
            { name: 'data.email',    type: 'string',  description: 'Email address' },
            { name: 'data.name',     type: 'string',  description: 'Display name' },
            { name: 'data.role',     type: 'string',  description: 'USER | ADMIN | SUPER_ADMIN' },
            { name: 'data.image',    type: 'string?', description: 'Avatar URL (Cloudinary)' },
            { name: 'data.timezone', type: 'string',  description: 'IANA timezone string' },
          ]},
          { status: 401, description: 'Not authenticated' },
        ],
        examples   : [
          {
            label: 'cURL',
            code: `curl ${FULL_BASE}/auth/me \\
  -H "Authorization: Bearer <access_token>"`,
          },
        ],
        tags: ['auth'],
      },
      {
        id         : 'auth-forgot-password',
        method     : 'POST',
        path       : '/api/auth/forgot-password',
        summary    : 'Request password reset email',
        description: 'Sends a password reset link to the given email (if registered). Always returns 200 to avoid email enumeration attacks.',
        auth       : 'public',
        bodyFields : [
          { name: 'email', type: 'string', required: true, description: 'The registered email address' },
        ],
        responses  : [
          { status: 200, description: 'If email exists, reset link sent. Link expires in 1 hour.' },
        ],
        examples   : [
          {
            label: 'cURL',
            code: `curl -X POST ${FULL_BASE}/auth/forgot-password \\
  -H "Content-Type: application/json" \\
  -d '{"email":"raihan@example.com"}'`,
          },
        ],
        tags: ['auth', 'public'],
      },
      {
        id         : 'auth-reset-password',
        method     : 'POST',
        path       : '/api/auth/reset-password',
        summary    : 'Reset password with token',
        description: 'Validates the reset token (1-hour expiry, single-use) and sets a new password. Invalidates all existing sessions.',
        auth       : 'public',
        bodyFields : [
          { name: 'token',       type: 'string', required: true, description: 'The token from the reset email link' },
          { name: 'newPassword', type: 'string', required: true, description: 'New password — min 8 characters' },
        ],
        responses  : [
          { status: 200, description: 'Password updated. All sessions invalidated.' },
          { status: 400, description: 'Token invalid or expired' },
        ],
        examples   : [
          {
            label: 'cURL',
            code: `curl -X POST ${FULL_BASE}/auth/reset-password \\
  -H "Content-Type: application/json" \\
  -d '{"token":"<reset_token>","newPassword":"NewPass123!"}'`,
          },
        ],
        tags: ['auth', 'public'],
      },
    ],
  },

  // ── WORKSPACES ─────────────────────────────────────────────────────────────
  {
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
  },

  // ── PROJECTS ───────────────────────────────────────────────────────────────
  {
    id         : 'projects',
    title      : 'Projects',
    description: 'Projects group tasks within a workspace. Each project has its own views, members, milestones, and analytics.',
    endpoints  : [
      {
        id         : 'projects-list',
        method     : 'GET',
        path       : '/api/v1/projects',
        summary    : 'List projects',
        description: 'Returns all projects the caller has access to. Accepts optional workspaceId filter.',
        auth       : 'auth',
        queryParams: [
          { name: 'workspaceId', type: 'string',  required: false, description: 'Filter by workspace' },
          { name: 'status',      type: 'string',  required: false, description: 'PLANNING | ACTIVE | ON_HOLD | COMPLETED | ARCHIVED' },
          { name: 'page',        type: 'number',  required: false, description: 'Page number (default: 1)' },
          { name: 'limit',       type: 'number',  required: false, description: 'Items per page (default: 20, max: 50)' },
        ],
        responses  : [
          { status: 200, description: 'Paginated list of projects', shape: [
            { name: 'data.projects[].id',     type: 'string', description: 'Project cuid' },
            { name: 'data.projects[].name',   type: 'string', description: 'Project name' },
            { name: 'data.projects[].status', type: 'string', description: 'Project status' },
            { name: 'data.projects[].slug',   type: 'string', description: 'Unique slug within workspace' },
            { name: 'data.pagination',        type: 'object', description: 'page, limit, total, totalPages' },
          ]},
        ],
        examples: [
          { label: 'cURL', code: `curl "${FULL_BASE}/projects?workspaceId=cm_ws_abc&status=ACTIVE" \\\n  -H "Authorization: Bearer <token>"` },
        ],
        tags: ['projects'],
      },
      {
        id         : 'projects-create',
        method     : 'POST',
        path       : '/api/v1/projects',
        summary    : 'Create a project',
        description: 'Creates a new project inside a workspace. Creator becomes Manager automatically.',
        auth       : 'auth',
        bodyFields : [
          { name: 'name',        type: 'string',  required: true,  description: 'Project name' },
          { name: 'workspaceId', type: 'string',  required: true,  description: 'Parent workspace cuid' },
          { name: 'description', type: 'string',  required: false, description: 'Optional description' },
          { name: 'color',       type: 'string',  required: false, description: 'Hex colour', example: '#667eea' },
          { name: 'startDate',   type: 'string',  required: false, description: 'ISO 8601 date' },
          { name: 'dueDate',     type: 'string',  required: false, description: 'ISO 8601 date' },
          { name: 'priority',    type: 'string',  required: false, description: 'URGENT | HIGH | MEDIUM | LOW' },
        ],
        responses  : [
          { status: 201, description: 'Project created' },
          { status: 403, description: 'Project limit reached for this workspace plan' },
        ],
        examples: [
          { label: 'Axios', code: `const { data } = await axios.post('/api/v1/projects', {\n  name: 'Q3 Launch',\n  workspaceId: 'cm_ws_abc123',\n  color: '#667eea',\n  priority: 'HIGH',\n}, { headers: { Authorization: \`Bearer \${token}\` } });` },
        ],
        tags: ['projects'],
      },
      {
        id         : 'projects-get',
        method     : 'GET',
        path       : '/api/v1/projects/:projectId',
        summary    : 'Get project by ID',
        description: 'Returns the full project object including members, milestones count, and active views.',
        auth       : 'auth',
        pathParams : [
          { name: 'projectId', type: 'string', required: true, description: 'Project cuid' },
        ],
        responses  : [
          { status: 200, description: 'Full project object' },
          { status: 403, description: 'Not a project member' },
          { status: 404, description: 'Project not found' },
        ],
        examples: [
          { label: 'cURL', code: `curl ${FULL_BASE}/projects/cm_proj_xyz \\\n  -H "Authorization: Bearer <token>"` },
        ],
        tags: ['projects'],
      },
      {
        id         : 'projects-update',
        method     : 'PUT',
        path       : '/api/v1/projects/:projectId',
        summary    : 'Update project',
        description: 'Updates project metadata. Requires MANAGER or workspace ADMIN/OWNER.',
        auth       : 'auth',
        pathParams : [
          { name: 'projectId', type: 'string', required: true, description: 'Project cuid' },
        ],
        bodyFields : [
          { name: 'name',        type: 'string', required: false, description: 'New name' },
          { name: 'status',      type: 'string', required: false, description: 'New status' },
          { name: 'description', type: 'string', required: false, description: 'New description' },
          { name: 'dueDate',     type: 'string', required: false, description: 'New due date ISO 8601' },
        ],
        responses  : [
          { status: 200, description: 'Project updated' },
          { status: 403, description: 'Insufficient role' },
        ],
        examples: [
          { label: 'cURL', code: `curl -X PUT ${FULL_BASE}/projects/cm_proj_xyz \\\n  -H "Authorization: Bearer <token>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"status":"COMPLETED"}'` },
        ],
        tags: ['projects'],
      },
      {
        id         : 'projects-delete',
        method     : 'DELETE',
        path       : '/api/v1/projects/:projectId',
        summary    : 'Delete project',
        description: 'Permanently deletes the project and all its tasks, files, and comments. Irreversible.',
        auth       : 'auth',
        pathParams : [
          { name: 'projectId', type: 'string', required: true, description: 'Project cuid' },
        ],
        responses  : [
          { status: 200, description: 'Project deleted' },
          { status: 403, description: 'MANAGER or workspace ADMIN/OWNER required' },
        ],
        examples: [
          { label: 'cURL', code: `curl -X DELETE ${FULL_BASE}/projects/cm_proj_xyz \\\n  -H "Authorization: Bearer <token>"` },
        ],
        tags: ['projects'],
      },
    ],
  },

  // ── TASKS ──────────────────────────────────────────────────────────────────
  {
    id         : 'tasks',
    title      : 'Tasks',
    description: 'Full CRUD for tasks, subtasks, dependencies, assignments, and time entries. Tasks are the core entity in Focura.',
    endpoints  : [
      {
        id         : 'tasks-list',
        method     : 'GET',
        path       : '/api/v1/tasks',
        summary    : 'List tasks',
        description: 'Returns tasks with rich filtering. All filter parameters are combinable (AND logic).',
        auth       : 'auth',
        queryParams: [
          { name: 'workspaceId',   type: 'string',  required: false, description: 'Filter by workspace' },
          { name: 'projectId',     type: 'string',  required: false, description: 'Filter by project' },
          { name: 'status',        type: 'string',  required: false, description: 'TODO | IN_PROGRESS | IN_REVIEW | BLOCKED | COMPLETED | CANCELLED' },
          { name: 'priority',      type: 'string',  required: false, description: 'URGENT | HIGH | MEDIUM | LOW' },
          { name: 'assigneeId',    type: 'string',  required: false, description: 'Filter by assigned user cuid' },
          { name: 'focusRequired', type: 'boolean', required: false, description: 'Only return focus-flagged tasks' },
          { name: 'dueDate',       type: 'string',  required: false, description: 'ISO date — tasks due on this date' },
          { name: 'overdue',       type: 'boolean', required: false, description: 'Return only overdue tasks' },
          { name: 'search',        type: 'string',  required: false, description: 'Full-text search on title and description' },
          { name: 'page',          type: 'number',  required: false, description: 'Default: 1' },
          { name: 'limit',         type: 'number',  required: false, description: 'Default: 20, max: 100' },
        ],
        responses  : [
          { status: 200, description: 'Paginated task list with metadata', shape: [
            { name: 'data.tasks[].id',       type: 'string', description: 'Task cuid' },
            { name: 'data.tasks[].title',    type: 'string', description: 'Task title' },
            { name: 'data.tasks[].status',   type: 'string', description: 'Current status' },
            { name: 'data.tasks[].priority', type: 'string', description: 'Priority level' },
            { name: 'data.tasks[].assignees',type: 'array',  description: 'Assigned user objects' },
            { name: 'data.tasks[].dueDate',  type: 'string?', description: 'ISO 8601 due date' },
            { name: 'data.pagination',       type: 'object', description: 'page, limit, total, totalPages' },
          ]},
        ],
        examples: [
          { label: 'cURL', code: `curl "${FULL_BASE}/v1/tasks?projectId=cm_proj_xyz&status=IN_PROGRESS&priority=HIGH" \\\n  -H "Authorization: Bearer <token>"` },
          { label: 'Axios', code: `const { data } = await axios.get('/api/v1/tasks', {\n  params: { projectId, status: 'IN_PROGRESS', overdue: true },\n  headers: { Authorization: \`Bearer \${token}\` },\n});` },
        ],
        tags: ['tasks'],
      },
      {
        id         : 'tasks-create',
        method     : 'POST',
        path       : '/api/v1/tasks',
        summary    : 'Create a task',
        description: 'Creates a new task. Triggers real-time notifications to assignees via SSE.',
        auth       : 'auth',
        bodyFields : [
          { name: 'title',          type: 'string',   required: true,  description: 'Task title' },
          { name: 'workspaceId',    type: 'string',   required: true,  description: 'Parent workspace cuid' },
          { name: 'projectId',      type: 'string',   required: false, description: 'Parent project cuid' },
          { name: 'description',    type: 'string',   required: false, description: 'Markdown-supported description' },
          { name: 'status',         type: 'string',   required: false, description: 'Default: TODO' },
          { name: 'priority',       type: 'string',   required: false, description: 'Default: MEDIUM' },
          { name: 'assigneeIds',    type: 'string[]', required: false, description: 'Array of user cuids to assign' },
          { name: 'labelIds',       type: 'string[]', required: false, description: 'Array of label cuids' },
          { name: 'dueDate',        type: 'string',   required: false, description: 'ISO 8601 datetime' },
          { name: 'startDate',      type: 'string',   required: false, description: 'ISO 8601 datetime' },
          { name: 'estimatedHours', type: 'number',   required: false, description: 'Estimated hours to complete' },
          { name: 'focusRequired',  type: 'boolean',  required: false, description: 'Flag as requiring focused work' },
          { name: 'focusLevel',     type: 'number',   required: false, description: '1–5 focus intensity' },
          { name: 'energyType',     type: 'string',   required: false, description: 'LOW | MEDIUM | HIGH' },
          { name: 'parentId',       type: 'string',   required: false, description: 'Parent task cuid (creates subtask)' },
        ],
        responses  : [
          { status: 201, description: 'Task created', shape: [
            { name: 'data.id',     type: 'string', description: 'New task cuid' },
            { name: 'data.title',  type: 'string', description: 'Task title' },
            { name: 'data.status', type: 'string', description: 'Initial status' },
          ]},
          { status: 403, description: 'Not a project member' },
        ],
        examples: [
          { label: 'Axios', code: `const { data } = await axios.post('/api/v1/tasks', {\n  title       : 'Implement dark mode',\n  workspaceId : 'cm_ws_abc123',\n  projectId   : 'cm_proj_xyz',\n  priority    : 'HIGH',\n  assigneeIds : ['cm_user_123'],\n  dueDate     : '2026-05-01T00:00:00.000Z',\n  focusRequired: true,\n}, { headers: { Authorization: \`Bearer \${token}\` } });` },
        ],
        tags: ['tasks'],
      },
      {
        id         : 'tasks-get',
        method     : 'GET',
        path       : '/api/v1/tasks/:id',
        summary    : 'Get task by ID',
        description: 'Returns the full task object including subtasks, assignees, labels, time entries, dependencies, and comment count.',
        auth       : 'auth',
        pathParams : [
          { name: 'id', type: 'string', required: true, description: 'Task cuid' },
        ],
        responses  : [
          { status: 200, description: 'Full task object with relations' },
          { status: 404, description: 'Task not found' },
        ],
        examples: [
          { label: 'cURL', code: `curl ${FULL_BASE}/tasks/cm_task_abc \\\n  -H "Authorization: Bearer <token>"` },
        ],
        tags: ['tasks'],
      },
      {
        id         : 'tasks-update',
        method     : 'PUT',
        path       : '/api/v1/  tasks/:id',
        summary    : 'Update task',
        description: 'Full update of a task. All body fields are optional — send only what changes. Triggers SSE notification to assignees on significant changes.',
        auth       : 'auth',
        pathParams : [
          { name: 'id', type: 'string', required: true, description: 'Task cuid' },
        ],
        bodyFields : [
          { name: 'title',          type: 'string',   required: false, description: 'New title' },
          { name: 'description',    type: 'string',   required: false, description: 'New description' },
          { name: 'status',         type: 'string',   required: false, description: 'New status' },
          { name: 'priority',       type: 'string',   required: false, description: 'New priority' },
          { name: 'assigneeIds',    type: 'string[]', required: false, description: 'Replace full assignee list' },
          { name: 'dueDate',        type: 'string',   required: false, description: 'New due date' },
          { name: 'estimatedHours', type: 'number',   required: false, description: 'Updated estimate' },
        ],
        responses  : [
          { status: 200, description: 'Updated task object' },
          { status: 403, description: 'Not a project member or insufficient role' },
        ],
        examples: [
          { label: 'cURL', code: `curl -X PUT ${FULL_BASE}/tasks/cm_task_abc \\\n  -H "Authorization: Bearer <token>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"status":"COMPLETED","priority":"HIGH"}'` },
        ],
        tags: ['tasks'],
      },
      {
        id         : 'tasks-update-status',
        method     : 'PATCH',
        path       : '/api/v1/tasks/:id/status',
        summary    : 'Update task status only',
        description: 'Lightweight status-only update. Used by Kanban drag-and-drop and quick-status toggles.',
        auth       : 'auth',
        pathParams : [
          { name: 'id', type: 'string', required: true, description: 'Task cuid' },
        ],
        bodyFields : [
          { name: 'status', type: 'string', required: true, description: 'TODO | IN_PROGRESS | IN_REVIEW | BLOCKED | COMPLETED | CANCELLED' },
        ],
        responses  : [
          { status: 200, description: 'Status updated' },
        ],
        examples: [
          { label: 'Axios', code: `await axios.patch(\`/api/v1/tasks/\${taskId}/status\`,\n  { status: 'IN_PROGRESS' },\n  { headers: { Authorization: \`Bearer \${token}\` } }\n);` },
        ],
        tags: ['tasks'],
      },
      {
        id         : 'tasks-delete',
        method     : 'DELETE',
        path       : '/api/v1/tasks/:id',
        summary    : 'Delete task',
        description: 'Permanently deletes a task, its subtasks, comments, attachments, and time entries.',
        auth       : 'auth',
        pathParams : [
          { name: 'id', type: 'string', required: true, description: 'Task cuid' },
        ],
        responses  : [
          { status: 200, description: 'Task deleted' },
          { status: 403, description: 'Not authorised' },
        ],
        examples: [
          { label: 'cURL', code: `curl -X DELETE ${FULL_BASE}/tasks/cm_task_abc \\\n  -H "Authorization: Bearer <token>"` },
        ],
        tags: ['tasks'],
      },
    ],
  },

  // ── COMMENTS ───────────────────────────────────────────────────────────────
  {
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
  },

  // ── FOCUS SESSIONS ─────────────────────────────────────────────────────────
  {
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
  },

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────────
  {
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
          { label: 'EventSource (JS)', code: `const es = new EventSource(\n  '${FULL_BASE}/notifications/stream',\n  { withCredentials: true }\n);\n\nes.addEventListener('notification', (e) => {\n  const notification = JSON.parse(e.data);\n  console.log(notification.title);\n});\n\nes.onerror = () => {\n  // Browser auto-reconnects with backoff\n};` },
          { label: 'React hook', code: `useEffect(() => {\n  const es = new EventSource(\`\${API_BASE}/notifications/stream\`, {\n    withCredentials: true,\n  });\n  es.addEventListener('notification', handler);\n  return () => es.close();\n}, []);` },
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
  },

  // ── FILES ──────────────────────────────────────────────────────────────────
  {
    id         : 'files',
    title      : 'Files & Attachments',
    description: 'File upload and management via Cloudinary. All uploads are rate-limited per user and subject to workspace storage quotas.',
    endpoints  : [
      {
        id         : 'files-upload',
        method     : 'POST',
        path       : '/api/v1/files/upload',
        summary    : 'Upload a file',
        description: 'Accepts multipart/form-data. File is stored on Cloudinary and a File record is created in the database. Rate-limited per user.',
        auth       : 'auth',
        bodyFields : [
          { name: 'file',        type: 'File',   required: true,  description: 'The file to upload (multipart)' },
          { name: 'workspaceId', type: 'string', required: true,  description: 'Target workspace' },
          { name: 'projectId',   type: 'string', required: false, description: 'Associate with a project' },
          { name: 'taskId',      type: 'string', required: false, description: 'Associate with a task' },
          { name: 'folder',      type: 'string', required: false, description: 'Virtual folder path (default: /)' },
        ],
        responses  : [
          { status: 201, description: 'File uploaded', shape: [
            { name: 'data.id',           type: 'string', description: 'File cuid' },
            { name: 'data.url',          type: 'string', description: 'Cloudinary public URL' },
            { name: 'data.thumbnail',    type: 'string?', description: 'Optimised thumbnail URL (images only)' },
            { name: 'data.size',         type: 'number', description: 'File size in bytes' },
            { name: 'data.mimeType',     type: 'string', description: 'MIME type' },
          ]},
          { status: 413, description: 'File exceeds plan file size limit' },
          { status: 429, description: 'Upload rate limit exceeded' },
          { status: 507, description: 'Workspace storage limit reached' },
        ],
        examples: [
          { label: 'cURL', code: `curl -X POST ${FULL_BASE}/files/upload \\\n  -H "Authorization: Bearer <token>" \\\n  -F "file=@report.pdf" \\\n  -F "workspaceId=cm_ws_abc123" \\\n  -F "taskId=cm_task_xyz"` },
          { label: 'Axios', code: `const form = new FormData();\nform.append('file', fileInput.files[0]);\nform.append('workspaceId', wsId);\nform.append('taskId', taskId);\n\nconst { data } = await axios.post('/api/v1/files/upload', form, {\n  headers: {\n    Authorization: \`Bearer \${token}\`,\n    'Content-Type': 'multipart/form-data',\n  },\n});` },
        ],
        tags: ['files'],
      },
      {
        id         : 'files-list',
        method     : 'GET',
        path       : '/api/v1/files',
        summary    : 'List workspace files',
        description: 'Returns all files in a workspace with optional folder and task filters.',
        auth       : 'auth',
        queryParams: [
          { name: 'workspaceId', type: 'string', required: true,  description: 'Workspace to list files from' },
          { name: 'projectId',   type: 'string', required: false, description: 'Filter by project' },
          { name: 'taskId',      type: 'string', required: false, description: 'Filter by task' },
          { name: 'folder',      type: 'string', required: false, description: 'Filter by virtual folder path' },
          { name: 'page',        type: 'number', required: false, description: 'Default: 1' },
          { name: 'limit',       type: 'number', required: false, description: 'Default: 20' },
        ],
        responses  : [
          { status: 200, description: 'Paginated file list' },
        ],
        examples: [
          { label: 'cURL', code: `curl "${FULL_BASE}/files?workspaceId=cm_ws_abc" \\\n  -H "Authorization: Bearer <token>"` },
        ],
        tags: ['files'],
      },
      {
        id         : 'files-delete',
        method     : 'DELETE',
        path       : '/api/v1/files/:fileId',
        summary    : 'Delete a file',
        description: 'Deletes the file record from the database and removes it from Cloudinary. Frees used storage immediately.',
        auth       : 'auth',
        pathParams : [
          { name: 'fileId', type: 'string', required: true, description: 'File cuid' },
        ],
        responses  : [
          { status: 200, description: 'File deleted' },
          { status: 403, description: 'Not the uploader or workspace Admin/Owner' },
        ],
        examples: [
          { label: 'cURL', code: `curl -X DELETE ${FULL_BASE}/files/cm_file_xyz \\\n  -H "Authorization: Bearer <token>"` },
        ],
        tags: ['files'],
      },
    ],
  },

  // ── CONTACT ────────────────────────────────────────────────────────────────
  {
    id         : 'contact',
    title      : 'Contact',
    description: 'Public contact form submission. Rate-limited per IP and email. Saves to DB and dispatches both an admin notification email and a user auto-reply.',
    endpoints  : [
      {
        id         : 'contact-submit',
        method     : 'POST',
        path       : '/api/v1/contact',
        summary    : 'Submit contact form',
        description: 'Public endpoint — no authentication required. Rate-limited to 3 requests per IP per hour and 2 per email per 24 hours via Upstash Redis.',
        auth       : 'public',
        bodyFields : [
          { name: 'name',     type: 'string', required: true, description: 'Sender full name (2–100 chars)' },
          { name: 'email',    type: 'string', required: true, description: 'Sender email address' },
          { name: 'subject',  type: 'string', required: true, description: 'Message subject (5–200 chars)' },
          { name: 'category', type: 'string', required: true, description: 'GENERAL | BILLING | TECHNICAL | FEATURE_REQUEST | PARTNERSHIP | SECURITY | OTHER' },
          { name: 'message',  type: 'string', required: true, description: 'Message body (20–5000 chars)' },
        ],
        responses  : [
          { status: 201, description: 'Message received', shape: [
            { name: 'data.id',        type: 'string', description: 'ContactMessage cuid' },
            { name: 'data.createdAt', type: 'string', description: 'ISO 8601 timestamp' },
          ]},
          { status: 422, description: 'Validation error' },
          { status: 429, description: 'Rate limit exceeded — retryAfter timestamp provided' },
        ],
        examples: [
          { label: 'cURL', code: `curl -X POST ${FULL_BASE}/contact \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Raihan",\n    "email": "raihan@example.com",\n    "subject": "Billing question",\n    "category": "BILLING",\n    "message": "I need help understanding my invoice."\n  }'` },
        ],
        tags: ['contact', 'public'],
      },
    ],
  },

  // ── JOBS ───────────────────────────────────────────────────────────────────
  {
    id         : 'jobs',
    title      : 'Job Postings (Careers)',
    description: 'Public read endpoints for the careers page. Write endpoints are admin-only, gated by FOCURA_ADMIN_IDS env var.',
    endpoints  : [
      {
        id         : 'jobs-list',
        method     : 'GET',
        path       : '/api/v1/jobs',
        summary    : 'List open job postings',
        description: 'Returns all OPEN job postings. Supports department, locationType, type, and search filtering.',
        auth       : 'public',
        queryParams: [
          { name: 'department',   type: 'string', required: false, description: 'ENGINEERING | DESIGN | PRODUCT | …' },
          { name: 'locationType', type: 'string', required: false, description: 'REMOTE | ONSITE | HYBRID' },
          { name: 'type',         type: 'string', required: false, description: 'FULL_TIME | PART_TIME | CONTRACT | …' },
          { name: 'search',       type: 'string', required: false, description: 'Full-text search on title, description, location' },
          { name: 'page',         type: 'number', required: false, description: 'Default: 1' },
          { name: 'limit',        type: 'number', required: false, description: 'Default: 20, max: 50' },
        ],
        responses  : [
          { status: 200, description: 'Paginated job posting list' },
        ],
        examples: [
          { label: 'cURL', code: `curl "${FULL_BASE}/jobs?locationType=REMOTE&department=ENGINEERING" \\
  # No auth required` },
        ],
        tags: ['jobs', 'public'],
      },
      {
        id         : 'jobs-get',
        method     : 'GET',
        path       : '/api/v1/jobs/:slug',
        summary    : 'Get single job posting by slug',
        description: 'Returns the full job posting including description, requirements, benefits, and application instructions.',
        auth       : 'public',
        pathParams : [
          { name: 'slug', type: 'string', required: true, description: 'Job posting URL slug' },
        ],
        responses  : [
          { status: 200, description: 'Full job posting object' },
          { status: 404, description: 'Job not found or not OPEN' },
        ],
        examples: [
          { label: 'cURL', code: `curl ${FULL_BASE}/jobs/senior-frontend-engineer` },
        ],
        tags: ['jobs', 'public'],
      },
    ],
  },
];

// ─── Flat list helper for search ──────────────────────────────────────────────
export const ALL_ENDPOINTS: Endpoint[] = API_SECTIONS.flatMap((s) => s.endpoints);

export function findEndpoint(id: string): Endpoint | undefined {
  return ALL_ENDPOINTS.find((e) => e.id === id);
}

export function findSection(id: string): ApiSection | undefined {
  return API_SECTIONS.find((s) => s.id === id);
}

// ─── Method colour map ────────────────────────────────────────────────────────
export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET   : 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
  POST  : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
  PUT   : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  PATCH : 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/50',
  DELETE: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
};

export const METHOD_DOT: Record<HttpMethod, string> = {
  GET   : 'bg-blue-500',
  POST  : 'bg-emerald-500',
  PUT   : 'bg-amber-500',
  PATCH : 'bg-violet-500',
  DELETE: 'bg-red-500',
};

export const AUTH_BADGE: Record<AuthLevel, { label: string; style: string }> = {
  public: { label: 'Public',    style: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400' },
  auth  : { label: 'Auth',      style: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' },
  admin : { label: 'Admin only', style: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400' },
};