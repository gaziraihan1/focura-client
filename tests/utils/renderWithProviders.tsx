// tests/utils/renderWithProviders.tsx
import { render, renderHook, RenderHookOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'

// Import your types
import { workspaceKeys, type Workspace, type WorkspaceMember } from '@/hooks/useWorkspace'
import { taskKeys, type Task, type TasksResponse } from '@/hooks/useTask'
import { Subtask } from '@/types/subtasks.types'
import { subtaskKeys } from '@/hooks/useSubtasks'
import { featureKeys  } from '@/hooks/useFeatures' // ← ADD THIS
import { FeatureRequest, FeaturesResponse } from '@/types/feature.types'

interface WrapperOptions {
  defaultWorkspace?: Workspace
  defaultMembers?: WorkspaceMember[]
  defaultTask?: Task
  defaultTasks?: Task[]
  defaultSubtasks?: { parentId: string; subtasks: Subtask[] }
  defaultFeatures?: FeaturesResponse  // ← ADD THIS
  defaultFeature?: FeatureRequest     // ← ADD THIS
}

function makeQueryClient(options?: WrapperOptions) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

  // ... existing workspace/task/subtask seeding ...
  
  if (options?.defaultWorkspace) {
    const ws = options.defaultWorkspace
    qc.setQueryData(workspaceKeys.detail(ws.slug), ws)
    qc.setQueryData(workspaceKeys.detail(ws.id), ws)
  }

  if (options?.defaultMembers) {
    qc.setQueryData(workspaceKeys.members('ws-1'), options.defaultMembers)
  }

  if (options?.defaultTask) {
    qc.setQueryData(taskKeys.detail(options.defaultTask.id), options.defaultTask)
  }

  if (options?.defaultTasks) {
  const tasksResponse: TasksResponse = {
    data: options.defaultTasks,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: options.defaultTasks.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  }
  // Match exact key useTasks() uses with default args
  qc.setQueryData(taskKeys.list(undefined, 1, 10, undefined), tasksResponse)
}
if (options?.defaultSubtasks) {
  const {parentId, subtasks} = options.defaultSubtasks;
  qc.setQueryData(subtaskKeys.all(parentId), subtasks)
}


  // ─── Feature Requests Seeding ──────────────────────────────────────────────
  if (options?.defaultFeatures) {
    // Seed the default list query (matches useFeatureRequests default params)
    qc.setQueryData(
      featureKeys.lists({ status: 'ALL', page: 1, pageSize: 20 }),
      options.defaultFeatures
    )
  }

  if (options?.defaultFeature) {
    qc.setQueryData(featureKeys.detail(options.defaultFeature.id), options.defaultFeature)
  }

  return qc
}

// Wrapper for render()
export function createWrapper(options?: WrapperOptions) {
  const qc = makeQueryClient(options)
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
  return Wrapper
}

// Wrapper for render() that also returns qc
export function renderWithProviders(ui: ReactNode, options?: WrapperOptions) {
  const qc = makeQueryClient(options)
  return {
    ...render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>),
    qc,
  }
}

// ─── NEW: Wrapper for renderHook() that returns qc ───────────────────────────
export function renderHookWithProviders<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: WrapperOptions & RenderHookOptions<TProps>
) {
  const qc = makeQueryClient(options)
  
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )

  const result = renderHook(hook, {
    ...options,
    wrapper,
  })

  return {
    ...result,
    qc, // ← Expose QueryClient for assertions
  }
}

// Type helper for cleaner test code
export type RenderHookWithProvidersResult<TProps, TResult> = ReturnType<
  typeof renderHookWithProviders<TProps, TResult>
>