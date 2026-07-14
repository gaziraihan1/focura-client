import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serverApi } from '@/lib/api/server'

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/auth/authOptions', () => ({
  authOptions: {},
}))

import { getServerSession } from 'next-auth'

describe('lib/api/server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('returns null when no session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const result = await serverApi('/test')
    expect(result).toBeNull()
  })

  it('returns null when no backendToken', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      backendToken: null,
    } as any)

    const result = await serverApi('/test')
    expect(result).toBeNull()
  })

  it('returns null when backendToken is empty', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      backendToken: '',
    } as any)

    const result = await serverApi('/test')
    expect(result).toBeNull()
  })

  it('makes fetch request with correct headers', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      backendToken: 'test-token-12345',
    } as any)

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 1 } }),
    } as any)

    await serverApi('/api/v1/test')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/test'),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token-12345',
        },
        cache: 'no-store',
      })
    )
  })

  it('returns data from response', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      backendToken: 'test-token-12345',
    } as any)

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 1, name: 'Test' } }),
    } as any)

    const result = await serverApi('/test')
    expect(result).toEqual({ id: 1, name: 'Test' })
  })

  it('returns json directly when no data wrapper', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      backendToken: 'test-token-12345',
    } as any)

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    } as any)

    const result = await serverApi('/test')
    expect(result).toEqual({ id: 1 })
  })

  it('returns null when response is not ok', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      backendToken: 'test-token-12345',
    } as any)

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as any)

    const result = await serverApi('/test')
    expect(result).toBeNull()
  })

  it('returns null on fetch error', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      backendToken: 'test-token-12345',
    } as any)

    vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

    const result = await serverApi('/test')
    expect(result).toBeNull()
  })
})
