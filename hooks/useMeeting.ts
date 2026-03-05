import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useMemo } from 'react';
import type {
  Meeting,
  MeetingsListResponse,
  CreateMeetingPayload,
  UpdateMeetingPayload,
  MeetingStatus,
} from '@/types/meeting.types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const meetingKeys = {
  all: ['meetings'] as const,
  lists: () => [...meetingKeys.all, 'list'] as const,
  list: (workspaceId: string, filters: Record<string, unknown>) =>
    [...meetingKeys.lists(), workspaceId, filters] as const,
  details: () => [...meetingKeys.all, 'detail'] as const,
  detail: (workspaceId: string, meetingId: string) =>
    [...meetingKeys.details(), workspaceId, meetingId] as const,
};

// ─── useMeetings ──────────────────────────────────────────────────────────────

interface UseMeetingsOptions {
  workspaceId: string;
  status?: MeetingStatus;
  upcoming?: boolean;
}

export function useMeetings({ workspaceId, status, upcoming }: UseMeetingsOptions) {
  const filters = { status, upcoming };

  return useQuery({
    queryKey: meetingKeys.list(workspaceId, filters),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (status)   qs.set('status', status);
      if (upcoming) qs.set('upcoming', 'true');
      const query = qs.toString();

      const response = await api.get<MeetingsListResponse>(
        `/api/meetings/${workspaceId}/meetings${query ? `?${query}` : ''}`,
        { showErrorToast: true }
      );
      return response?.data ?? { meetings: [], total: 0, nextCursor: null };
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── useMeeting (single) ──────────────────────────────────────────────────────

export function useMeeting(workspaceId: string, meetingId: string) {
  return useQuery({
    queryKey: meetingKeys.detail(workspaceId, meetingId),
    queryFn: async () => {
      const response = await api.get<Meeting>(`/api/meetings/${workspaceId}/meetings/${meetingId}`,
        { showErrorToast: true }
      );
      return response?.data ?? null;
    },
    enabled: !!workspaceId && !!meetingId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── useCreateMeeting ────────────────────────────────────────────────────────

export function useCreateMeeting(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<Meeting, unknown, CreateMeetingPayload>({
    mutationFn: async (payload: CreateMeetingPayload): Promise<Meeting> => {
      const response = await api.post<Meeting>(
        `/api/meetings/${workspaceId}/meetings`,
        payload,
        { showSuccessToast: false, showErrorToast: true }
      );
      return response?.data as Meeting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
}

// ─── useUpdateMeeting ────────────────────────────────────────────────────────

export function useUpdateMeeting(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Meeting,
    unknown,
    { meetingId: string; data: UpdateMeetingPayload }
  >({
    mutationFn: async ({ meetingId, data }): Promise<Meeting> => {
      const response = await api.patch<Meeting>(
        `/api/meetings/${workspaceId}/meetings/${meetingId}`,
        data,
        { showSuccessToast: false, showErrorToast: true }
      );
      return response?.data as Meeting;
    },
    onSuccess: (meeting) => {
      // Update the detail cache immediately
      queryClient.setQueryData(
        meetingKeys.detail(workspaceId, meeting.id),
        meeting
      );
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
}

// ─── useCancelMeeting ────────────────────────────────────────────────────────

export function useCancelMeeting(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<Meeting, unknown, string>({
    mutationFn: async (meetingId: string): Promise<Meeting> => {
      const response = await api.post<Meeting>(
        `/api/meetings/${workspaceId}/meetings/${meetingId}/cancel`,
        {},
        { showSuccessToast: false, showErrorToast: true }
      );
      return response?.data as Meeting;
    },
    onSuccess: (meeting) => {
      queryClient.setQueryData(
        meetingKeys.detail(workspaceId, meeting.id),
        meeting
      );
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
}

// ─── useDeleteMeeting ────────────────────────────────────────────────────────

export function useDeleteMeeting(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: async (meetingId: string): Promise<void> => {
      await api.delete(
        `/api/meetings/${workspaceId}/meetings/${meetingId}`,
        { showSuccessToast: false, showErrorToast: true }
      );
    },
    onSuccess: (_, meetingId) => {
      queryClient.removeQueries({
        queryKey: meetingKeys.detail(workspaceId, meetingId),
      });
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
}

// ─── useMeetingRole ───────────────────────────────────────────────────────────
// Mirrors useWorkspaceRole — derives what actions the current user can take
// on meetings based on their workspace role.

export interface MeetingRoleResult {
  canCreate: boolean;
  canEditAny: boolean;
  canCancelAny: boolean;
  canDeleteAny: boolean;
  canEditOwn: boolean;
  canCancelOwn: boolean;
  isAdminOrOwner: boolean;
  isLoading: boolean;
}

export function useMeetingRole(
  workspaceId: string | null | undefined,
  workspaceRole: string | null | undefined
): MeetingRoleResult {
  return useMemo(() => {
    const isAdminOrOwner =
      workspaceRole === 'OWNER' || workspaceRole === 'ADMIN';

    return {
      canCreate:     isAdminOrOwner,
      canEditAny:    isAdminOrOwner,
      canCancelAny:  isAdminOrOwner,
      canDeleteAny:  isAdminOrOwner,
      // Non-admins can still edit/cancel meetings they created
      canEditOwn:    true,
      canCancelOwn:  true,
      isAdminOrOwner,
      isLoading:     !workspaceId || workspaceRole === undefined,
    };
  }, [workspaceId, workspaceRole]);
}