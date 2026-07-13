import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useVerifyEmail } from '@/hooks/useVerifyEmail'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('useVerifyEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows error for null token', () => {
    const { result } = renderHook(() => useVerifyEmail({ token: null }))

    expect(result.current.status).toBe('error')
    expect(result.current.message).toBe('Invalid verification link')
  })

  it('shows error for empty token', () => {
    const { result } = renderHook(() => useVerifyEmail({ token: '' }))

    expect(result.current.status).toBe('error')
    expect(result.current.message).toBe('Invalid verification link')
  })

  it('verifies email successfully', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Email verified!' }),
    }))

    const { result } = renderHook(() => useVerifyEmail({ token: 'valid-token' }))

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.message).toBe('Email verified!')
  })

  it('handles verification failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid token' }),
    }))

    const { result } = renderHook(() => useVerifyEmail({ token: 'invalid-token' }))

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.message).toBe('Invalid token')
  })

  it('handles network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const { result } = renderHook(() => useVerifyEmail({ token: 'token' }))

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.message).toBe('Something went wrong. Please try again.')
  })
})
