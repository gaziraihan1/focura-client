import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mock/server'
import {
  createWrapper,
  renderHookWithProviders,
} from '../utils/renderWithProviders'
import {
  useWorkspaceUsage,
  useExportWorkspaceUsage,
  workspaceUsageKeys,
} from '@/hooks/useWorkspaceUsage'
import type { WorkspaceUsageData } from '@/types/workspace-usage.types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// The global axios mock drops options.params, so provide a params-preserving
// api mock for this file to exercise the dateRange option.
const calls = vi.hoisted(() => ({ urls: [] as string[] }))

vi.mock('@/lib/axios', () => {
  async function get<T>(endpoint: string, options?: { params?: Record<string, string> }): Promise<T> {
    const url = new URL(`${BASE}${endpoint}`)
    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        url.searchParams.set(key, value)
      }
    }
    calls.urls.push(url.toString())
    const res = await fetch(url.toString())
    return res.json()
  }

  return {
    api: {
      get,
      post: get,
      put: get,
      patch: get,
      delete: get,
      upload: get,
    },
    axiosInstance: {},
    default: {},
  }
})

const usageData: WorkspaceUsageData = {
  snapshot: {
    totalMembers: 5,
    activeMembers: 3,
    totalTasks: 20,
    totalProjects: 2,
    storageUsedMB: 100,
    activityEvents: 50,
    avgDailyUsers: 4,
    engagementScore: 75,
  },
  featureUsage: {
    tasksCreated: 10,
    commentsAdded: 5,
    timeEntriesLogged: 2,
    filesUploaded: 3,
    mentionsUsed: 1,
  },
  planLimits: {
    currentPlan: 'PRO',
    memberCount: 5,
    memberLimit: 25,
    storageUsedMB: 100,
    storageLimitMB: 10240,
    projectCount: 2,
    projectLimit: 100,
  },
  workspaceGrowth: {
    thisMonth: { newUsers: 2, newProjects: 1, newTasks: 8 },
  },
}

describe('useWorkspaceUsage', () => {
  beforeEach(() => {
    calls.urls = []
    server.use(
      http.get(`${BASE}/api/v1/workspace-usage/:workspaceId/usage`, () =>
        HttpResponse.json({ success: true, data: usageData })
      )
    )
  })

  it('fetches usage for a workspace', async () => {
    const { result } = renderHook(() => useWorkspaceUsage('ws-1'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.snapshot.totalMembers).toBe(5)
    expect(result.current.data?.planLimits.currentPlan).toBe('PRO')
  })

  it('passes the dateRange param to the API', async () => {
    const { result } = renderHook(() => useWorkspaceUsage('ws-1', { dateRange: '7d' }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(calls.urls[0]).toContain('dateRange=7d')
  })

  it('defaults to the 30d date range', async () => {
    const { result } = renderHook(() => useWorkspaceUsage('ws-1'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(calls.urls[0]).toContain('dateRange=30d')
  })

  it('is disabled when workspaceId is undefined', () => {
    const { result } = renderHook(() => useWorkspaceUsage(undefined), {
      wrapper: createWrapper(),
    })
    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
  })

  it('refetches when the date range changes', async () => {
    const { result, rerender } = renderHook(
      ({ dateRange }: { dateRange: '7d' | '30d' }) =>
        useWorkspaceUsage('ws-1', { dateRange }),
      {
        wrapper: createWrapper(),
        initialProps: { dateRange: '7d' as const },
      }
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const firstFetchCount = result.current.dataUpdatedAt

    rerender({ dateRange: '30d' })

    await waitFor(() =>
      expect(result.current.dataUpdatedAt).toBeGreaterThan(firstFetchCount)
    )
  })

  it('is disabled when the enabled option is false', () => {
    const { result } = renderHook(() => useWorkspaceUsage('ws-1', { enabled: false }), {
      wrapper: createWrapper(),
    })
    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useExportWorkspaceUsage', () => {
  let createObjectURL: ReturnType<typeof vi.fn>
  let revokeObjectURL: ReturnType<typeof vi.fn>
  let clickSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    createObjectURL = vi.fn(() => 'blob:test-url')
    revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL })
    clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    clickSpy.mockRestore()
  })

  it('exports cached data as a CSV download', async () => {
    const { result, qc } = renderHookWithProviders(() => useExportWorkspaceUsage())

    act(() => {
      qc.setQueryData(workspaceUsageKeys.detail('ws-1', '30d'), usageData)
    })

    let error: unknown
    await act(async () => {
      try {
        await result.current.exportToCSV('ws-1', '30d')
      } catch (e) {
        error = e
      }
    })

    expect(error).toBeUndefined()
    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(clickSpy).toHaveBeenCalledTimes(1)

    const blob = createObjectURL.mock.calls[0][0] as Blob
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsText(blob)
    })
    expect(text).toContain('Section,Metric,Value')
    expect(text).toContain('Overview,Total Members,5')
    expect(text).toContain('Plan Limits,Current Plan,PRO')
    expect(text).toContain('Growth,New Tasks (This Month),8')
  })

  it('throws when no cached data is available', async () => {
    const { result } = renderHookWithProviders(() => useExportWorkspaceUsage())

    await expect(result.current.exportToCSV('ws-1', '30d')).rejects.toThrow(
      'No data available for export'
    )
  })
})

describe('workspaceUsageKeys', () => {
  it('generates correct query keys', () => {
    expect(workspaceUsageKeys.all).toEqual(['workspace-usage'])
    expect(workspaceUsageKeys.detail('ws-1', '30d')).toEqual(['workspace-usage', 'ws-1', '30d'])
    expect(workspaceUsageKeys.detail('ws-2', '7d')).toEqual(['workspace-usage', 'ws-2', '7d'])
  })
})
