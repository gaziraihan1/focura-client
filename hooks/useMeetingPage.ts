"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useWorkspaceMembers,
  useWorkspaceRole,
  useWorkspaces,
} from "./useWorkspace";
import {
  useCancelMeeting,
  useCreateMeeting,
  useDeleteMeeting,
  useMeetings,
  useUpdateMeeting,
} from "./useMeeting";
import {
  CreateMeetingPayload,
  Meeting,
  MeetingStatus,
  UpdateMeetingPayload,
} from "@/types/meeting.types";

interface UseMeetingPageProps {
  workspaceSlug: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useMeetingPage = ({ workspaceSlug }: UseMeetingPageProps) => {
  const { data: workspaces } = useWorkspaces();

  const workspace = useMemo(
    () => workspaces?.find((w) => w.slug === workspaceSlug),
    [workspaces, workspaceSlug]
  );

  const workspaceId = workspace?.id;

  const { isOwner, isAdmin, userId, isLoading: roleLoading } =
    useWorkspaceRole(workspaceId);

  const isAdminOrOwner = isOwner || isAdmin;

  const { data: members = [] } = useWorkspaceMembers(workspaceId);

  const [activeStatus, setActiveStatus] =
    useState<MeetingStatus | undefined>();
  const [upcoming, setUpcoming] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useMeetings({
    workspaceId: workspaceId ?? "",
    status: activeStatus,
    upcoming,
  });

  const meetings = data?.meetings ?? [];
  const total = data?.total ?? 0;

  const createMutation = useCreateMeeting(workspaceId ?? "");
  const updateMutation = useUpdateMeeting(workspaceId ?? "");
  const cancelMutation = useCancelMeeting(workspaceId ?? "");
  const deleteMutation = useDeleteMeeting(workspaceId ?? "");

  const [formOpen, setFormOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [detailMeeting, setDetailMeeting] = useState<Meeting | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openCreate = useCallback(() => {
    setEditingMeeting(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((meeting: Meeting) => {
    setDetailOpen(false);
    setEditingMeeting(meeting);
    setFormOpen(true);
  }, []);

  const openDetail = useCallback((meeting: Meeting) => {
    setDetailMeeting(meeting);
    setDetailOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    (payload: CreateMeetingPayload | UpdateMeetingPayload) => {
      if (!workspaceId) return;

      if (editingMeeting) {
        updateMutation.mutate(
          {
            meetingId: editingMeeting.id,
            data: payload as UpdateMeetingPayload,
          },
          {
            onSuccess: (updated) => {
              setFormOpen(false);
              setEditingMeeting(null);
              if (detailMeeting?.id === updated.id) {
                setDetailMeeting(updated);
              }
            },
          }
        );
      } else {
        createMutation.mutate(payload as CreateMeetingPayload, {
          onSuccess: () => setFormOpen(false),
        });
      }
    },
    [
      workspaceId,
      editingMeeting,
      updateMutation,
      createMutation,
      detailMeeting,
    ]
  );

  const handleCancel = useCallback(
    (meeting: Meeting) => {
      if (!confirm(`Cancel "${meeting.title}"?`)) return;

      cancelMutation.mutate(meeting.id, {
        onSuccess: (updated) => {
          if (detailMeeting?.id === updated.id) {
            setDetailMeeting(updated);
          }
        },
      });
    },
    [cancelMutation, detailMeeting]
  );

  const handleDelete = useCallback(
    (meeting: Meeting) => {
      if (!confirm(`Delete "${meeting.title}"?`)) return;

      deleteMutation.mutate(meeting.id, {
        onSuccess: () => {
          if (detailOpen && detailMeeting?.id === meeting.id) {
            setDetailOpen(false);
          }
        },
      });
    },
    [deleteMutation, detailOpen, detailMeeting]
  );

  const formIsPending =
    createMutation.isPending || updateMutation.isPending;

  const formError = useMemo(() => {
    const err =
      (createMutation.error as ApiError)?.response?.data?.message ||
      (updateMutation.error as ApiError)?.response?.data?.message;

    return err ?? null;
  }, [createMutation.error, updateMutation.error]);

  const hasFilters = !!activeStatus || upcoming;

  return {
    userId,
    workspaceId,

    meetings,
    total,

    isLoading,
    roleLoading,
    error,
    refetch,

    isAdmin,
    isAdminOrOwner,
    members,

    activeStatus,
    setActiveStatus,
    upcoming,
    setUpcoming,
    hasFilters,

    formOpen,
    setFormOpen,
    editingMeeting,
    setEditingMeeting,
    detailMeeting,
    detailOpen,
    setDetailOpen,

    openCreate,
    openEdit,
    openDetail,

    handleFormSubmit,
    handleCancel,
    handleDelete,

    formIsPending,
    formError,
  };
};