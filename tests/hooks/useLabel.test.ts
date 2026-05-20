// tests/hooks/useLabels.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'
import { createWrapper } from '../utils/renderWithProviders'

import {
  useLabels,
  useLabel,
  usePopularLabels,
  useCreateLabel,
  useUpdateLabel,
  useDeleteLabel,
  useAddLabelToTask,
  useRemoveLabelFromTask,
  useLabelOptions,
  useLabelNameExists,
} from '@/hooks/useLabels'


import type { Workspace } from '@/hooks/useWorkspace'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Shared workspace fixture ──────────────────────────────────────────────────
// useLabels and usePopularLabels gate on workspaceId resolved from useWorkspace,
// so we must seed it in the query cache via createWrapper({ defaultWorkspace }).

const defaultWorkspace: Workspace = {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-ws',
    plan: 'FREE',
    ownerId: 'user-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isPublic: false,
    allowInvites: false,
    maxMembers: 0,
    maxStorage: 0,
    owner: {
        id: '',
        name: '',
        email: '',
        image: undefined
    },
    members: [],
    _count: {
        projects: 0,
        members: 0
    }
}

const withWorkspace = () => createWrapper({ defaultWorkspace })

// ── useLabels ─────────────────────────────────────────────────────────────────

describe('useLabels', () => {
  it('fetches labels for the current workspace', async () => {
    const { result } = renderHook(() => useLabels(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data).toHaveLength(2)
    expect(result.current.data?.data?.[0].id).toBe('label-1')
    expect(result.current.data?.data?.[0].name).toBe('Bug')
  })

  it('returns correct label shape', async () => {
    const { result } = renderHook(() => useLabels(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const label = result.current.data?.data?.[0]
    expect(label).toHaveProperty('id')
    expect(label).toHaveProperty('color')
    expect(label).toHaveProperty('_count')
    expect(label?._count.tasks).toBe(3)
    expect(label?.workspaceId).toBe('ws-1')
  })

  it('is disabled (idle) until workspace resolves', () => {
    const { result } = renderHook(() => useLabels(), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('returns empty array when API returns no data', async () => {
    server.use(
      http.get(`${BASE}/api/v1/labels`, () =>
        HttpResponse.json({ data: null })
      )
    )

    const { result } = renderHook(() => useLabels(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data ?? []).toEqual([])
  })

  it('returns empty array when API returns non-array data', async () => {
    server.use(
      http.get(`${BASE}/api/v1/labels`, () =>
        HttpResponse.json({ data: 'unexpected string' })
      )
    )

    const { result } = renderHook(() => useLabels(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data ?? []).toEqual([])
  })

  it('returns empty array when API throws', async () => {
    server.use(
      http.get(`${BASE}/api/v1/labels`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(() => useLabels(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data ?? []).toEqual([])
  })
})

// ── useLabel ──────────────────────────────────────────────────────────────────

describe('useLabel', () => {
  it('fetches a single label with tasks', async () => {
    const { result } = renderHook(() => useLabel('label-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data?.id).toBe('label-1')
    expect(result.current.data?.data?.name).toBe('Bug')
    expect(result.current.data?.data?.tasks).toHaveLength(2)
    expect(result.current.data?.data?.tasks[0].task.title).toBe('Fix login bug')
  })

  it('returns task details on the label', async () => {
    const { result } = renderHook(() => useLabel('label-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const task = result.current.data?.data?.tasks[0].task
    expect(task).toHaveProperty('id')
    expect(task).toHaveProperty('status')
    expect(task).toHaveProperty('priority')
  })

  it('is disabled when id is empty', () => {
    const { result } = renderHook(() => useLabel(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('enters error state for unknown id', async () => {
    server.use(
      http.get(`${BASE}/api/v1/labels/:id`, () =>
        new HttpResponse(null, { status: 404 })
      )
    )

    const { result } = renderHook(() => useLabel('not-found'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── usePopularLabels ──────────────────────────────────────────────────────────

describe('usePopularLabels', () => {
  it('fetches popular labels for the current workspace', async () => {
  const { result } = renderHook(() => usePopularLabels(), {
    wrapper: withWorkspace(),
  })

  await waitFor(() => expect(result.current.isSuccess).toBe(true))

  expect(result.current.data).toHaveLength(2)

  expect(result.current.data?.[0].id).toBe('label-2')
})
  it('accepts a custom limit param', async () => {
    const { result } = renderHook(() => usePopularLabels({limit: 5}), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
  })

  it('is disabled until workspace resolves', () => {
    const { result } = renderHook(() => usePopularLabels(), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('returns empty array when API returns no data', async () => {
    server.use(
      http.get(`${BASE}/api/v1/labels/popular`, () =>
        HttpResponse.json({ data: null })
      )
    )

    const { result } = renderHook(() => usePopularLabels(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data ?? []).toEqual([])
  })
})
// ── useCreateLabel ────────────────────────────────────────────────────────────

describe('useCreateLabel', () => {
  it('creates a new label', async () => {
    const { result } = renderHook(() => useCreateLabel(), {
      wrapper: withWorkspace(),
    })

    await act(async () => {
      result.current.mutate({
        name: 'Chore',
        color: '#6b7280',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.id).toBe('label-new')
    expect(result.current.data?.name).toBe('Chore')
    expect(result.current.data?.color).toBe('#6b7280')
    expect(result.current.data?._count.tasks).toBe(0)
  })

  it('creates a label with a description', async () => {
    const { result } = renderHook(() => useCreateLabel(), {
      wrapper: withWorkspace(),
    })

    await act(async () => {
      result.current.mutate({
        name: 'Docs',
        color: '#10b981',
        description: 'Documentation updates',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.description).toBe('Documentation updates')
  })

  it('enters error state when creation fails', async () => {
    server.use(
      http.post(`${BASE}/api/v1/labels`, () =>
        new HttpResponse(null, { status: 400 })
      )
    )

    const { result } = renderHook(() => useCreateLabel(), {
      wrapper: withWorkspace(),
    })

    await act(async () => {
      result.current.mutate({
        name: 'Bad',
        color: '#000',
      })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useUpdateLabel ────────────────────────────────────────────────────────────

describe('useUpdateLabel', () => {
  it('updates a label name', async () => {
    const { result } = renderHook(() => useUpdateLabel(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ id: 'label-1', data: { name: 'Critical Bug' } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.id).toBe('label-1')
    expect(result.current.data?.name).toBe('Critical Bug')
  })

  it('updates a label color', async () => {
    const { result } = renderHook(() => useUpdateLabel(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ id: 'label-1', data: { color: '#000000' } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.color).toBe('#000000')
  })

  it('clears description when set to null', async () => {
    const { result } = renderHook(() => useUpdateLabel(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ id: 'label-1', data: { description: null } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.description).toBeNull()
  })

  it('enters error state when update fails', async () => {
    server.use(
      http.patch(`${BASE}/api/v1/labels/:id`, () =>
        new HttpResponse(null, { status: 404 })
      )
    )

    const { result } = renderHook(() => useUpdateLabel(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ id: 'not-found', data: { name: 'X' } })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useDeleteLabel ────────────────────────────────────────────────────────────

describe('useDeleteLabel', () => {
  it('deletes a label and returns affected task count', async () => {
    const { result } = renderHook(() => useDeleteLabel(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate('label-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.message).toBe('Label deleted successfully')
    expect(result.current.data?.tasksAffected).toBe(3)
    expect(result.current.data?.id).toBe('label-1')
  })

  it('enters error state when delete fails', async () => {
    server.use(
      http.delete(`${BASE}/api/v1/labels/:id`, () =>
        new HttpResponse(null, { status: 404 })
      )
    )

    const { result } = renderHook(() => useDeleteLabel(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate('not-found')
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useAddLabelToTask ─────────────────────────────────────────────────────────

describe('useAddLabelToTask', () => {
  it('adds a label to a task', async () => {
    const { result } = renderHook(() => useAddLabelToTask(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ labelId: 'label-1', taskId: 'task-1' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('enters error state when API fails', async () => {
    server.use(
      http.post(`${BASE}/api/v1/labels/:labelId/tasks/:taskId`, () =>
        new HttpResponse(null, { status: 400 })
      )
    )

    const { result } = renderHook(() => useAddLabelToTask(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ labelId: 'label-1', taskId: 'task-1' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useRemoveLabelFromTask ────────────────────────────────────────────────────

describe('useRemoveLabelFromTask', () => {
  it('removes a label from a task', async () => {
    const { result } = renderHook(() => useRemoveLabelFromTask(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ labelId: 'label-1', taskId: 'task-1' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('enters error state when API fails', async () => {
    server.use(
      http.delete(`${BASE}/api/v1/labels/:labelId/tasks/:taskId`, () =>
        new HttpResponse(null, { status: 400 })
      )
    )

    const { result } = renderHook(() => useRemoveLabelFromTask(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ labelId: 'label-1', taskId: 'task-1' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useLabelOptions ───────────────────────────────────────────────────────────

describe('useLabelOptions', () => {
  it('maps labels to { value, label, color } options', async () => {
    const { result } = renderHook(() => useLabelOptions(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.options).toHaveLength(2)

    const first = result.current.options[0]
    expect(first.value).toBe('label-1')
    expect(first.label).toBe('Bug')
    expect(first.color).toBe('#ef4444')
  })

  it('returns isLoading true initially', () => {
    const { result } = renderHook(() => useLabelOptions(), {
      wrapper: withWorkspace(),
    })

    // fetchStatus is fetching on first render before data arrives
    expect(result.current.options).toEqual([])
  })
})

// ── useLabelNameExists ────────────────────────────────────────────────────────

describe('useLabelNameExists', () => {
  it('returns true when name already exists', async () => {
    const { result } = renderHook(() => useLabelNameExists(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => {
      const check = result.current
      // Wait until labels are loaded (check returns true for known name)
      expect(check('Bug')).toBe(true)
    })
  })

  it('is case-insensitive', async () => {
    const { result } = renderHook(() => useLabelNameExists(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current('bug')).toBe(true))
    expect(result.current('BUG')).toBe(true)
    expect(result.current('Bug')).toBe(true)
  })

  it('returns false when name does not exist', async () => {
    const { result } = renderHook(() => useLabelNameExists(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current('Bug')).toBe(true))

    expect(result.current('nonexistent-label')).toBe(false)
  })

  it('excludes the label being edited (excludeId)', async () => {
    const { result } = renderHook(() => useLabelNameExists(), {
      wrapper: withWorkspace(),
    })

    await waitFor(() => expect(result.current('Bug')).toBe(true))

    // Editing label-1 (Bug) itself — should return false since we exclude its own id
    expect(result.current('Bug', 'label-1')).toBe(false)
    // But another label with same name (different id) would still return true
    expect(result.current('Bug', 'label-999')).toBe(true)
  })
})