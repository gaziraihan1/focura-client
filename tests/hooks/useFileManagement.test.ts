import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useFiles,
  useFileStats,
  useUploaders,
  useDeleteFile,
} from '@/hooks/useFileManagement'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const mockFiles = {
  files: [
    {
      id: 'file-1',
      name: 'document.pdf',
      originalName: 'document.pdf',
      size: 1024,
      sizeMB: 0.001,
      mimeType: 'application/pdf',
      url: 'https://example.com/file.pdf',
      uploadedAt: '2025-07-13T00:00:00.000Z',
      folder: null,
      uploadedBy: { id: 'user-1', name: 'Alice', email: 'alice@test.com', image: null },
      task: null,
      project: null,
    },
  ],
  total: 1,
  hasMore: false,
  isAdmin: true,
}

const mockStats = [
  { type: 'pdf', count: 5, sizeMB: 2.5 },
  { type: 'image', count: 10, sizeMB: 15.0 },
]

const mockUploaders = [
  { id: 'user-1', name: 'Alice', email: 'alice@test.com', fileCount: 8 },
]

describe('useFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches files list', async () => {
    server.use(
      http.get(`${BASE}/api/v1/file-management/:workspaceId/files`, () => {
        return HttpResponse.json({ success: true, data: mockFiles })
      })
    )

    const { result } = renderHook(
      () => useFiles('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.files).toHaveLength(1)
    expect(result.current.data?.total).toBe(1)
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useFiles(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('applies filters to query', async () => {
    let capturedUrl = ''
    server.use(
      http.get(`${BASE}/api/v1/file-management/:workspaceId/files`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({ success: true, data: mockFiles })
      })
    )

    const { result } = renderHook(
      () => useFiles('ws-1', { search: 'test', fileType: 'pdf', sortBy: 'name' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(capturedUrl).toContain('search=test')
    expect(capturedUrl).toContain('fileType=pdf')
    expect(capturedUrl).toContain('sortBy=name')
  })
})

describe('useFileStats', () => {
  it('fetches file stats', async () => {
    server.use(
      http.get(`${BASE}/api/v1/file-management/:workspaceId/stats`, () => {
        return HttpResponse.json({ success: true, data: mockStats })
      })
    )

    const { result } = renderHook(
      () => useFileStats('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].type).toBe('pdf')
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useFileStats(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useUploaders', () => {
  it('fetches uploaders list', async () => {
    server.use(
      http.get(`${BASE}/api/v1/file-management/:workspaceId/uploaders`, () => {
        return HttpResponse.json({ success: true, data: mockUploaders })
      })
    )

    const { result } = renderHook(
      () => useUploaders('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].name).toBe('Alice')
  })

  it('is disabled when enabled is false', () => {
    const { result } = renderHook(
      () => useUploaders('ws-1', false),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useDeleteFile', () => {
  it('deletes a file', async () => {
    server.use(
      http.delete(`${BASE}/api/v1/file-management/:workspaceId/files/:fileId`, () => {
        return HttpResponse.json({ success: true, data: null })
      })
    )

    const { result } = renderHook(
      () => useDeleteFile('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync('file-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
