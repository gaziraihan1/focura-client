import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mock/server'
import { createWrapper } from '../utils/renderWithProviders'
import { useStorageOverview } from '@/hooks/useStorageOverview'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const workspaces = [
  {
    workspaceId: 'ws-1',
    workspaceName: 'Test Workspace',
    plan: 'FREE',
    usageMB: 900,
    totalMB: 1024,
    remainingMB: 124,
    percentage: 87.9,
    role: 'OWNER',
    fileCount: 12,
  },
  {
    workspaceId: 'ws-2',
    workspaceName: 'Second Workspace',
    plan: 'PRO',
    usageMB: 100,
    totalMB: 10240,
    remainingMB: 10140,
    percentage: 1,
    role: 'MEMBER',
    fileCount: 3,
  },
]

const overview = {
  storageInfo: {
    usedMB: 900,
    totalMB: 1024,
    remainingMB: 124,
    percentage: 87.9,
    plan: 'FREE',
    workspaceId: 'ws-1',
    workspaceName: 'Test Workspace',
  },
  breakdown: { byCategory: [], byUser: [] },
  largestFiles: [],
  trend: [],
  fileTypes: [],
  myContribution: { usageMB: 500, fileCount: 8, percentage: 55 },
  userContributions: [],
  isAdmin: true,
}

describe('useStorageOverview', () => {
  beforeEach(() => {
    server.use(
      http.get(`${BASE}/api/v1/storage/workspaces`, () =>
        HttpResponse.json({ success: true, data: workspaces })
      ),
      http.get(`${BASE}/api/v1/storage/:workspaceId/overview`, () =>
        HttpResponse.json({ success: true, data: overview })
      )
    )
  })

  it('loads workspaces and selects the first by default', async () => {
    const { result } = renderHook(() => useStorageOverview(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.loadingWorkspaces).toBe(false))

    expect(result.current.workspaces).toHaveLength(2)
    expect(result.current.hasWorkspaces).toBe(true)
    expect(result.current.currentWorkspaceId).toBe('ws-1')
  })

  it('fetches the storage overview for the selected workspace', async () => {
    const { result } = renderHook(() => useStorageOverview(), {
      wrapper: createWrapper(),
    })
    await waitFor(() =>
      expect(result.current.data?.storageInfo?.workspaceId).toBe('ws-1')
    )

    expect(result.current.data?.storageInfo.percentage).toBe(87.9)
    expect(result.current.warning).toEqual({
      level: 'warning',
      message: 'Test Workspace storage usage is high. Consider cleaning up files.',
    })
  })

  it('switches to another workspace when selected', async () => {
    const { result } = renderHook(() => useStorageOverview(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.loadingWorkspaces).toBe(false))

    act(() => {
      result.current.setSelectedWorkspaceId('ws-2')
    })

    expect(result.current.currentWorkspaceId).toBe('ws-2')
    expect(result.current.selectedWorkspaceId).toBe('ws-2')
  })

  it('reports no workspaces when the list is empty', async () => {
    server.use(
      http.get(`${BASE}/api/v1/storage/workspaces`, () =>
        HttpResponse.json({ success: true, data: [] })
      )
    )

    const { result } = renderHook(() => useStorageOverview(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.loadingWorkspaces).toBe(false))

    expect(result.current.hasWorkspaces).toBe(false)
    expect(result.current.currentWorkspaceId).toBe('')
  })
})
