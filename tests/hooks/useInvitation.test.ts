import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useInvitation } from '@/hooks/useInvitation'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

const mockInvitation = {
  id: 'inv-1',
  email: 'new@test.com',
  role: 'MEMBER',
  status: 'PENDING',
  expiresAt: '2025-08-01T00:00:00.000Z',
  workspace: {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-ws',
    description: 'A test workspace',
  },
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

describe('useInvitation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches invitation details', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/invitations/:token`, () => {
        return HttpResponse.json({ success: true, data: mockInvitation })
      })
    )

    const { result } = renderHook(
      () => useInvitation('valid-token'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.invitation).not.toBeNull()
    expect(result.current.invitation?.email).toBe('new@test.com')
    expect(result.current.invitation?.workspace.name).toBe('Test Workspace')
    expect(result.current.error).toBeNull()
  })

  it('sets error for empty token', () => {
    const { result } = renderHook(
      () => useInvitation(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.error).toBe('Invalid invitation token')
    expect(result.current.isLoading).toBe(false)
  })

  it('accepts invitation', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/invitations/:token`, () => {
        return HttpResponse.json({ success: true, data: mockInvitation })
      }),
      http.post(`${BASE}/api/v1/workspaces/invitations/:token/accept`, () => {
        return HttpResponse.json({
          success: true,
          data: { id: 'ws-1', name: 'Test Workspace', slug: 'test-ws' },
        })
      })
    )

    const { result } = renderHook(
      () => useInvitation('valid-token'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    let workspace: Record<string, unknown>
    await act(async () => {
      workspace = await result.current.acceptInvitation()
    })

    expect(workspace.name).toBe('Test Workspace')
    expect(result.current.isAccepting).toBe(false)
  })

  it('handles accept failure', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/invitations/:token`, () => {
        return HttpResponse.json({ success: true, data: mockInvitation })
      }),
      http.post(`${BASE}/api/v1/workspaces/invitations/:token/accept`, () => {
        return HttpResponse.json({ success: false, message: 'Invitation expired' })
      })
    )

    const { result } = renderHook(
      () => useInvitation('valid-token'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await expect(
      act(async () => {
        await result.current.acceptInvitation()
      })
    ).rejects.toThrow()
  })
})
