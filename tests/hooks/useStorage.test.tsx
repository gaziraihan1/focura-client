// tests/hooks/useStorage.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useWorkspacesSummary,
  useWorkspaceStorageOverview,
  useWorkspaceStorageInfo,
  useMyContribution,
  useUserContributions,
  useLargestFiles,
  useBulkDeleteFiles,
  useDeleteFile,
  useCheckUpload,
} from '@/hooks/useStorage'

const WS_ID = 'ws-1'

// ─── useWorkspacesSummary ─────────────────────────────────────────────────────

describe('useWorkspacesSummary', () => {
  it('fetches all workspace storage summaries', async () => {
    const { result } = renderHook(
      () => useWorkspacesSummary(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].workspaceId).toBe(WS_ID)
    expect(result.current.data?.[0].usageMB).toBe(250)
    expect(result.current.data?.[0].percentage).toBe(25)
    expect(result.current.data?.[0].fileCount).toBe(42)
  })
})

// ─── useWorkspaceStorageOverview ──────────────────────────────────────────────

describe('useWorkspaceStorageOverview', () => {
  it('fetches full storage overview for a workspace', async () => {
    const { result } = renderHook(
      () => useWorkspaceStorageOverview(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.storageInfo.usedMB).toBe(250)
    expect(result.current.data?.isAdmin).toBe(true)
    expect(result.current.data?.largestFiles).toHaveLength(1)
    expect(result.current.data?.trend).toHaveLength(2)
    expect(result.current.data?.fileTypes).toHaveLength(2)
  })

  it('returns breakdown correctly', async () => {
    const { result } = renderHook(
      () => useWorkspaceStorageOverview(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.breakdown.total).toBe(250)
    expect(result.current.data?.breakdown.attachments).toBe(100)
    expect(result.current.data?.breakdown.projectFiles).toBe(70)
  })

  it('returns user contributions for admin', async () => {
    const { result } = renderHook(
      () => useWorkspaceStorageOverview(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.userContributions).toHaveLength(1)
    expect(result.current.data?.userContributions?.[0].userName).toBe('Test User')
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useWorkspaceStorageOverview(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useWorkspaceStorageInfo ──────────────────────────────────────────────────

describe('useWorkspaceStorageInfo', () => {
  it('fetches storage info for a workspace', async () => {
    const { result } = renderHook(
      () => useWorkspaceStorageInfo(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.usedMB).toBe(250)
    expect(result.current.data?.totalMB).toBe(1000)
    expect(result.current.data?.remainingMB).toBe(750)
    expect(result.current.data?.percentage).toBe(25)
    expect(result.current.data?.plan).toBe('FREE')
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useWorkspaceStorageInfo(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useMyContribution ────────────────────────────────────────────────────────

describe('useMyContribution', () => {
  it('fetches current user storage contribution', async () => {
    const { result } = renderHook(
      () => useMyContribution(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.usageMB).toBe(50)
    expect(result.current.data?.fileCount).toBe(10)
    expect(result.current.data?.percentage).toBe(20)
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useMyContribution(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useUserContributions ─────────────────────────────────────────────────────

describe('useUserContributions', () => {
  it('fetches all user contributions', async () => {
    const { result } = renderHook(
      () => useUserContributions(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].userName).toBe('Test User')
    expect(result.current.data?.[0].usageMB).toBe(50)
    expect(result.current.data?.[0].fileCount).toBe(10)
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useUserContributions(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('is disabled when enabled flag is false', () => {
    const { result } = renderHook(
      () => useUserContributions(WS_ID, false),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useLargestFiles ──────────────────────────────────────────────────────────

describe('useLargestFiles', () => {
  it('fetches largest files with default limit', async () => {
    const { result } = renderHook(
      () => useLargestFiles(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].sizeMB).toBe(10)
    expect(result.current.data?.[0].name).toBe('large-file.pdf')
    expect(result.current.data?.[0].task?.title).toBe('Test Task')
  })

  it('fetches largest files with custom limit', async () => {
    const { result } = renderHook(
      () => useLargestFiles(WS_ID, 5),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useLargestFiles(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useBulkDeleteFiles ───────────────────────────────────────────────────────

describe('useBulkDeleteFiles', () => {
  it('bulk deletes files and returns freed space', async () => {
    const { result } = renderHook(
      () => useBulkDeleteFiles(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate(['file-1', 'file-2', 'file-3'])
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.deletedCount).toBe(3)
    expect(result.current.data?.freedMB).toBe(30)
  })

  it('deletes a single file via bulk delete', async () => {
    const { result } = renderHook(
      () => useBulkDeleteFiles(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate(['file-1'])
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.deletedCount).toBe(1)
    expect(result.current.data?.freedMB).toBe(10)
  })
})

// ─── useDeleteFile ────────────────────────────────────────────────────────────

describe('useDeleteFile', () => {
  it('deletes a single file', async () => {
    const { result } = renderHook(
      () => useDeleteFile(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate('file-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.freedMB).toBe(10)
  })
})

// ─── useCheckUpload ───────────────────────────────────────────────────────────

describe('useCheckUpload', () => {
  it('allows upload when file size is within limit', async () => {
    const { result } = renderHook(
      () => useCheckUpload(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate(1024 * 1024) // 1MB
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.allowed).toBe(true)
    expect(result.current.data?.reason).toBeUndefined()
  })

  it('rejects upload when file size exceeds limit', async () => {
    const { result } = renderHook(
      () => useCheckUpload(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate(100 * 1024 * 1024) // 100MB
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.allowed).toBe(false)
    expect(result.current.data?.reason).toBe('File too large')
  })
})