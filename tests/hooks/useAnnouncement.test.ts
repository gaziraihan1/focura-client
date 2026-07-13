import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper, renderHookWithProviders } from '../utils/renderWithProviders'
import {
  useAnnouncements,
  useAnnouncement,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useTogglePinAnnouncement,
  useAnnouncementFilters,
  announcementKeys,
} from '@/hooks/useAnnouncement'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

const mockAnnouncement = {
  id: 'ann-1',
  title: 'New Feature',
  content: 'We launched a new feature!',
  visibility: 'WORKSPACE' as const,
  isPinned: false,
  projectId: null,
  workspaceId: 'ws-1',
  createdById: 'user-1',
  createdAt: '2025-07-13T00:00:00.000Z',
  updatedAt: '2025-07-13T00:00:00.000Z',
  createdBy: { id: 'user-1', name: 'Alice', image: null },
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

describe('useAnnouncementFilters', () => {
  it('returns default filters', () => {
    const { result } = renderHook(() => useAnnouncementFilters())

    expect(result.current.filters.visibility).toBe('ALL')
    expect(result.current.filters.page).toBe(1)
    expect(result.current.activeFiltersCount).toBe(0)
  })

  it('sets visibility filter', () => {
    const { result } = renderHook(() => useAnnouncementFilters())

    act(() => result.current.setVisibility('WORKSPACE'))

    expect(result.current.filters.visibility).toBe('WORKSPACE')
    expect(result.current.filters.page).toBe(1) // resets page
    expect(result.current.activeFiltersCount).toBe(1)
  })

  it('sets pinned filter', () => {
    const { result } = renderHook(() => useAnnouncementFilters())

    act(() => result.current.setIsPinned(true))

    expect(result.current.filters.isPinned).toBe(true)
    expect(result.current.activeFiltersCount).toBe(1)
  })

  it('sets page', () => {
    const { result } = renderHook(() => useAnnouncementFilters())

    act(() => result.current.setPage(3))

    expect(result.current.filters.page).toBe(3)
  })

  it('resets filters', () => {
    const { result } = renderHook(() => useAnnouncementFilters())

    act(() => result.current.setVisibility('WORKSPACE'))
    act(() => result.current.setIsPinned(true))
    act(() => result.current.resetFilters())

    expect(result.current.filters.visibility).toBe('ALL')
    expect(result.current.filters.isPinned).toBeUndefined()
    expect(result.current.activeFiltersCount).toBe(0)
  })
})

describe('useAnnouncements', () => {
  it('fetches announcements list', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:slug/announcements`, () => {
        return HttpResponse.json({
          success: true,
          data: [mockAnnouncement],
          pagination: { page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasNext: false, hasPrev: false },
        })
      })
    )

    const { result } = renderHook(
      () => useAnnouncements('ws-slug'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(1)
  })

  it('is disabled when workspaceSlug is empty', () => {
    const { result } = renderHook(
      () => useAnnouncements(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useAnnouncement', () => {
  it('fetches single announcement', async () => {
    server.use(
      http.get(`${BASE}/api/v1/announcements/:id`, () => {
        return HttpResponse.json({ data: mockAnnouncement })
      })
    )

    const { result } = renderHook(
      () => useAnnouncement('ann-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('ann-1')
  })

  it('is disabled when id is empty', () => {
    const { result } = renderHook(
      () => useAnnouncement(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useCreateAnnouncement', () => {
  it('creates an announcement', async () => {
    server.use(
      http.post(`${BASE}/api/v1/workspaces/:slug/announcements`, async ({ request }) => {
        const body = await request.json() as any
        return HttpResponse.json({
          success: true,
          data: { ...mockAnnouncement, ...body, id: 'ann-new' },
        })
      })
    )

    const { result } = renderHook(
      () => useCreateAnnouncement('ws-slug'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync({
        title: 'New Announcement',
        content: 'Hello!',
        visibility: 'WORKSPACE',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('ann-new')
  })
})

describe('useDeleteAnnouncement', () => {
  it('deletes an announcement', async () => {
    server.use(
      http.delete(`${BASE}/api/v1/announcements/:id`, () => {
        return HttpResponse.json({ success: true })
      })
    )

    const { result } = renderHookWithProviders(
      () => useDeleteAnnouncement('ws-slug')
    )

    await act(async () => {
      await result.current.mutateAsync('ann-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useTogglePinAnnouncement', () => {
  it('toggles pin on announcement', async () => {
    server.use(
      http.patch(`${BASE}/api/v1/announcements/:id/pin`, () => {
        return HttpResponse.json({
          success: true,
          data: { ...mockAnnouncement, isPinned: true },
        })
      })
    )

    const { result } = renderHook(
      () => useTogglePinAnnouncement('ws-slug'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync('ann-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.isPinned).toBe(true)
  })
})
