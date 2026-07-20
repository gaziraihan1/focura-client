import { describe, it, expect, vi } from 'vitest'

// We need to import normalizeError from the actual module, not the auto-mock.
// The module has side effects (axios instance creation), so we use importOriginal.
const { normalizeError } = await vi.importActual<typeof import('@/lib/axios')>('@/lib/axios')

describe('normalizeError', () => {
  it('normalizes an AxiosError with response data', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed with status code 400',
      response: {
        status: 400,
        data: { message: 'Invalid input', code: 'VALIDATION_ERROR' },
      },
    } as unknown

    const result = normalizeError(error)
    expect(result.message).toBe('Invalid input')
    expect(result.status).toBe(400)
    expect(result.code).toBe('VALIDATION_ERROR')
  })

  it('normalizes an AxiosError without response data', () => {
    const error = {
      isAxiosError: true,
      message: 'Network Error',
      response: undefined,
    } as unknown

    const result = normalizeError(error)
    expect(result.message).toBe('Network Error')
    expect(result.status).toBeUndefined()
  })

  it('normalizes a regular Error', () => {
    const error = new Error('Something went wrong')

    const result = normalizeError(error)
    expect(result.message).toBe('Something went wrong')
    expect(result.status).toBeUndefined()
  })

  it('normalizes an unknown error type', () => {
    const result = normalizeError('string error')
    expect(result.message).toBe('Unknown error')
  })

  it('normalizes null error', () => {
    const result = normalizeError(null)
    expect(result.message).toBe('Unknown error')
  })

  it('normalizes undefined error', () => {
    const result = normalizeError(undefined)
    expect(result.message).toBe('Unknown error')
  })
})
