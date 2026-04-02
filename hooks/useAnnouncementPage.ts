import { useCallback, useState } from 'react';
import type {
  AnnouncementVisibility,
} from '@/types/announcement.types';
import {
  useAnnouncementFilters,
  useAnnouncements,
  useCreateAnnouncement,
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
    (tool: any) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const sel   = value.slice(start, end);

      let next:     string;
      let cursorAt: number;

      if ('insert' in tool && tool.insert) {
        next     = value.slice(0, start) + tool.insert + value.slice(end);
        cursorAt = start + tool.insert.length;
      } else if (tool.wrap) {
        const [open, close] = tool.wrap;
        const inner = sel || tool.sample;
        next     = value.slice(0, start) + open + inner + close + value.slice(end);
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

  // ── Form state — lives here, passed down as props
  const [form, setForm] = useState<FormState>({
    ...DEFAULT_FORM,
    projectId: lockedProjectId ?? null,
  });

  // ── Workspace data
  const { data: workspace }  = useWorkspace(workspaceSlug);
  const workspaceId          = workspace?.id ?? '';
  const workspaceRole        = useWorkspaceRole(workspaceId);
  const canManage            = workspaceRole.isOwner || workspaceRole.isAdmin;
  const { data: members = [] } = useTeamMembers(workspaceId);

  // ── Announcement data + mutations
  const { filters, setVisibility, setIsPinned, setPage, resetFilters, activeFiltersCount } =
    useAnnouncementFilters();
  const { data, isLoading }  = useAnnouncements(workspaceId, filters);
  const createAnnouncement   = useCreateAnnouncement(workspaceId);
  const deleteAnnouncement   = useDeleteAnnouncement(workspaceId);
  const togglePin            = useTogglePinAnnouncement(workspaceId);

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
  const openModal  = useCallback(() => setShowModal(true), []);
  const handleClose = useCallback(() => {
    if (createAnnouncement.isPending) return;
    resetForm();
    setShowModal(false);
  }, [createAnnouncement.isPending, resetForm]);

  // ── Submit
  const handleSubmit = useCallback(async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    await createAnnouncement.mutateAsync({
      title:      form.title.trim(),
      content:    form.content.trim(),
      visibility: form.visibility,
      isPinned:   form.isPinned,
      targetIds:  form.visibility === 'PRIVATE' ? form.targetIds : [],
      projectId:  form.projectId,
    });
    resetForm();
    setShowModal(false);
  }, [form, createAnnouncement, resetForm]);

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
    isLoading,
    filters,
    setVisibility,
    setIsPinned,
    setPage,
    resetFilters,
    activeFiltersCount,

    // permissions
    canManage,

    // members (for recipient picker)
    members,

    // modal open state
    showModal,
    openModal,
    handleClose,

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
    isSubmitting: createAnnouncement.isPending,
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
  workspaceId:      string,
  lockedProjectId?: string | null,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm]     = useState<AnnouncementFormState>({
    ...EMPTY_FORM,
    projectId: lockedProjectId ?? null,
  });

  const { mutateAsync, isPending } = useCreateAnnouncement(workspaceId);

  // Reset whenever modal closes

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => {
  if (isPending) return;
  setForm({ ...EMPTY_FORM, projectId: lockedProjectId ?? null });
  setIsOpen(false);
}, [isPending, lockedProjectId]);

  const onSubmit = useCallback(async () => {
  if (!form.title.trim() || !form.content.trim()) return;
  await mutateAsync({
    title:      form.title.trim(),
    content:    form.content.trim(),
    visibility: form.visibility,
    isPinned:   form.isPinned,
    targetIds:  form.visibility === 'PRIVATE' ? form.targetIds : [],
    projectId:  form.projectId,
  });
  setForm({ ...EMPTY_FORM, projectId: lockedProjectId ?? null }); // ← reset here
  setIsOpen(false);
}, [form, mutateAsync, lockedProjectId]);

  return {
    open,
    modalProps: {
      isOpen,
      isLoading:         isPending,
      isValid:           form.title.trim().length > 0 && form.content.trim().length > 0,
      form,
      onClose:           close,
      onSubmit,
      onTitleChange:      (v: string)                  => setForm(f => ({ ...f, title: v })),
      onContentChange:    (v: string)                  => setForm(f => ({ ...f, content: v })),
      onVisibilityChange: (v: AnnouncementVisibility)  => setForm(f => ({ ...f, visibility: v, targetIds: [] })),
      onIsPinnedChange:   (v: boolean)                 => setForm(f => ({ ...f, isPinned: v })),
      onProjectChange:    (id: string | null)          => setForm(f => ({ ...f, projectId: id })),
      onTargetToggle:     (uid: string)                => setForm(f => ({
        ...f,
        targetIds: f.targetIds.includes(uid)
          ? f.targetIds.filter(id => id !== uid)
          : [...f.targetIds, uid],
      })),
    },
  } as const;
}