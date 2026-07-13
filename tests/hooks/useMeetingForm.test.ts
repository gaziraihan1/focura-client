import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMeetingForm, buildInitialState } from '@/hooks/useMeetingForm'
import type { Meeting } from '@/types/meeting.types'

const mockMeeting: Meeting = {
  id: 'meeting-1',
  title: 'Team Standup',
  description: 'Daily standup',
  link: 'https://meet.example.com/123',
  location: 'Room A',
  visibility: 'PUBLIC',
  startTime: '2025-07-14T10:00:00.000Z',
  endTime: '2025-07-14T11:00:00.000Z',
  workspaceId: 'ws-1',
  createdById: 'user-1',
  createdAt: '2025-07-13T00:00:00.000Z',
  updatedAt: '2025-07-13T00:00:00.000Z',
  attendees: [
    { userId: 'user-1', user: { id: 'user-1', name: 'Alice' } },
    { userId: 'user-2', user: { id: 'user-2', name: 'Bob' } },
  ],
}

describe('buildInitialState', () => {
  it('returns default state when no meeting provided', () => {
    const state = buildInitialState()
    expect(state.title).toBe('')
    expect(state.description).toBe('')
    expect(state.visibility).toBe('PUBLIC')
    expect(state.attendeeIds).toEqual([])
  })

  it('populates state from meeting data', () => {
    const state = buildInitialState(mockMeeting)
    expect(state.title).toBe('Team Standup')
    expect(state.description).toBe('Daily standup')
    expect(state.link).toBe('https://meet.example.com/123')
    expect(state.location).toBe('Room A')
    expect(state.visibility).toBe('PUBLIC')
    expect(state.attendeeIds).toEqual(['user-1', 'user-2'])
  })
})

describe('useMeetingForm', () => {
  const onSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ onSubmit })
    )

    expect(result.current.form.title).toBe('')
    expect(result.current.form.visibility).toBe('PUBLIC')
    expect(result.current.validationError).toBeNull()
  })

  it('initializes with editing meeting', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ editingMeeting: mockMeeting, onSubmit })
    )

    expect(result.current.form.title).toBe('Team Standup')
    expect(result.current.form.attendeeIds).toEqual(['user-1', 'user-2'])
  })

  it('updates a field', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ onSubmit })
    )

    act(() => result.current.setField('title', 'New Meeting'))

    expect(result.current.form.title).toBe('New Meeting')
  })

  it('toggles attendee on', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ onSubmit })
    )

    act(() => result.current.toggleAttendee('user-1'))

    expect(result.current.form.attendeeIds).toContain('user-1')
  })

  it('toggles attendee off', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ editingMeeting: mockMeeting, onSubmit })
    )

    act(() => result.current.toggleAttendee('user-1'))

    expect(result.current.form.attendeeIds).not.toContain('user-1')
    expect(result.current.form.attendeeIds).toContain('user-2')
  })

  it('validates title is required', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ onSubmit })
    )

    act(() => result.current.handleSubmit())

    expect(result.current.validationError).toBe('Title is required')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('validates end time must be after start time', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ onSubmit })
    )

    act(() => result.current.setField('title', 'Meeting'))
    act(() => result.current.setField('startTime', '2025-07-14T12:00'))
    act(() => result.current.setField('endTime', '2025-07-14T11:00'))

    act(() => result.current.handleSubmit())

    expect(result.current.validationError).toBe('End time must be after start time')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('validates private meetings need attendees', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ onSubmit })
    )

    act(() => result.current.setField('title', 'Private Meeting'))
    act(() => result.current.setField('visibility', 'PRIVATE'))
    act(() => result.current.setField('startTime', '2025-07-14T10:00'))
    act(() => result.current.setField('endTime', '2025-07-14T11:00'))

    act(() => result.current.handleSubmit())

    expect(result.current.validationError).toBe('Private meetings need at least one attendee')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits when valid', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ onSubmit })
    )

    act(() => result.current.setField('title', 'Valid Meeting'))
    act(() => result.current.setField('startTime', '2025-07-14T10:00'))
    act(() => result.current.setField('endTime', '2025-07-14T11:00'))

    act(() => result.current.handleSubmit())

    expect(result.current.validationError).toBeNull()
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Valid Meeting' })
    )
  })

  it('sets and clears member search', () => {
    const { result } = renderHook(() =>
      useMeetingForm({ onSubmit })
    )

    act(() => result.current.setMemberSearch('alice'))
    expect(result.current.memberSearch).toBe('alice')

    act(() => result.current.setMemberSearch(''))
    expect(result.current.memberSearch).toBe('')
  })
})
