import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { server } from '../mock/server'
import { useUpdateProject, projectKeys, useProjects } from '@/hooks/useProjects'
import { mockProjectDetails } from '../mock/handlers/project.handlers'

const PROJECT_ID = 'project-1'
const WS_ID = 'ws-1'
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Stateful server: PATCH reflects into subsequent GETs (mirrors the real
// backend after the awaited cache-invalidation fix).
let storedStatus = 'ACTIVE'

afterEach(() => {
  storedStatus = 'ACTIVE'
})

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
  return { qc, wrapper }
}

describe('archive status propagation', () => {
  it('updates the workspace list cache when archiving', async () => {
    const { qc, wrapper } = makeWrapper()
    qc.setQueryData(projectKeys.list(WS_ID), [{ ...mockProjectDetails, status: 'ACTIVE' }])

    const { result } = renderHook(() => useUpdateProject(), { wrapper })

    await act(async () => {
      result.current.mutate({ projectId: PROJECT_ID, data: { status: 'ARCHIVED' } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const cached = qc.getQueryData(projectKeys.list(WS_ID)) as any[]
    expect(cached?.[0]?.status).toBe('ARCHIVED')
  })

  it('keeps ARCHIVED when the list query remounts after archiving (server is fresh)', async () => {
    // Override with a stateful backend: the GET reflects the last PATCH.
    server.use(
      http.get(`${BASE}/api/v1/projects/workspace/:workspaceId`, () =>
        HttpResponse.json({ success: true, data: [{ ...mockProjectDetails, status: storedStatus }] }),
      ),
      http.patch(`${BASE}/api/v1/projects/:projectId`, async ({ request }) => {
        const body = await request.json() as Partial<typeof mockProjectDetails>
        if (body.status) storedStatus = body.status
        return HttpResponse.json({ success: true, data: { ...mockProjectDetails, ...body } })
      }),
    )

    const { wrapper } = makeWrapper()

    // Step 1: mount the list query (simulates the projects page being open)
    const list = renderHook(() => useProjects(WS_ID), { wrapper })
    await waitFor(() => expect(list.result.current.data?.[0]?.status).toBe('ACTIVE'))

    // Step 2: archive (simulates navigating to settings and archiving)
    const mut = renderHook(() => useUpdateProject(), { wrapper })
    await act(async () => {
      mut.result.current.mutate({ projectId: PROJECT_ID, data: { status: 'ARCHIVED' } })
    })
    await waitFor(() => expect(mut.result.current.isSuccess).toBe(true))

    // Step 3: re-mount the list query (simulates navigating back to projects page)
    list.unmount()
    const relist = renderHook(() => useProjects(WS_ID), { wrapper })
    await waitFor(() => expect(relist.result.current.data?.[0]?.status).toBe('ARCHIVED'))
  })
})
