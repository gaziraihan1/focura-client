import { describe, it, expect, vi } from 'vitest'

// Mock the csrf module
vi.mock('@/lib/csrf', () => ({
  invalidateCsrfToken: vi.fn(),
}))

// Import after mocking
import { qc } from '@/lib/react-query/query-client'
import { invalidateCsrfToken } from '@/lib/csrf'

describe('react-query/query-client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports a QueryClient instance', () => {
    expect(qc).toBeDefined()
    expect(typeof qc.getQueryData).toBe('function')
  })

  it('uses default staleTime of 5 minutes', () => {
    const defaults = qc.getDefaultOptions().queries
    expect(defaults?.staleTime).toBe(300_000)
  })

  it('uses gcTime of 10 minutes', () => {
    const defaults = qc.getDefaultOptions().queries
    expect(defaults?.gcTime).toBe(600_000)
  })

  it('disables refetchOnWindowFocus by default', () => {
    const defaults = qc.getDefaultOptions().queries
    expect(defaults?.refetchOnWindowFocus).toBe(false)
  })

  it('retries queries once by default', () => {
    const defaults = qc.getDefaultOptions().queries
    expect(defaults?.retry).toBe(1)
  })

  it('has mutation onError handler configured', () => {
    const defaults = qc.getDefaultOptions().mutations
    expect(defaults?.onError).toBeDefined()
    expect(typeof defaults?.onError).toBe('function')
  })

  it('mutation retry is 0 for mutations', () => {
    const defaults = qc.getDefaultOptions().mutations
    expect(defaults?.retry).toBe(0)
  })

  it('onError calls invalidateCsrfToken for CSRF errors', () => {
    const defaults = qc.getDefaultOptions().mutations
    const onError = defaults?.onError as Function

    const csrfError = {
      response: {
        data: { code: 'CSRF_VALIDATION_FAILED' },
      },
    }

    onError(csrfError)
    expect(invalidateCsrfToken).toHaveBeenCalled()
  })

  it('onError does not call invalidateCsrfToken for non-CSRF errors', () => {
    const defaults = qc.getDefaultOptions().mutations
    const onError = defaults?.onError as Function

    const regularError = {
      response: {
        data: { code: 'SOME_OTHER_ERROR' },
      },
    }

    onError(regularError)
    expect(invalidateCsrfToken).not.toHaveBeenCalled()
  })

  it('onError does not throw for errors without response', () => {
    const defaults = qc.getDefaultOptions().mutations
    const onError = defaults?.onError as Function

    expect(() => {
      onError({ message: 'Network error' })
    }).not.toThrow()
  })
})
