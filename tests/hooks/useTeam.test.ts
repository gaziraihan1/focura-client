import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useTeamMembers } from '@/hooks/useTeam'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const mockMembers = [
  { id: 'user-1', name: 'Alice', email: 'alice@test.com', image: null, role: 'OWNER' },
  { id: 'user-2', name: 'Bob', email: 'bob@test.com', image: null, role: 'MEMBER' },
]

describe('useTeamMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches team members', async () => {
    server.use(
      http.get(`${BASE}/api/v1/user/workspace-members`, () => {
        return HttpResponse.json({ success: true, data: mockMembers })
      })
    )

    const { result } = renderHook(
      () => useTeamMembers('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].name).toBe('Alice')
  })

  it('is disabled when workspaceId is undefined', () => {
    const { result } = renderHook(
      () => useTeamMembers(undefined),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('returns empty array when no members', async () => {
    server.use(
      http.get(`${BASE}/api/v1/user/workspace-members`, () => {
        return HttpResponse.json({ success: true, data: [] })
      })
    )

    const { result } = renderHook(
      () => useTeamMembers('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(0)
  })

  it('includes workspaceId in query params', async () => {
    let capturedUrl = ''
    server.use(
      http.get(`${BASE}/api/v1/user/workspace-members`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({ success: true, data: mockMembers })
      })
    )

    const { result } = renderHook(
      () => useTeamMembers('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(capturedUrl).toContain('workspaceId=ws-1')
  })
})
