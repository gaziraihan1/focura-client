import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'

import { useMeetingPage } from '@/hooks/useMeetingPage'

function waitForMeetings(result: Record<string, unknown>) {
  return waitFor(() => {
    expect(result.current.meetings.length).toBeGreaterThan(0)
  }, { timeout: 5000 })
}

describe('useMeetingPage', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('loads meetings for a workspace', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    expect(result.current.meetings).toHaveLength(1)
    expect(result.current.total).toBe(1)
    expect(result.current.workspaceId).toBe('ws-1')
  })

  it('provides admin/owner info', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    expect(result.current.isAdmin).toBeDefined()
    expect(result.current.isAdminOrOwner).toBeDefined()
    expect(result.current.members).toBeDefined()
  })

  it('opens and closes create form', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    expect(result.current.formOpen).toBe(false)

    act(() => result.current.openCreate())
    expect(result.current.formOpen).toBe(true)
    expect(result.current.editingMeeting).toBeNull()

    act(() => result.current.setFormOpen(false))
    expect(result.current.formOpen).toBe(false)
  })

  it('opens edit form with meeting data', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    const meeting = result.current.meetings[0]
    act(() => result.current.openEdit(meeting))

    expect(result.current.formOpen).toBe(true)
    expect(result.current.editingMeeting?.id).toBe(meeting.id)
  })

  it('opens and closes meeting detail', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    const meeting = result.current.meetings[0]
    act(() => result.current.openDetail(meeting))

    expect(result.current.detailOpen).toBe(true)
    expect(result.current.detailMeeting?.id).toBe(meeting.id)

    act(() => result.current.setDetailOpen(false))
    expect(result.current.detailOpen).toBe(false)
  })

  it('filters meetings by status', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    expect(result.current.hasFilters).toBe(false)

    act(() => result.current.setActiveStatus('SCHEDULED'))
    expect(result.current.activeStatus).toBe('SCHEDULED')
    expect(result.current.hasFilters).toBe(true)

    act(() => result.current.setActiveStatus(undefined))
    expect(result.current.hasFilters).toBe(false)
  })

  it('filters upcoming meetings', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    act(() => result.current.setUpcoming(true))
    expect(result.current.upcoming).toBe(true)
    expect(result.current.hasFilters).toBe(true)
  })

  it('submits create meeting form', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    act(() => result.current.openCreate())

    await act(async () => {
      result.current.handleFormSubmit({
        title: 'New Meeting',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        visibility: 'PUBLIC',
      })
    })

    await waitFor(() => expect(result.current.formOpen).toBe(false))
  })

  it('submits edit meeting form', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    const meeting = result.current.meetings[0]
    act(() => result.current.openEdit(meeting))

    await act(async () => {
      result.current.handleFormSubmit({
        title: 'Updated Meeting',
        startTime: meeting.startTime,
        endTime: meeting.endTime,
      })
    })

    await waitFor(() => expect(result.current.formOpen).toBe(false))
  })

  it('cancels a meeting', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    const meeting = result.current.meetings[0]
    await act(async () => {
      await result.current.handleCancel(meeting)
    })
  })

  it('deletes a meeting', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    const meeting = result.current.meetings[0]
    act(() => result.current.openDetail(meeting))

    await act(async () => {
      await result.current.handleDelete(meeting)
    })

    expect(result.current.detailOpen).toBe(false)
  })
})
