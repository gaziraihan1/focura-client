import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useInvitationPage } from '@/hooks/useInvitationPage'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('@/lib/axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/axios')>()
  return {
    ...actual,
    normalizeError: (err: any) => ({
      message: err?.message || 'Unknown error',
      status: err?.response?.status,
      code: err?.response?.data?.code,
    }),
  }
})

describe('useInvitationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('can be imported', () => {
    expect(typeof useInvitationPage).toBe('function')
  })

  it('exposes expected return shape', () => {
    // The hook needs a token, but we're just checking the shape
    const { result } = renderHook(
      () => useInvitationPage({ token: 'test-token' }),
      { wrapper: createWrapper() }
    )

    // Check the shape of the return value
    expect(result.current).toHaveProperty('invitation')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('success')
    expect(result.current).toHaveProperty('isExpired')
    expect(result.current).toHaveProperty('isAlreadyUsed')
    expect(result.current).toHaveProperty('isAccepting')
    expect(result.current).toHaveProperty('handleAccept')
    expect(result.current).toHaveProperty('handleDecline')
    expect(result.current).toHaveProperty('handleGoToDashboard')
    expect(result.current).toHaveProperty('handleGoToWorkspace')
    expect(result.current).toHaveProperty('localError')
  })

  it('initializes with correct defaults', () => {
    const { result } = renderHook(
      () => useInvitationPage({ token: 'test-token' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.success).toBe(false)
    expect(result.current.localError).toBeNull()
    expect(typeof result.current.handleAccept).toBe('function')
    expect(typeof result.current.handleDecline).toBe('function')
  })
})
