'use client';

import type { Meeting, CreateMeetingPayload, UpdateMeetingPayload } from '@/types/meeting.types';
import type { WorkspaceMember } from '@/hooks/useWorkspace';

import { MeetingFormModalInner } from './MeetingForm/MeetingFormModalInner';

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateMeetingPayload | UpdateMeetingPayload) => void;
  isPending: boolean;
  error: string | null;
  members: WorkspaceMember[];
  currentUserId: string;
  editingMeeting?: Meeting | null;
}

export function MeetingFormModal(props: Props) {
  if (!props.open) return null;
  return <MeetingFormModalInner {...props} />;
}

