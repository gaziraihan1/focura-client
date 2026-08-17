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
  let confirmSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    confirmSpy = vi.fn(() => true)
    vi.stubGlobal('confirm', confirmSpy)
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

  it('opens cancel confirmation instead of browser confirm', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    const meeting = result.current.meetings[0]
    act(() => result.current.handleCancel(meeting))

    expect(result.current.confirmAction).toEqual({ type: 'cancel', meeting })
    expect(confirmSpy).not.toHaveBeenCalled()
  })

  it('cancels a meeting after confirmation', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    const meeting = result.current.meetings[0]
    act(() => result.current.handleCancel(meeting))

    await act(async () => {
      await result.current.handleConfirmAction()
    })

    expect(result.current.confirmAction).toBeNull()
  })

  it('deletes a meeting after confirmation', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    const meeting = result.current.meetings[0]
    act(() => result.current.openDetail(meeting))
    act(() => result.current.handleDelete(meeting))

    expect(result.current.confirmAction?.type).toBe('delete')

    await act(async () => {
      await result.current.handleConfirmAction()
    })

    expect(result.current.detailOpen).toBe(false)
    expect(result.current.confirmAction).toBeNull()
  })

  it('closes confirmation without acting', async () => {
    const { result } = renderHook(
      () => useMeetingPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitForMeetings(result)

    const meeting = result.current.meetings[0]
    act(() => result.current.handleCancel(meeting))
    act(() => result.current.setConfirmAction(null))

    expect(result.current.confirmAction).toBeNull()
  })
})
