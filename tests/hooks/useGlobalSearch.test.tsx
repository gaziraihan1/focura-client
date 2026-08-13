import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mock/server'
import { createWrapper } from '../utils/renderWithProviders'
import { useGlobalSearch } from '@/hooks/useGlobalSearch'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const mockProjects = [
  {
    id: 'p1',
    name: 'Alpha Project',
    description: 'landing page redesign',
    color: '#f00',
    slug: 'alpha-project',
    workspace: { id: 'ws-1', slug: 'test-ws', name: 'Test Workspace' },
  },
  {
    id: 'p2',
    name: 'Beta Service',
    description: 'backend service',
    color: '#0f0',
    slug: 'beta-service',
    workspace: null,
  },
]

const mockFiles = {
  files: [
    {
      id: 'f1',
      name: 'report.pdf',
      originalName: 'report.pdf',
      mimeType: 'application/pdf',
      project: { id: 'p1', name: 'Alpha Project' },
      task: null,
    },
    {
      id: 'f2',
      name: 'notes.md',
      originalName: 'notes.md',
      mimeType: 'text/markdown',
      project: null,
      task: { id: 't1', title: 'Write docs' },
    },
  ],
}

describe('useGlobalSearch', () => {
  beforeEach(() => {
    server.use(
      http.get(`${BASE}/api/v1/projects/user/all`, () =>
        HttpResponse.json({ success: true, data: mockProjects })
      ),
      http.get(`${BASE}/api/v1/file-management/:workspaceId/files`, () =>
        HttpResponse.json({ success: true, data: mockFiles })
      )
    )
  })

  it('returns empty results for short queries without fetching', () => {
    const { result } = renderHook(() => useGlobalSearch('a'), {
      wrapper: createWrapper(),
    })
    expect(result.current.hasQuery).toBe(false)
    expect(result.current.results).toEqual([])
  })

  it('returns empty results for empty/whitespace queries', () => {
    const { result } = renderHook(() => useGlobalSearch('   '), {
      wrapper: createWrapper(),
    })
    expect(result.current.hasQuery).toBe(false)
    expect(result.current.results).toEqual([])
  })

  it('filters workspaces client-side by name or description', async () => {
    // "Test Workspace" (from the default workspace handler) matches "Test"
    const { result } = renderHook(() => useGlobalSearch('Test'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const workspaceResults = result.current.results.filter(
      (r) => r.type === 'workspace'
    )
    expect(workspaceResults.length).toBeGreaterThan(0)
    expect(workspaceResults[0].title).toBe('Test Workspace')
    expect(workspaceResults[0].href).toBe('/dashboard/workspaces/test-ws')
    expect(workspaceResults[0].subtitle).toBe('FREE plan')
  })

  it('searches projects by name and description', async () => {
    const { result } = renderHook(() => useGlobalSearch('alpha'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const projectResults = result.current.results.filter(
      (r) => r.type === 'project'
    )
    expect(projectResults).toHaveLength(1)
    expect(projectResults[0].title).toBe('Alpha Project')
    expect(projectResults[0].href).toBe(
      '/dashboard/workspaces/test-ws/projects/alpha-project'
    )
  })

  it('matches projects by description', async () => {
    const { result } = renderHook(() => useGlobalSearch('backend service'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const projectResults = result.current.results.filter(
      (r) => r.type === 'project'
    )
    expect(projectResults).toHaveLength(1)
    expect(projectResults[0].title).toBe('Beta Service')
  })

  it('searches files across the users workspaces', async () => {
    const { result } = renderHook(() => useGlobalSearch('report'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const fileResults = result.current.results.filter(
      (r) => r.type === 'file'
    )
    expect(fileResults.length).toBeGreaterThan(0)
    expect(fileResults[0].title).toBe('report.pdf')
    expect(fileResults[0].href).toBe('/dashboard/workspaces/ws-1/files')
  })

  it('combines workspace, project, and file results', async () => {
    const { result } = renderHook(() => useGlobalSearch('Test'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const types = result.current.results.map((r) => r.type)
    expect(types).toContain('workspace')
    expect(types).toContain('file')
    // "Test" does not match either project name/description
    expect(types).not.toContain('project')
  })

  it('returns no workspace or project matches when nothing matches', async () => {
    const { result } = renderHook(() => useGlobalSearch('zzzzzz'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const types = result.current.results.map((r) => r.type)
    expect(types).not.toContain('workspace')
    expect(types).not.toContain('project')
  })

  it('handles a failed projects request gracefully', async () => {
    server.use(
      http.get(`${BASE}/api/v1/projects/user/all`, () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 })
      )
    )

    const { result } = renderHook(() => useGlobalSearch('Test'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Projects fetch failed -> no project results, but workspace search still works
    const types = result.current.results.map((r) => r.type)
    expect(types).toContain('workspace')
    expect(types).not.toContain('project')
  })
})
