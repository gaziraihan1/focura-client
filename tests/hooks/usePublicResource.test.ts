import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import {
  fetchPublicPopularResources,
  fetchPublicPopularResource,
  fetchPublicProductUpdates,
  fetchPublicProductUpdate,
} from '@/hooks/usePublicResource'

const BASE = 'http://localhost:5000'

describe('fetchPublicPopularResources', () => {
  beforeAll(() => {
    vi.stubEnv('NODE_ENV', 'development')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  it('fetches popular resources with default params', async () => {
    const mockData = { data: [{ id: '1', title: 'Resource 1' }], pagination: { page: 1, total: 1 } }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    } as Response)

    const result = await fetchPublicPopularResources()
    expect(result).toEqual(mockData)
  })

  it('appends query string for provided params', async () => {
    const mockData = { data: [], pagination: { page: 1, total: 0 } }
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    } as Response)

    await fetchPublicPopularResources({ status: 'PUBLISHED', page: 2, limit: 5 })
    expect(fetchSpy).toHaveBeenCalledWith(
      `${BASE}/api/v1/resources/popular?status=PUBLISHED&page=2&limit=5`,
      expect.objectContaining({ next: { revalidate: 60 } })
    )
  })

  it('throws on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchPublicPopularResources()).rejects.toThrow('Request failed with 500')
  })

  it('throws on empty data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: null, message: 'No data' }),
    } as Response)

    await expect(fetchPublicPopularResources()).rejects.toThrow('No data')
  })
})

describe('fetchPublicPopularResource', () => {
  it('fetches a single popular resource by id', async () => {
    const mockData = { id: '1', title: 'Resource 1' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    } as Response)

    const result = await fetchPublicPopularResource('1')
    expect(result).toEqual(mockData)
  })
})

describe('fetchPublicProductUpdates', () => {
  it('fetches product updates with default params', async () => {
    const mockData = { data: [{ id: 'pu-1', title: 'Update 1' }], pagination: { page: 1, total: 1 } }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    } as Response)

    const result = await fetchPublicProductUpdates()
    expect(result).toEqual(mockData)
  })

  it('omits category from query string', async () => {
    const mockData = { data: [], pagination: { page: 1, total: 0 } }
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    } as Response)

    await fetchPublicProductUpdates({ status: 'PUBLISHED', page: 1 })
    const calledUrl = fetchSpy.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('category=')
  })
})

describe('fetchPublicProductUpdate', () => {
  it('fetches a single product update by id', async () => {
    const mockData = { id: 'pu-1', title: 'Update 1' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    } as Response)

    const result = await fetchPublicProductUpdate('pu-1')
    expect(result).toEqual(mockData)
  })
})
