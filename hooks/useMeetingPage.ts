"use client"
import { useWorkspaceMembers, useWorkspaceRole, useWorkspaces } from "./useWorkspace";
import { useCallback, useState } from "react";
import { useCancelMeeting, useCreateMeeting, useDeleteMeeting, useMeetings, useUpdateMeeting } from "./useMeeting";
import { CreateMeetingPayload, Meeting, MeetingStatus, UpdateMeetingPayload } from "@/types/meeting.types";

interface UseMeetingPageProps {
    workspaceSlug: string
}

export const useMeetingPage = ({workspaceSlug}: UseMeetingPageProps) => {
      

  // Resolve workspaceId from slug using the already-cached workspaces list
  const { data: workspaces } = useWorkspaces();
  const workspace   = workspaces?.find((w) => w.slug === workspaceSlug);
  const workspaceId = workspace?.id;

  // Permissions
  const { isOwner, isAdmin, userId, isLoading: roleLoading } = useWorkspaceRole(workspaceId);
  const isAdminOrOwner = isOwner || isAdmin;

  // Members for the attendee picker in the form modal
  const { data: members = [] } = useWorkspaceMembers(workspaceId);

  // Filters
  const [activeStatus, setActiveStatus] = useState<MeetingStatus | undefined>();
  const [upcoming, setUpcoming]         = useState(false);

  // Meetings list — disabled until workspaceId is resolved
  const { data, isLoading, error, refetch } = useMeetings({
    workspaceId: workspaceId ?? '',
    status: activeStatus,
    upcoming,
  });

  const meetings = data?.meetings ?? [];
  const total    = data?.total ?? 0;

  // Mutations
  const createMutation = useCreateMeeting(workspaceId ?? '');
  const updateMutation = useUpdateMeeting(workspaceId ?? '');
  const cancelMutation = useCancelMeeting(workspaceId ?? '');
  const deleteMutation = useDeleteMeeting(workspaceId ?? '');

  // Modal state
  const [formOpen, setFormOpen]             = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [detailMeeting, setDetailMeeting]   = useState<Meeting | null>(null);
  const [detailOpen, setDetailOpen]         = useState(false);

  const openCreate = () => { setEditingMeeting(null); setFormOpen(true); };

  const openEdit = (meeting: Meeting) => {
    setDetailOpen(false);
    setEditingMeeting(meeting);
    setFormOpen(true);
  };

  const openDetail = (meeting: Meeting) => {
    setDetailMeeting(meeting);
    setDetailOpen(true);
  };

  const handleFormSubmit = useCallback(
    (payload: CreateMeetingPayload | UpdateMeetingPayload
    ) => {
      if (editingMeeting) {
        updateMutation.mutate(
          { meetingId: editingMeeting.id, data: payload as UpdateMeetingPayload },
          {
            onSuccess: (updated) => {
              setFormOpen(false);
              setEditingMeeting(null);
              if (detailMeeting?.id === updated.id) setDetailMeeting(updated);
            },
          }
        );
      } else {
        createMutation.mutate(payload as CreateMeetingPayload, {
          onSuccess: () => setFormOpen(false),
        });
      }
    },
    [editingMeeting, updateMutation, createMutation, detailMeeting]
  );

  const handleCancel = useCallback(
    (meeting: Meeting) => {
      if (!confirm(`Cancel "${meeting.title}"? This will notify all attendees.`)) return;
      cancelMutation.mutate(meeting.id, {
        onSuccess: (updated) => {
          if (detailMeeting?.id === updated.id) setDetailMeeting(updated);
        },
      });
    },
    [cancelMutation, detailMeeting]
  );

  const handleDelete = useCallback(
    (meeting: Meeting) => {
      if (!confirm(`Delete "${meeting.title}"? This cannot be undone.`)) return;
      deleteMutation.mutate(meeting.id, {
        onSuccess: () => {
          if (detailOpen && detailMeeting?.id === meeting.id) setDetailOpen(false);
        },
      });
    },
    [deleteMutation, detailOpen, detailMeeting]
  );

  const hasFilters    = !!activeStatus || upcoming;
  const formIsPending = createMutation.isPending || updateMutation.isPending;
  const formError =
    (createMutation.error as any)?.response?.data?.message ||
    (updateMutation.error as any)?.response?.data?.message ||
    null;

    return {
        userId,
        handleCancel,
        handleDelete,
        handleFormSubmit,
        hasFilters,
        formError,
        formIsPending,
        openCreate,
        openDetail,
        openEdit,
        formOpen,
        meetings,
        total,
        roleLoading,
        isAdmin,
        isAdminOrOwner,
        members,
        isLoading,
        error,
        refetch,
        setActiveStatus,
        setUpcoming,
        workspaceId,
        upcoming,
        activeStatus,
        setEditingMeeting,
        detailMeeting,
        detailOpen,
        setDetailOpen,
        setFormOpen,
        editingMeeting        
    }
}