export type MeetingVisibility = 'PUBLIC' | 'PRIVATE';
export type MeetingStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface MeetingUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface MeetingAttendee {
  id: string;
  userId: string;
  joinedAt: string;
  user: MeetingUser;
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  location: string | null;
  visibility: MeetingVisibility;
  status: MeetingStatus;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  createdById: string;
  createdBy: MeetingUser;
  attendees: MeetingAttendee[];
}

export interface MeetingsListResponse {
  meetings: Meeting[];
  total: number;
  nextCursor: string | null;
}

export interface CreateMeetingPayload {
  title: string;
  description?: string;
  link?: string;
  location?: string;
  visibility: MeetingVisibility;
  startTime: string;
  endTime: string;
  attendeeIds?: string[];
}

export interface UpdateMeetingPayload {
  title?: string;
  description?: string | null;
  link?: string | null;
  location?: string | null;
  visibility?: MeetingVisibility;
  status?: MeetingStatus;
  startTime?: string;
  endTime?: string;
  attendeeIds?: string[];
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: string;
  user: MeetingUser;
}