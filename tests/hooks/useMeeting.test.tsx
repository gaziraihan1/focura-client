// tests/hooks/useMeeting.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useMeetings,
  useMeeting,
  useCreateMeeting,
  useUpdateMeeting,
  useCancelMeeting,
  useDeleteMeeting,
  useMeetingRole,
} from '@/hooks/useMeeting'

const WS_ID = 'ws-1'
const MEETING_ID = 'meeting-1'

// ─── useMeetings ──────────────────────────────────────────────────────────────

describe('useMeetings', () => {
  it('fetches meetings list for a workspace', async () => {
    const { result } = renderHook(
      () => useMeetings({ workspaceId: WS_ID }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.meetings).toHaveLength(1)
    expect(result.current.data?.meetings[0].title).toBe('Team Standup')
    expect(result.current.data?.total).toBe(1)
  })

  it('fetches meetings with status filter', async () => {
    const { result } = renderHook(
      () => useMeetings({ workspaceId: WS_ID, status: 'SCHEDULED' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.meetings).toBeDefined()
  })

  it('fetches upcoming meetings', async () => {
    const { result } = renderHook(
      () => useMeetings({ workspaceId: WS_ID, upcoming: true }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.meetings).toBeDefined()
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useMeetings({ workspaceId: '' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useMeeting ───────────────────────────────────────────────────────────────

describe('useMeeting', () => {
  it('fetches a single meeting by id', async () => {
    const { result } = renderHook(
      () => useMeeting(WS_ID, MEETING_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe(MEETING_ID)
    expect(result.current.data?.title).toBe('Team Standup')
    expect(result.current.data?.status).toBe('SCHEDULED')
    expect(result.current.data?.attendees).toHaveLength(1)
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useMeeting('', MEETING_ID),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('is disabled when meetingId is empty', () => {
    const { result } = renderHook(
      () => useMeeting(WS_ID, ''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useCreateMeeting ─────────────────────────────────────────────────────────

describe('useCreateMeeting', () => {
  it('creates a meeting', async () => {
    const { result } = renderHook(
      () => useCreateMeeting(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        title: 'New Meeting',
        visibility: 'PUBLIC',
        startTime: '2024-06-02T10:00:00.000Z',
        endTime: '2024-06-02T11:00:00.000Z',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('New Meeting')
    expect(result.current.data?.id).toBe('meeting-new')
  })

  it('creates a private meeting with attendees', async () => {
    const { result } = renderHook(
      () => useCreateMeeting(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        title: 'Private Sync',
        visibility: 'PRIVATE',
        startTime: '2024-06-02T10:00:00.000Z',
        endTime: '2024-06-02T11:00:00.000Z',
        attendeeIds: ['user-2', 'user-3'],
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.visibility).toBe('PRIVATE')
  })
})

// ─── useUpdateMeeting ─────────────────────────────────────────────────────────

describe('useUpdateMeeting', () => {
  it('updates a meeting title', async () => {
    const { result } = renderHook(
      () => useUpdateMeeting(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        meetingId: MEETING_ID,
        data: { title: 'Updated Standup' },
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('Updated Standup')
  })

  it('updates meeting visibility', async () => {
    const { result } = renderHook(
      () => useUpdateMeeting(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        meetingId: MEETING_ID,
        data: { visibility: 'PRIVATE' },
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.visibility).toBe('PRIVATE')
  })
})

// ─── useCancelMeeting ─────────────────────────────────────────────────────────

describe('useCancelMeeting', () => {
  it('cancels a meeting', async () => {
    const { result } = renderHook(
      () => useCancelMeeting(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate(MEETING_ID)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('CANCELLED')
    expect(result.current.data?.id).toBe(MEETING_ID)
  })
})

// ─── useDeleteMeeting ─────────────────────────────────────────────────────────

describe('useDeleteMeeting', () => {
  it('deletes a meeting', async () => {
    const { result } = renderHook(
      () => useDeleteMeeting(WS_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate(MEETING_ID)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ─── useMeetingRole ───────────────────────────────────────────────────────────

describe('useMeetingRole', () => {
  it('grants full permissions to OWNER', () => {
    const { result } = renderHook(
      () => useMeetingRole(WS_ID, 'OWNER'),
      { wrapper: createWrapper() }
    )

    expect(result.current.isAdminOrOwner).toBe(true)
    expect(result.current.canCreate).toBe(true)
    expect(result.current.canEditAny).toBe(true)
    expect(result.current.canCancelAny).toBe(true)
    expect(result.current.canDeleteAny).toBe(true)
    expect(result.current.canEditOwn).toBe(true)
    expect(result.current.canCancelOwn).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('grants full permissions to ADMIN', () => {
    const { result } = renderHook(
      () => useMeetingRole(WS_ID, 'ADMIN'),
      { wrapper: createWrapper() }
    )

    expect(result.current.isAdminOrOwner).toBe(true)
    expect(result.current.canCreate).toBe(true)
    expect(result.current.canDeleteAny).toBe(true)
  })

  it('restricts MEMBER to own meetings only', () => {
    const { result } = renderHook(
      () => useMeetingRole(WS_ID, 'MEMBER'),
      { wrapper: createWrapper() }
    )

    expect(result.current.isAdminOrOwner).toBe(false)
    expect(result.current.canCreate).toBe(false)
    expect(result.current.canEditAny).toBe(false)
    expect(result.current.canCancelAny).toBe(false)
    expect(result.current.canDeleteAny).toBe(false)
    expect(result.current.canEditOwn).toBe(true)
    expect(result.current.canCancelOwn).toBe(true)
  })

  it('restricts GUEST same as MEMBER', () => {
    const { result } = renderHook(
      () => useMeetingRole(WS_ID, 'GUEST'),
      { wrapper: createWrapper() }
    )

    expect(result.current.isAdminOrOwner).toBe(false)
    expect(result.current.canCreate).toBe(false)
    expect(result.current.canEditOwn).toBe(true)
  })

  it('returns isLoading true when workspaceId is null', () => {
    const { result } = renderHook(
      () => useMeetingRole(null, 'OWNER'),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('returns isLoading true when role is undefined', () => {
    const { result } = renderHook(
      () => useMeetingRole(WS_ID, undefined),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(true)
  })
})