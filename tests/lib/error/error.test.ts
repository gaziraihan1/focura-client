import { describe, it, expect, vi } from 'vitest'

const mockNormalize = vi.fn()
vi.mock('@/lib/axios', () => ({
  normalizeError: mockNormalize,
  AppError: {} as unknown,
}))

const { getErrorMessage } = await import('@/lib/error/error')

describe('getErrorMessage', () => {
  it('returns message from normalized error', () => {
    mockNormalize.mockReturnValueOnce({ message: 'Not found', status: 404 })
    expect(getErrorMessage({}, 'fallback')).toBe('Not found')
  })

  it('returns fallback when normalized message is empty', () => {
    mockNormalize.mockReturnValueOnce({ message: '' })
    expect(getErrorMessage({}, 'fallback message')).toBe('fallback message')
  })

  it('returns fallback when normalized message is undefined', () => {
    mockNormalize.mockReturnValueOnce({ message: undefined as unknown })
    expect(getErrorMessage({}, 'fallback msg')).toBe('fallback msg')
  })

  it('passes the error to normalizeError', () => {
    const err = new Error('test')
    mockNormalize.mockReturnValueOnce({ message: 'test' })
    getErrorMessage(err, 'fallback')
    expect(mockNormalize).toHaveBeenCalledWith(err)
  })
})
