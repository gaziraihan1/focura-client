import { FULL_BASE, type ApiSection } from '../types';

export const contactSection: ApiSection = {
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
};
