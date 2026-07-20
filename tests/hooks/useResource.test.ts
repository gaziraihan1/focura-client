import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useAdminPopularResources,
  useCreatePopularResource,
  useUpdatePopularResource,
  useDeletePopularResource,
  useAdminProductUpdates,
  useCreateProductUpdate,
  useUpdateProductUpdate,
  useDeleteProductUpdate,
} from '@/hooks/useResource'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const mockPopularResource = {
  id: 'pr-1',
  title: 'React Docs',
  url: 'https://react.dev',
  description: 'Official React documentation',
  category: 'documentation',
  status: 'ACTIVE' as const,
  slug: 'react-docs',
  createdAt: '2025-07-13T00:00:00.000Z',
}

const mockProductUpdate = {
  id: 'pu-1',
  title: 'v2.0 Release',
  content: 'Major release with new features',
  status: 'ACTIVE' as const,
  slug: 'v2-release',
  createdAt: '2025-07-13T00:00:00.000Z',
}

describe('useAdminPopularResources', () => {
  it('fetches popular resources list', async () => {
    server.use(
      http.get(`${BASE}/api/v1/admin/resources/popular`, () => {
        return HttpResponse.json({
          data: { items: [mockPopularResource], total: 1, page: 1, totalPages: 1 },
        })
      })
    )

    const { result } = renderHook(
      () => useAdminPopularResources(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })
})

describe('useCreatePopularResource', () => {
  it('creates a popular resource', async () => {
    server.use(
      http.post(`${BASE}/api/v1/admin/resources/popular`, async ({ request }) => {
        const body = await request.json() as any
        return HttpResponse.json({
          success: true,
          data: { ...mockPopularResource, ...body, id: 'pr-new' },
        })
      })
    )

    const { result } = renderHook(
      () => useCreatePopularResource(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync({
        title: 'New Resource',
        url: 'https://example.com',
        description: 'A new resource',
        category: 'tools',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data?.id).toBe('pr-new')
  })
})

describe('useUpdatePopularResource', () => {
  it('updates a popular resource', async () => {
    server.use(
      http.patch(`${BASE}/api/v1/admin/resources/popular/:slug`, async ({ request }) => {
        const body = await request.json() as any
        return HttpResponse.json({
          success: true,
          data: { ...mockPopularResource, ...body },
        })
      })
    )

    const { result } = renderHook(
      () => useUpdatePopularResource(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync({
        slug: 'react-docs',
        payload: { title: 'Updated React Docs' },
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data?.title).toBe('Updated React Docs')
  })
})

describe('useDeletePopularResource', () => {
  it('deletes a popular resource', async () => {
    server.use(
      http.delete(`${BASE}/api/v1/admin/resources/popular/:slug`, () => {
        return HttpResponse.json({ success: true, data: null })
      })
    )

    const { result } = renderHook(
      () => useDeletePopularResource(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync('react-docs')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useAdminProductUpdates', () => {
  it('fetches product updates list', async () => {
    server.use(
      http.get(`${BASE}/api/v1/admin/resources/product-updates`, () => {
        return HttpResponse.json({
          data: { items: [mockProductUpdate], total: 1, page: 1, totalPages: 1 },
        })
      })
    )

    const { result } = renderHook(
      () => useAdminProductUpdates(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })
})

describe('useCreateProductUpdate', () => {
  it('creates a product update', async () => {
    server.use(
      http.post(`${BASE}/api/v1/admin/resources/product-updates`, async ({ request }) => {
        const body = await request.json() as any
        return HttpResponse.json({
          success: true,
          data: { ...mockProductUpdate, ...body, id: 'pu-new' },
        })
      })
    )

    const { result } = renderHook(
      () => useCreateProductUpdate(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync({
        title: 'New Update',
        content: 'New content',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data?.id).toBe('pu-new')
  })
})

describe('useUpdateProductUpdate', () => {
  it('updates a product update', async () => {
    server.use(
      http.patch(`${BASE}/api/v1/admin/resources/product-updates/:slug`, async ({ request }) => {
        const body = await request.json() as any
        return HttpResponse.json({
          success: true,
          data: { ...mockProductUpdate, ...body },
        })
      })
    )

    const { result } = renderHook(
      () => useUpdateProductUpdate(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync({
        slug: 'v2-release',
        payload: { title: 'Updated Release' },
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data?.title).toBe('Updated Release')
  })
})

describe('useDeleteProductUpdate', () => {
  it('deletes a product update', async () => {
    server.use(
      http.delete(`${BASE}/api/v1/admin/resources/product-updates/:slug`, () => {
        return HttpResponse.json({ success: true, data: null })
      })
    )

    const { result } = renderHook(
      () => useDeleteProductUpdate(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync('v2-release')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
