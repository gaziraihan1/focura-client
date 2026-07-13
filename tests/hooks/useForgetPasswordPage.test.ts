import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useForgetPasswordPage } from '@/hooks/useForgetPasswordPage'

describe('useForgetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with no error and no success', () => {
    const { result } = renderHook(() => useForgetPasswordPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.error).toBe('')
    expect(result.current.success).toBe(false)
    expect(result.current.isSubmitting).toBe(false)
  })

  it('exposes register function', () => {
    const { result } = renderHook(() => useForgetPasswordPage(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.register).toBe('function')
  })

  it('exposes handleSubmit function', () => {
    const { result } = renderHook(() => useForgetPasswordPage(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.handleSubmit).toBe('function')
  })

  it('has register for email field', () => {
    const { result } = renderHook(() => useForgetPasswordPage(), {
      wrapper: createWrapper(),
    })

    const emailRegister = result.current.register('email')
    expect(emailRegister.name).toBe('email')
  })

  it('exposes onSubmit function', () => {
    const { result } = renderHook(() => useForgetPasswordPage(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.onSubmit).toBe('function')
  })
})
