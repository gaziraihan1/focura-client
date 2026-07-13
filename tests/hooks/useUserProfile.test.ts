import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useUserProfile, useInvalidateProfile, profileKeys } from '@/hooks/useUserProfile'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    status: 'authenticated',
    data: { backendToken: 'token', user: { id: 'user-1' } },
  }),
  signOut: vi.fn(),
}))

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const mockProfile = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@focura.com',
  image: 'https://example.com/avatar.png',
  bio: 'Software developer',
  timezone: 'UTC',
  role: 'USER',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownedWorkspaces: [
    { id: 'ws-1', name: 'My Workspace', plan: 'FREE', maxStorage: 1000 },
  ],
}

describe('useUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches user profile', async () => {
    server.use(
      http.get(`${BASE}/api/v1/user/profile`, () => {
        return HttpResponse.json({ success: true, data: { user: mockProfile } })
      })
    )

    const { result } = renderHook(
      () => useUserProfile(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('Test User')
    expect(result.current.data?.email).toBe('test@focura.com')
    expect(result.current.data?.ownedWorkspaces).toHaveLength(1)
  })

  it('has correct query key', () => {
    expect(profileKeys.me).toEqual(['profile', 'me'])
  })
})

describe('useInvalidateProfile', () => {
  it('returns a function that invalidates profile queries', async () => {
    const { result } = renderHook(
      () => useInvalidateProfile(),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current).toBe('function')
  })
})
