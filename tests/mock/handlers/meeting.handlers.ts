// tests/mock/handlers/meeting.handlers.ts
import { http, HttpResponse } from 'msw'
import type { Meeting, MeetingsListResponse } from '@/types/meeting.types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockMeetingUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@focura.com',
  image: null,
}

export const mockMeeting: Meeting = {
  id: 'meeting-1',
  title: 'Team Standup',
  description: 'Daily standup meeting',
  link: 'https://meet.google.com/test',
  location: null,
  visibility: 'PUBLIC',
  status: 'SCHEDULED',
  startTime: '2024-06-01T09:00:00.000Z',
  endTime: '2024-06-01T09:30:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  workspaceId: 'ws-1',
  createdById: 'user-1',
  createdBy: mockMeetingUser,
  attendees: [
    {
      id: 'attendee-1',
      userId: 'user-1',
      joinedAt: '2024-01-01T00:00:00.000Z',
      user: mockMeetingUser,
    },
  ],
}

export const mockMeetingsListResponse: MeetingsListResponse = {
  meetings: [mockMeeting],
  total: 1,
  nextCursor: null,
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const meetingHandlers = [
  // List meetings
  http.get(`${BASE}/api/v1/meetings/:workspaceId/meetings`, () =>
    ok(mockMeetingsListResponse)
  ),

  // Get single meeting
  http.get(`${BASE}/api/v1/meetings/:workspaceId/meetings/:meetingId`, ({ params }) => {
    if (params.meetingId === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return ok(mockMeeting)
  }),

  // Create meeting
  http.post(`${BASE}/api/v1/meetings/:workspaceId/meetings`, async ({ request }) => {
    const body = await request.json() as Partial<Meeting>
    return ok({ ...mockMeeting, ...body, id: 'meeting-new' })
  }),

  // Update meeting
  http.patch(`${BASE}/api/v1/meetings/:workspaceId/meetings/:meetingId`, async ({ request }) => {
    const body = await request.json() as Partial<Meeting>
    return ok({ ...mockMeeting, ...body })
  }),

  // Cancel meeting
  http.post(`${BASE}/api/v1/meetings/:workspaceId/meetings/:meetingId/cancel`, () =>
    ok({ ...mockMeeting, status: 'CANCELLED' })
  ),

  // Delete meeting
  http.delete(`${BASE}/api/v1/meetings/:workspaceId/meetings/:meetingId`, () =>
    ok(null)
  ),
]