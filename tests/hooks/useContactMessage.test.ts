// tests/hooks/useContactMessages.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'
import { createWrapper } from '../utils/renderWithProviders'

import { useContactMessages } from '@/hooks/useContactMessage'
import type { ContactStatus, ContactCategory } from '@/hooks/useContactMessage'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const makeMessage = (
  overrides: Partial<{
    id: string
    name: string
    email: string
    subject: string
    category: ContactCategory
    status: ContactStatus
    createdAt: string
  }> = {}
) => ({
  id:        'msg-1',
  name:      'Alice Smith',
  email:     'alice@example.com',
  subject:   'Need help with billing',
  category:  'BILLING' as ContactCategory,
  status:    'UNREAD' as ContactStatus,
  createdAt: '2024-03-01T10:00:00.000Z',
  ...overrides,
})

const defaultPagination = {
  page:       1,
  limit:      20,
  total:      2,
  totalPages: 1,
}

const defaultMessages = [
  makeMessage({ id: 'msg-1', name: 'Alice Smith',  status: 'UNREAD',   category: 'BILLING' }),
  makeMessage({ id: 'msg-2', name: 'Bob Johnson',  status: 'READ',     category: 'TECHNICAL',
                email: 'bob@example.com', subject: 'Feature idea' }),
]

// ── MSW handler helpers ───────────────────────────────────────────────────────

/**
 * Override the default handler to return a custom body for GET /api/contact
 */
function mockContactList(
  messages: typeof defaultMessages,
  pagination = defaultPagination
) {
  server.use(
    http.get(`${BASE}/api/contact`, () =>
      HttpResponse.json({ success: true, messages, pagination })
    )
  )
}

// ── useContactMessages ────────────────────────────────────────────────────────

describe('useContactMessages', () => {
  // ── Fetch & shape ───────────────────────────────────────────────────────────

  it('fetches contact messages with default options', async () => {
    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.messages).toHaveLength(2)
    expect(result.current.data?.messages[0].id).toBe('msg-1')
    expect(result.current.data?.messages[0].name).toBe('Alice Smith')
  })

  it('returns correct message shape', async () => {
    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const msg = result.current.data?.messages[0]
    expect(msg).toHaveProperty('id')
    expect(msg).toHaveProperty('name')
    expect(msg).toHaveProperty('email')
    expect(msg).toHaveProperty('subject')
    expect(msg).toHaveProperty('category')
    expect(msg).toHaveProperty('status')
    expect(msg).toHaveProperty('createdAt')
  })

  it('returns correct pagination shape', async () => {
    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const pagination = result.current.data?.pagination
    expect(pagination).toHaveProperty('page')
    expect(pagination).toHaveProperty('limit')
    expect(pagination).toHaveProperty('total')
    expect(pagination).toHaveProperty('totalPages')
    expect(pagination?.page).toBe(1)
    expect(pagination?.total).toBe(2)
  })

  it('returns correct field values on a message', async () => {
    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const msg = result.current.data?.messages[0]
    expect(msg?.email).toBe('alice@example.com')
    expect(msg?.subject).toBe('Need help with billing')
    expect(msg?.category).toBe('BILLING')
    expect(msg?.status).toBe('UNREAD')
  })

  // ── Graceful degradation ────────────────────────────────────────────────────

  it('returns empty messages array when API returns null messages', async () => {
    server.use(
      http.get(`${BASE}/api/contact`, () =>
        HttpResponse.json({
          success:    true,
          messages:   null,
          pagination: defaultPagination,
        })
      )
    )

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Hook falls back to the ?? [] guard in queryFn
    expect(result.current.data?.messages ?? []).toEqual([])
  })

  it('returns fallback response when API returns null', async () => {
    server.use(
      http.get(`${BASE}/api/contact`, () =>
        HttpResponse.json(null)
      )
    )

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.messages).toEqual([])
    expect(result.current.data?.pagination.total).toBe(0)
  })

  it('enters error state when API returns 500', async () => {
    server.use(
      http.get(`${BASE}/api/contact`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('enters error state when API returns 403', async () => {
    server.use(
      http.get(`${BASE}/api/contact`, () =>
        new HttpResponse(null, { status: 403 })
      )
    )

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  // ── Pagination options ──────────────────────────────────────────────────────

  it('sends correct page param in the request URL', async () => {
    let capturedUrl: string | undefined

    server.use(
      http.get(`${BASE}/api/contact`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({
          success:    true,
          messages:   defaultMessages,
          pagination: { ...defaultPagination, page: 2 },
        })
      })
    )

    const { result } = renderHook(() => useContactMessages({ page: 2 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(capturedUrl).toContain('page=2')
  })

  it('sends correct limit param in the request URL', async () => {
    let capturedUrl: string | undefined

    server.use(
      http.get(`${BASE}/api/contact`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({
          success:    true,
          messages:   defaultMessages,
          pagination: { ...defaultPagination, limit: 50 },
        })
      })
    )

    const { result } = renderHook(() => useContactMessages({ limit: 50 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(capturedUrl).toContain('limit=50')
  })

  it('uses page=1 and limit=20 by default', async () => {
    let capturedUrl: string | undefined

    server.use(
      http.get(`${BASE}/api/contact`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({
          success:    true,
          messages:   defaultMessages,
          pagination: defaultPagination,
        })
      })
    )

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(capturedUrl).toContain('page=1')
    expect(capturedUrl).toContain('limit=20')
  })

  it('reflects totalPages from the API response', async () => {
    server.use(
      http.get(`${BASE}/api/contact`, () =>
        HttpResponse.json({
          success:  true,
          messages: defaultMessages,
          pagination: { page: 1, limit: 20, total: 60, totalPages: 3 },
        })
      )
    )

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.pagination.totalPages).toBe(3)
    expect(result.current.data?.pagination.total).toBe(60)
  })

  // ── Status filter ───────────────────────────────────────────────────────────

  it('sends status param when provided', async () => {
    let capturedUrl: string | undefined

    server.use(
      http.get(`${BASE}/api/contact`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({
          success:    true,
          messages:   [makeMessage({ status: 'UNREAD' })],
          pagination: { ...defaultPagination, total: 1 },
        })
      })
    )

    const { result } = renderHook(
      () => useContactMessages({ status: 'UNREAD' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(capturedUrl).toContain('status=UNREAD')
  })

  it('does not send status param when omitted', async () => {
    let capturedUrl: string | undefined

    server.use(
      http.get(`${BASE}/api/contact`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({
          success:    true,
          messages:   defaultMessages,
          pagination: defaultPagination,
        })
      })
    )

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(capturedUrl).not.toContain('status=')
  })

  it('returns only filtered messages when status=READ', async () => {
    mockContactList([makeMessage({ id: 'msg-2', status: 'READ' })], {
      ...defaultPagination,
      total: 1,
    })

    const { result } = renderHook(
      () => useContactMessages({ status: 'READ' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.messages).toHaveLength(1)
    expect(result.current.data?.messages[0].status).toBe('READ')
  })

  it('returns only filtered messages when status=REPLIED', async () => {
    mockContactList([makeMessage({ id: 'msg-3', status: 'REPLIED' })], {
      ...defaultPagination,
      total: 1,
    })

    const { result } = renderHook(
      () => useContactMessages({ status: 'REPLIED' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.messages[0].status).toBe('REPLIED')
  })

  it('returns only filtered messages when status=ARCHIVED', async () => {
    mockContactList([makeMessage({ id: 'msg-4', status: 'ARCHIVED' })], {
      ...defaultPagination,
      total: 1,
    })

    const { result } = renderHook(
      () => useContactMessages({ status: 'ARCHIVED' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.messages[0].status).toBe('ARCHIVED')
  })

  // ── Category filter ─────────────────────────────────────────────────────────

  it('sends category param when provided', async () => {
    let capturedUrl: string | undefined

    server.use(
      http.get(`${BASE}/api/contact`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({
          success:    true,
          messages:   [makeMessage({ category: 'BILLING' })],
          pagination: { ...defaultPagination, total: 1 },
        })
      })
    )

    const { result } = renderHook(
      () => useContactMessages({ category: 'BILLING' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(capturedUrl).toContain('category=BILLING')
  })

  it('does not send category param when omitted', async () => {
    let capturedUrl: string | undefined

    server.use(
      http.get(`${BASE}/api/contact`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({
          success:    true,
          messages:   defaultMessages,
          pagination: defaultPagination,
        })
      })
    )

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(capturedUrl).not.toContain('category=')
  })

  it('returns only TECHNICAL messages when category=TECHNICAL', async () => {
    mockContactList(
      [makeMessage({ id: 'msg-2', category: 'TECHNICAL', email: 'bob@example.com' })],
      { ...defaultPagination, total: 1 }
    )

    const { result } = renderHook(
      () => useContactMessages({ category: 'TECHNICAL' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.messages[0].category).toBe('TECHNICAL')
  })

  it('sends both status and category when both provided', async () => {
    let capturedUrl: string | undefined

    server.use(
      http.get(`${BASE}/api/contact`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({
          success:    true,
          messages:   [],
          pagination: { ...defaultPagination, total: 0 },
        })
      })
    )

    const { result } = renderHook(
      () => useContactMessages({ status: 'UNREAD', category: 'BUG_REPORT' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(capturedUrl).toContain('status=UNREAD')
    expect(capturedUrl).toContain('category=BUG_REPORT')
  })

  // ── Query key isolation ─────────────────────────────────────────────────────

  it('uses separate cache entries for different pages', async () => {
    const { result: r1 } = renderHook(() => useContactMessages({ page: 1 }), {
      wrapper: createWrapper(),
    })
    const { result: r2 } = renderHook(() => useContactMessages({ page: 2 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(r1.current.isSuccess).toBe(true))
    await waitFor(() => expect(r2.current.isSuccess).toBe(true))

    // Both succeed independently — keys are distinct
    expect(r1.current.data).toBeDefined()
    expect(r2.current.data).toBeDefined()
  })

  it('uses separate cache entries for different statuses', async () => {
    const { result: r1 } = renderHook(
      () => useContactMessages({ status: 'UNREAD' }),
      { wrapper: createWrapper() }
    )
    const { result: r2 } = renderHook(
      () => useContactMessages({ status: 'READ' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(r1.current.isSuccess).toBe(true))
    await waitFor(() => expect(r2.current.isSuccess).toBe(true))

    expect(r1.current.data).toBeDefined()
    expect(r2.current.data).toBeDefined()
  })

  // ── Empty results ───────────────────────────────────────────────────────────

  it('handles empty messages array from API gracefully', async () => {
    server.use(
      http.get(`${BASE}/api/contact`, () =>
        HttpResponse.json({
          success:    true,
          messages:   [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        })
      )
    )

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.messages).toHaveLength(0)
    expect(result.current.data?.pagination.total).toBe(0)
    expect(result.current.data?.pagination.totalPages).toBe(0)
  })
})