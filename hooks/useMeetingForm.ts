'use client';

import { useState, useCallback } from 'react';
import type { Meeting, MeetingVisibility, CreateMeetingPayload, UpdateMeetingPayload } from '@/types/meeting.types';
import { toLocalInputDatetime, fromLocalInputDatetime } from '@/utils/meeting.utils';

export interface FormState {
  title: string;
  description: string;
  link: string;
  location: string;
  visibility: MeetingVisibility;
  startTime: string;
  endTime: string;
  attendeeIds: string[];
}

function defaultStartTime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30, 0, 0);
  return toLocalInputDatetime(d.toISOString());
}

function defaultEndTime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 90, 0, 0);
  return toLocalInputDatetime(d.toISOString());
}

export function buildInitialState(meeting?: Meeting | null): FormState {
  if (meeting) {
    return {
      title:       meeting.title,
      description: meeting.description ?? '',
      link:        meeting.link ?? '',
      location:    meeting.location ?? '',
      visibility:  meeting.visibility,
      startTime:   toLocalInputDatetime(meeting.startTime),
      endTime:     toLocalInputDatetime(meeting.endTime),
      attendeeIds: meeting.attendees.map((a) => a.userId),
    };
  }
  return {
    title: '', description: '', link: '', location: '',
    visibility: 'PUBLIC',
    startTime: defaultStartTime(),
    endTime: defaultEndTime(),
    attendeeIds: [],
  };
}

interface UseMeetingFormProps {
  editingMeeting?: Meeting | null;
  onSubmit: (payload: CreateMeetingPayload | UpdateMeetingPayload) => void;
}

export function useMeetingForm({ editingMeeting, onSubmit }: UseMeetingFormProps) {
  const [form, setForm]                       = useState<FormState>(() => buildInitialState(editingMeeting));
  const [validationError, setValidationError] = useState<string | null>(null);
  const [memberSearch, setMemberSearch]       = useState('');

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const toggleAttendee = useCallback((userId: string) => {
    setForm((prev) => ({
      ...prev,
      attendeeIds: prev.attendeeIds.includes(userId)
        ? prev.attendeeIds.filter((id) => id !== userId)
        : [...prev.attendeeIds, userId],
    }));
  }, []);

  // validate is inlined directly — no separate function reference,
  // so React Compiler can correctly infer [form, editingMeeting, onSubmit].
  const handleSubmit = useCallback(() => {
    if (!form.title.trim()) {
      setValidationError('Title is required');
      return;
    }
    const start = new Date(form.startTime);
    const end   = new Date(form.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setValidationError('Invalid date/time');
      return;
    }
    if (end <= start) {
      setValidationError('End time must be after start time');
      return;
    }
    if (form.visibility === 'PRIVATE' && form.attendeeIds.length === 0) {
      setValidationError('Private meetings need at least one attendee');
      return;
    }

    setValidationError(null);

    onSubmit({
      title:       form.title.trim(),
      description: form.description.trim() || undefined,
      link:        form.link.trim() || undefined,
      location:    form.location.trim() || undefined,
      visibility:  form.visibility,
      startTime:   fromLocalInputDatetime(form.startTime),
      endTime:     fromLocalInputDatetime(form.endTime),
      ...(form.visibility === 'PRIVATE' || editingMeeting || form.attendeeIds.length > 0
        ? { attendeeIds: form.attendeeIds }
        : {}),
    });
  }, [form, editingMeeting, onSubmit]);

  return { form, setField, toggleAttendee, memberSearch, setMemberSearch, validationError, handleSubmit };
}