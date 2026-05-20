// tests/mock/handlers/contact.ts
//
// Default happy-path handlers for /api/contact.
// Individual tests can override these via server.use() for edge cases.

import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const defaultMessages = [
  {
    id:        'msg-1',
    name:      'Alice Smith',
    email:     'alice@example.com',
    subject:   'Need help with billing',
    category:  'BILLING',
    status:    'UNREAD',
    createdAt: '2024-03-01T10:00:00.000Z',
  },
  {
    id:        'msg-2',
    name:      'Bob Johnson',
    email:     'bob@example.com',
    subject:   'Feature idea',
    category:  'TECHNICAL',
    status:    'READ',
    createdAt: '2024-03-02T09:00:00.000Z',
  },
]

export const contactHandlers = [
  // GET /api/v1/contact — paginated list (admin)
  http.get(`${BASE}/api/v1/contact`, () =>
    HttpResponse.json({
      success: true,
      messages: defaultMessages,
      pagination: {
        page:       1,
        limit:      20,
        total:      2,
        totalPages: 1,
      },
    })
  ),
]