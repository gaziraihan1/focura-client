import { Lock, RefreshCw, AlertTriangle, Copy } from 'lucide-react';

const steps = [
  {
    step   : '01',
    title  : 'Obtain an access token',
    detail : 'Call POST /api/auth/login with valid credentials. The response contains a short-lived RS256 JWT (15-minute expiry) in data.accessToken and sets an HTTP-only refresh token cookie.',
    code   : `POST /api/auth/login
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "YourPassword123!"
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "...", "email": "...", "role": "USER" }
  }
}`,
  },
  {
    step   : '02',
    title  : 'Attach the token to requests',
    detail : 'Include the access token in the Authorization header as a Bearer token on every authenticated request.',
    code   : `GET /api/workspaces
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json`,
  },
  {
    step   : '03',
    title  : 'Silent refresh before expiry',
    detail : 'Access tokens expire in 15 minutes. Call POST /api/auth/refresh with the HTTP-only cookie to get a new access token. The refresh token is rotated on each call — the old one is revoked immediately in Redis.',
    code   : `// Recommended: refresh ~60 seconds before expiry

POST /api/v1/auth/refresh
// (no body — refresh token is sent automatically via HTTP-only cookie)

// Response
{
  "success": true,
  "data": { "accessToken": "eyJhbGciOiJSUzI1NiIs..." }
}`,
  },
  {
    step   : '04',
    title  : 'Handle 401 responses',
    detail : 'If a request returns 401, attempt one silent refresh. If refresh also fails with 401, the session has been revoked — redirect the user to login.',
    code   : `// Axios interceptor pattern
axios.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401 && !error.config._retry) {
    error.config._retry = true;
    try {
      const { data } = await axios.post('/api/v1/auth/refresh', {},
        { withCredentials: true }
      );
      const newToken = data.data.accessToken;
      error.config.headers['Authorization'] = \`Bearer \${newToken}\`;
      return axios(error.config);
    } catch {
      // Refresh failed — session fully expired
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});`,
  },
];

const tokenPayload = `{
  "sub"  : "cm_user_abc123",       // User cuid
  "email": "you@example.com",
  "role" : "USER",                  // USER | ADMIN | SUPER_ADMIN
  "iat"  : 1714480000,              // Issued at (Unix timestamp)
  "exp"  : 1714480900,              // Expires at (iat + 900s = 15 min)
  "jti"  : "unique-jwt-id"         // JWT ID — tracked in Redis for revocation
}`;

export const ApiDocsAuthentication = () => {
  return (
    <section id='authentication-guide' className='scroll-mt-24'>
      <div className='flex items-start gap-3 mb-6'>
        <div className='shrink-0 w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'>
          <Lock className='w-4.5 h-4.5 text-neutral-600 dark:text-neutral-300' strokeWidth={1.8} />
        </div>
        <div>
          <h2 className='text-xl font-bold text-neutral-900 dark:text-neutral-100'>Authentication</h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>
            Focura uses a dual-token RS256 JWT system. Short-lived access tokens are
            attached to requests; long-lived refresh tokens are stored HTTP-only and
            rotated on each use.
          </p>
        </div>
      </div>

      {/* Auth flow steps */}
      <div className='space-y-4 mb-8'>
        {steps.map(({ step, title, detail, code }) => (
          <div
            key={step}
            className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden'
          >
            <div className='flex items-start gap-4 p-5 border-b border-neutral-100 dark:border-neutral-800'>
              <div className='shrink-0 w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center'>
                <span className='text-[11px] font-bold text-white dark:text-neutral-900'>{step}</span>
              </div>
              <div>
                <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-0.5'>{title}</p>
                <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed'>{detail}</p>
              </div>
            </div>
            <pre className='overflow-x-auto p-4 text-[12px] font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950/60 leading-relaxed'>
              <code>{code}</code>
            </pre>
          </div>
        ))}
      </div>

      {/* JWT payload reference */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-6'>
        <div className='flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <div className='flex items-center gap-2'>
            <RefreshCw className='w-3.5 h-3.5 text-neutral-400' strokeWidth={1.8} />
            <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>JWT Access Token Payload</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(tokenPayload)}
            className='text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors'
          >
            <Copy className='w-3.5 h-3.5' />
          </button>
        </div>
        <pre className='overflow-x-auto p-5 text-[12px] font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950/60 leading-relaxed'>
          <code>{tokenPayload}</code>
        </pre>
      </div>

      {/* Security notes */}
      <div className='rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 px-4 py-3.5'>
        <div className='flex items-start gap-2.5'>
          <AlertTriangle className='w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' strokeWidth={2} />
          <div className='space-y-1 text-xs text-amber-800 dark:text-amber-300 leading-relaxed'>
            <p><strong className='font-semibold'>Never store access tokens in localStorage.</strong> They are kept in memory only. The refresh token is HTTP-only and inaccessible to JavaScript.</p>
            <p><strong className='font-semibold'>Token revocation:</strong> Each JWT has a unique JTI tracked in Upstash Redis. Logout, password change, and role updates immediately invalidate all active tokens via Redis TTL.</p>
            <p><strong className='font-semibold'>Algorithm:</strong> RS256 (asymmetric). The backend signs with a private key; the frontend verifies with the public key. HMAC (HS256) is not used for user tokens.</p>
          </div>
        </div>
      </div>
    </section>
  );
};