import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useResetPasswordPage } from '@/hooks/useResetPasswordPage'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('useResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with no error and no success', () => {
    const { result } = renderHook(
      () => useResetPasswordPage({ token: 'valid-token' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.error).toBe('')
    expect(result.current.success).toBe(false)
    expect(result.current.isSubmitting).toBe(false)
  })

  it('exposes register function', () => {
    const { result } = renderHook(
      () => useResetPasswordPage({ token: 'valid-token' }),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.register).toBe('function')
  })

  it('exposes handleSubmit function', () => {
    const { result } = renderHook(
      () => useResetPasswordPage({ token: 'valid-token' }),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.handleSubmit).toBe('function')
  })

  it('has register for password field', () => {
    const { result } = renderHook(
      () => useResetPasswordPage({ token: 'valid-token' }),
      { wrapper: createWrapper() }
    )

    const passwordRegister = result.current.register('password')
    expect(passwordRegister.name).toBe('password')
  })

  it('has register for confirmPassword field', () => {
    const { result } = renderHook(
      () => useResetPasswordPage({ token: 'valid-token' }),
      { wrapper: createWrapper() }
    )

    const confirmRegister = result.current.register('confirmPassword')
    expect(confirmRegister.name).toBe('confirmPassword')
  })
})
