// tests/hooks/useComments.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useUpdateComment, useDeleteComment } from '@/hooks/useComment'

const TASK_ID = 'task-1'
const COMMENT_ID = 'comment-1'

// ─── useUpdateComment ─────────────────────────────────────────────────────────

describe('useUpdateComment', () => {
  it('updates a comment content', async () => {
    const { result } = renderHook(
      () => useUpdateComment(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        commentId: COMMENT_ID,
        taskId: TASK_ID,
        content: 'Updated comment content',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.content).toBe('Updated comment content')
    expect(result.current.data?.edited).toBe(true)
    expect(result.current.data?.id).toBe(COMMENT_ID)
  })

  it('marks comment as edited', async () => {
    const { result } = renderHook(
      () => useUpdateComment(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        commentId: COMMENT_ID,
        taskId: TASK_ID,
        content: 'Edited content',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.edited).toBe(true)
    expect(result.current.data?.parentId).toBeNull()
  })
})

// ─── useDeleteComment ─────────────────────────────────────────────────────────

describe('useDeleteComment', () => {
  it('deletes a comment', async () => {
    const { result } = renderHook(
      () => useDeleteComment(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        commentId: COMMENT_ID,
        taskId: TASK_ID,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})