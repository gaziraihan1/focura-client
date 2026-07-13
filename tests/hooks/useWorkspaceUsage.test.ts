import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useWorkspaceUsage } from '@/hooks/useWorkspaceUsage'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const mockUsage = {
  storageUsed: 500,
  storageLimit: 1000,
  memberCount: 3,
  memberLimit: 5,
  projectCount: 2,
  taskCount: 15,
}

describe('useWorkspaceUsage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches workspace usage data', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspace-usage/:id/usage`, () => {
        return HttpResponse.json({ success: true, data: mockUsage })
      })
    )

    const { result } = renderHook(
      () => useWorkspaceUsage('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.storageUsed).toBe(500)
    expect(result.current.data?.memberCount).toBe(3)
  })

  it('is disabled when workspaceId is undefined', () => {
    const { result } = renderHook(
      () => useWorkspaceUsage(undefined),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('respects enabled option', () => {
    const { result } = renderHook(
      () => useWorkspaceUsage('ws-1', { enabled: false }),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('handles API error', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspace-usage/:id/usage`, () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const { result } = renderHook(
      () => useWorkspaceUsage('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
