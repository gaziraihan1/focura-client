import { useCallback, useState } from "react";
import type {
  Announcement,
  AnnouncementVisibility,
  EditorTool,
} from '@/types/announcement.types';
import {
  useAnnouncementFilters,
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useTogglePinAnnouncement,
} from './useAnnouncement';
import { useWorkspace, useWorkspaceRole } from './useWorkspace';
import { useTeamMembers } from './useTeam';

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  title:      string;
  content:    string;
  visibility: AnnouncementVisibility;
  isPinned:   boolean;
  targetIds:  string[];
  projectId:  string | null;
}


const DEFAULT_FORM: FormState = {
  title:      '',
  content:    '',
  visibility: 'PUBLIC',
  isPinned:   false,
  targetIds:  [],
  projectId:  null,
};

// ─── Editor hook (toolbar + preview toggle) ───────────────────────────────────

export function useAnnouncementEditor(
  value:       string,
  onChange:    (v: string) => void,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
) {
  const [preview, setPreview] = useState(false);

 const applyFormat = useCallback(
  (tool: EditorTool) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end);

    let next: string;
    let cursorAt: number;

    if (tool.insert) {
      next = value.slice(0, start) + tool.insert + value.slice(end);
      cursorAt = start + tool.insert.length;
    } else if (tool.wrap) {
      const [open, close] = tool.wrap;
      const inner = sel || tool.sample;

      next =
        value.slice(0, start) +
        open +
        inner +
        close +
        value.slice(end);

      cursorAt = start + open.length + inner.length + close.length;
    } else {
      return;
    }

    onChange(next);

    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(cursorAt, cursorAt);
    });
  },
  [value, onChange, textareaRef],
);
  return {
    preview,
    togglePreview: useCallback(() => setPreview((p) => !p), []),
    applyFormat,
  };
}

// ─── Page hook ────────────────────────────────────────────────────────────────

export function useAnnouncementPage(
  workspaceSlug: string,
  lockedProjectId?: string | null,
) {
  // ── Modal open state
  const [showModal,  setShowModal]  = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pinningId,  setPinningId]  = useState<string | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // ── Form state — lives here, passed down as props
  const [form, setForm] = useState<FormState>({
    ...DEFAULT_FORM,
    projectId: lockedProjectId ?? null,
  });

  // ── Workspace data
  const { data: workspace, isLoading: workspaceLoading }  = useWorkspace(workspaceSlug);
  const workspaceId          = workspace?.id ?? '';
  const workspaceRole        = useWorkspaceRole(workspaceId);
  const canManage            = !!workspaceId && (workspaceRole.isOwner || workspaceRole.isAdmin);
  const { data: members = [] } = useTeamMembers(workspaceId || undefined);

  // ── Announcement data + mutations
  const { filters, setVisibility, setIsPinned, setPage, resetFilters, activeFiltersCount } =
    useAnnouncementFilters();
  const { data, isLoading: listLoading, isFetching }  = useAnnouncements(workspaceSlug, filters);
  const createAnnouncement   = useCreateAnnouncement(workspaceSlug);
  const updateAnnouncement   = useUpdateAnnouncement(workspaceSlug);
  const deleteAnnouncement   = useDeleteAnnouncement(workspaceSlug);
  const togglePin            = useTogglePinAnnouncement(workspaceSlug);

  // ── Form field handlers
  const setTitle      = useCallback((v: string) =>
    setForm((f) => ({ ...f, title: v })), []);

  const setContent    = useCallback((v: string) =>
    setForm((f) => ({ ...f, content: v })), []);

  const setVisibilityField = useCallback((v: AnnouncementVisibility) =>
    setForm((f) => ({ ...f, visibility: v, targetIds: [] })), []);

  const setIsPinnedField = useCallback((v: boolean) =>
    setForm((f) => ({ ...f, isPinned: v })), []);

  const setProjectId  = useCallback((id: string | null) =>
    setForm((f) => ({ ...f, projectId: id })), []);

  const toggleTarget  = useCallback((uid: string) =>
    setForm((f) => ({
      ...f,
      targetIds: f.targetIds.includes(uid)
        ? f.targetIds.filter((id) => id !== uid)
        : [...f.targetIds, uid],
    })), []);

  // ── Reset
  const resetForm = useCallback(() =>
    setForm({ ...DEFAULT_FORM, projectId: lockedProjectId ?? null }),
    [lockedProjectId],
  );

  // ── Modal open/close
  const openModal  = useCallback(() => {
    setEditingAnnouncement(null);
    setShowModal(true);
  }, []);
  const openEdit = useCallback((announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setForm({
      title:      announcement.title,
      content:    announcement.content,
      visibility: announcement.visibility,
      isPinned:   announcement.isPinned,
      targetIds:  announcement.targets.map((t) => t.userId),
      projectId:  announcement.projectId,
    });
    setShowModal(true);
  }, []);
  const handleClose = useCallback(() => {
    if (createAnnouncement.isPending || updateAnnouncement.isPending) return;
    resetForm();
    setEditingAnnouncement(null);
    setShowModal(false);
  }, [createAnnouncement.isPending, updateAnnouncement.isPending, resetForm]);

  // ── Submit (create or update)
  const handleSubmit = useCallback(async () => {
    if (!form.title.trim() || !form.content.trim()) return;

    const payload = {
      title:      form.title.trim(),
      content:    form.content.trim(),
      visibility: form.visibility,
      isPinned:   form.isPinned,
      targetIds:  form.visibility === 'PRIVATE' ? form.targetIds : [],
    };

    if (editingAnnouncement) {
      await updateAnnouncement.mutateAsync({
        id: editingAnnouncement.id,
        data: payload,
      });
    } else {
      await createAnnouncement.mutateAsync({
        ...payload,
        projectId: form.projectId,
        workspaceSlug,
      });
    }
    resetForm();
    setEditingAnnouncement(null);
    setShowModal(false);
  }, [form, editingAnnouncement, createAnnouncement, updateAnnouncement, resetForm, workspaceSlug]);

  // ── Delete
  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try { await deleteAnnouncement.mutateAsync(id); }
    finally { setDeletingId(null); }
  }, [deleteAnnouncement]);

  // ── Pin
  const handleTogglePin = useCallback(async (id: string) => {
    setPinningId(id);
    try { await togglePin.mutateAsync(id); }
    finally { setPinningId(null); }
  }, [togglePin]);

  const isValid = form.title.trim().length > 0 && form.content.trim().length > 0;

  return {
    // list
    data,
    isLoading: workspaceLoading || (!workspaceId ? true : listLoading),
    filters,
    setVisibility,
    setIsPinned,
    setPage,
    resetFilters,
    activeFiltersCount,
    isFetching,

    // permissions
    canManage,

    // members (for recipient picker)
    members,

    // modal open state
    showModal,
    openModal,
    openEdit,
    handleClose,
    editingAnnouncement,
    isEditing: !!editingAnnouncement,

    // form state — passed to modal as props
    form,
    isValid,
    setTitle,
    setContent,
    setVisibilityField,
    setIsPinnedField,
    setProjectId,
    toggleTarget,

    // mutation state
    isSubmitting: createAnnouncement.isPending || updateAnnouncement.isPending,
    isUpdating:   updateAnnouncement.isPending,
    handleSubmit,

    // delete / pin
    deletingId,
    pinningId,
    handleDelete,
    handleTogglePin,
  };
}


import type { AnnouncementFormState } from '@/types/announcement.types';

const EMPTY_FORM: AnnouncementFormState = {
  title:      '',
  content:    '',
  visibility: 'PUBLIC',
  isPinned:   false,
  targetIds:  [],
  projectId:  null,
};

export function useAnnouncementModal(
  workspaceSlug:      string,
  lockedProjectId?: string | null,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Lazy initializer — runs once on mount, reads lockedProjectId at that time
  const [form, setForm] = useState<AnnouncementFormState>(() => ({
    ...EMPTY_FORM,
    projectId: lockedProjectId ?? null,
  }));

  const { mutateAsync: createAsync, isPending: createPending } = useCreateAnnouncement(workspaceSlug);
  const { mutateAsync: updateAsync, isPending: updatePending }   = useUpdateAnnouncement(workspaceSlug);
  const isPending = createPending || updatePending;

  const resetForm = useCallback(() =>
    setForm({ ...EMPTY_FORM, projectId: lockedProjectId ?? null }),
    [lockedProjectId],
  );

  const open = useCallback(() => {
    setEditingAnnouncement(null);
    resetForm();
    setIsOpen(true);
  }, [resetForm]);

  const edit = useCallback((announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setForm({
      title:      announcement.title,
      content:    announcement.content,
      visibility: announcement.visibility,
      isPinned:   announcement.isPinned,
      targetIds:  announcement.targets.map((t) => t.userId),
      projectId:  announcement.projectId,
    });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    if (isPending) return;
    resetForm();
    setEditingAnnouncement(null);
    setIsOpen(false);
  }, [isPending, resetForm]);

  const onSubmit = useCallback(async () => {
    if (!form.title.trim() || !form.content.trim()) return;

    const payload = {
      title:      form.title.trim(),
      content:    form.content.trim(),
      visibility: form.visibility,
      isPinned:   form.isPinned,
      targetIds:  form.visibility === 'PRIVATE' ? form.targetIds : [],
    };

    if (editingAnnouncement) {
      await updateAsync({ id: editingAnnouncement.id, data: payload });
    } else {
      await createAsync({
        ...payload,
        // Always use the latest lockedProjectId at submit time, not form state
        // This handles the case where projectId resolved after initial render
        projectId:  lockedProjectId ?? form.projectId,
        workspaceSlug,
      });
    }
    resetForm();
    setEditingAnnouncement(null);
    setIsOpen(false);
  }, [form, editingAnnouncement, createAsync, updateAsync, resetForm, lockedProjectId, workspaceSlug]);

  const onTitleChange = useCallback(
    (v: string) => setForm((f) => ({ ...f, title: v })), []);

  const onContentChange = useCallback(
    (v: string) => setForm((f) => ({ ...f, content: v })), []);

  const onVisibilityChange = useCallback(
    (v: AnnouncementVisibility) => setForm((f) => ({ ...f, visibility: v, targetIds: [] })), []);

  const onIsPinnedChange = useCallback(
    (v: boolean) => setForm((f) => ({ ...f, isPinned: v })), []);

  const onProjectChange = useCallback(
    (id: string | null) => setForm((f) => ({ ...f, projectId: id })), []);

  const onTargetToggle = useCallback(
    (uid: string) => setForm((f) => ({
      ...f,
      targetIds: f.targetIds.includes(uid)
        ? f.targetIds.filter((id) => id !== uid)
        : [...f.targetIds, uid],
    })), []);

  const isValid = form.title.trim().length > 0 && form.content.trim().length > 0;

  return {
    open,
    edit,
    modalProps: {
      isOpen,
      isLoading: isPending,
      isValid,
      isEditing: !!editingAnnouncement,
      form,
      onClose:           close,
      onSubmit,
      onTitleChange,
      onContentChange,
      onVisibilityChange,
      onIsPinnedChange,
      onProjectChange,
      onTargetToggle,
    },
  } as const;
}