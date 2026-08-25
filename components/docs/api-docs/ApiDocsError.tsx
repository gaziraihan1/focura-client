import { AlertCircle } from 'lucide-react';

const errorCodes = [
  { status: 200, label: 'OK',                    description: 'Request succeeded. Body contains data.', color: 'text-emerald-600 dark:text-emerald-400' },
  { status: 201, label: 'Created',               description: 'Resource created. Body contains the new resource.',  color: 'text-emerald-600 dark:text-emerald-400' },
  { status: 400, label: 'Bad Request',            description: 'The request is malformed — usually a missing required field or invalid value.',  color: 'text-amber-600 dark:text-amber-400' },
  { status: 401, label: 'Unauthorized',           description: 'Missing, expired, or revoked access token. Attempt silent refresh.',  color: 'text-red-600 dark:text-red-400' },
  { status: 403, label: 'Forbidden',              description: 'Token is valid but the caller lacks the required role or ownership.',  color: 'text-red-600 dark:text-red-400' },
  { status: 404, label: 'Not Found',              description: 'The requested resource does not exist or the caller cannot see it.',  color: 'text-amber-600 dark:text-amber-400' },
  { status: 409, label: 'Conflict',               description: 'A uniqueness constraint was violated (e.g. email already registered).',  color: 'text-amber-600 dark:text-amber-400' },
  { status: 413, label: 'Payload Too Large',      description: 'Uploaded file exceeds the plan file size limit.',  color: 'text-amber-600 dark:text-amber-400' },
  { status: 422, label: 'Unprocessable Entity',   description: 'Validation failed. The errors field contains field-level detail.',  color: 'text-amber-600 dark:text-amber-400' },
  { status: 429, label: 'Too Many Requests',      description: 'Rate limit exceeded. See Retry-After header or retryAfter field.',  color: 'text-red-600 dark:text-red-400' },
  { status: 500, label: 'Internal Server Error',  description: 'Unexpected server error. These are logged — contact support if persistent.',  color: 'text-red-600 dark:text-red-400' },
  { status: 507, label: 'Insufficient Storage',   description: 'Workspace storage quota exceeded. Delete files or upgrade plan.',  color: 'text-red-600 dark:text-red-400' },
];

const errorShape = `// All error responses follow this shape:
{
  "success": false,
  "error"  : "ERROR_CODE",       // Machine-readable constant (snake_case uppercase)
  "message": "Human explanation" // User-facing message — safe to display
}

// 422 Validation errors additionally include:
{
  "success": false,
  "error"  : "VALIDATION_ERROR",
  "message": "Please fix the errors below.",
  "errors" : {
    "email"   : ["Please enter a valid email address"],
    "password": ["Min 8 characters"],
    "name"    : ["Name must be at least 2 characters"]
  }
}

// 429 Rate limit errors additionally include:
{
  "success"   : false,
  "error"     : "TOO_MANY_REQUESTS",
  "message"   : "You have sent too many messages. Please try again in 60 minutes.",
  "retryAfter": 1714483600000,   // Unix ms — when the window resets
  "remaining" : 0
}`;

const errorCodes2 = [
  { code: 'VALIDATION_ERROR',      description: 'One or more request fields failed Zod schema validation' },
  { code: 'TOO_MANY_REQUESTS',     description: 'Rate limit exceeded (IP or email based)' },
  { code: 'UNAUTHORIZED',          description: 'No valid access token provided' },
  { code: 'FORBIDDEN',             description: 'Token valid but role insufficient' },
  { code: 'NOT_FOUND',             description: 'Resource does not exist or is not accessible' },
  { code: 'CONFLICT',              description: 'Uniqueness constraint violated' },
  { code: 'INVALID_STATUS',        description: 'Status value not in allowed enum' },
  { code: 'PLAN_LIMIT_REACHED',    description: 'Workspace plan limit (members, projects, storage) exceeded' },
  { code: 'STORAGE_LIMIT_REACHED', description: 'Workspace storage quota exhausted' },
  { code: 'FILE_TOO_LARGE',        description: 'Upload exceeds plan file size limit' },
  { code: 'UPLOAD_RATE_LIMIT',     description: 'Too many uploads in a short window' },
  { code: 'INTERNAL_ERROR',        description: 'Unhandled server exception — safe fallback message returned' },
];

export const ApiDocsErrors = () => {
  return (
    <section id='errors' className='scroll-mt-24'>
      <div className='flex items-start gap-3 mb-6'>
        <div className='shrink-0 w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'>
          <AlertCircle className='w-4.5 h-4.5 text-neutral-600 dark:text-neutral-300' strokeWidth={1.8} />
        </div>
        <div>
          <h2 className='text-xl font-bold text-neutral-900 dark:text-neutral-100'>Errors</h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>
            All error responses follow a consistent JSON shape. Use the{' '}
            <code className='text-xs font-mono'>error</code> field for programmatic
            handling and <code className='text-xs font-mono'>message</code> for display.
          </p>
        </div>
      </div>

      {/* HTTP status codes */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5'>
        <div className='px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>HTTP Status Codes</p>
        </div>
        <div className='divide-y divide-neutral-100 dark:divide-neutral-800'>
          {errorCodes.map(({ status, label, description, color }) => (
            <div key={status} className='flex items-start gap-4 px-5 py-3'>
              <code className={`shrink-0 text-sm font-mono font-bold ${color} w-10`}>
                {status}
              </code>
              <div>
                <p className='text-xs font-semibold text-neutral-800 dark:text-neutral-200'>{label}</p>
                <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed'>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error response shape */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5'>
        <div className='px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>Error Response Shape</p>
        </div>
        <pre className='overflow-x-auto p-5 text-[12px] font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950/60 leading-relaxed'>
          <code>{errorShape}</code>
        </pre>
      </div>

      {/* Machine-readable error codes */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden'>
        <div className='px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>Machine-readable Error Codes</p>
        </div>
        <div className='divide-y divide-neutral-100 dark:divide-neutral-800'>
          {errorCodes2.map(({ code, description }) => (
            <div key={code} className='flex items-start gap-4 px-5 py-3'>
              <code className='shrink-0 text-[11px] font-mono font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-md px-2 py-0.5 mt-0.5 whitespace-nowrap'>
                {code}
              </code>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed'>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};