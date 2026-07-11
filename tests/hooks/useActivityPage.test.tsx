import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { renderHookWithProviders } from '../utils/renderWithProviders'
import { useActivityPage } from '@/hooks/useActivityPage'
import { activityKeys } from '@/hooks/useActivity'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'
import { mockActivity, mockActivity2 } from '../mock/handlers/activity.handlers'

describe('useActivityPage', () => {
  const workspaceId = 'ws-1'

  it('should initialize with empty filters and activities', async () => {
    const { result } = renderHookWithProviders(() => useActivityPage({ workspaceId }))

    expect(result.current.filters).toEqual({})
    expect(result.current.showDeleteDialog).toBe(false)
    
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.activities).toEqual([mockActivity, mockActivity2])
  })

  it('should handle filter updates', async () => {
    const { result } = renderHookWithProviders(() => useActivityPage({ workspaceId }))

    act(() => {
      result.current.setFilters({ action: 'CREATED' })
    })

    expect(result.current.filters).toEqual({ action: 'CREATED' })
  })

  it('should handle clear activities flow', async () => {
    const { result } = renderHookWithProviders(() => useActivityPage({ workspaceId }))

    act(() => {
      result.current.setShowDeleteDialog(true)
    })

    expect(result.current.showDeleteDialog).toBe(true)

    await act(async () => {
      await result.current.handleClearActivities()
    })

    expect(result.current.showDeleteDialog).toBe(false)
  })

  it('should handle clear activities error', async () => {
    server.use(
      http.delete('*/api/v1/activities/clear/all', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHookWithProviders(() => useActivityPage({ workspaceId }))

    await act(async () => {
      await result.current.handleClearActivities()
    })

    expect(consoleSpy).toHaveBeenCalledWith('Failed to clear activities:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('should handle refresh', async () => {
    const { result, qc } = renderHookWithProviders(() => useActivityPage({ workspaceId }))
    
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    
    // Use setQueriesData to match all activity list queries
    qc.setQueriesData({ queryKey: activityKeys.lists() }, [])
    
    await waitFor(() => expect(result.current.activities).toEqual([]))

    act(() => {
      result.current.handleRefresh()
    })

    await waitFor(() => expect(result.current.activities).toEqual([mockActivity, mockActivity2]))
  })
})
