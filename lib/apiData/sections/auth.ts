import { FULL_BASE, type ApiSection } from '../types';

export const authSection: ApiSection = {
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
};
