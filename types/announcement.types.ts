// ─── Enums ────────────────────────────────────────────────────────────────────

export type AnnouncementVisibility = 'PUBLIC' | 'PRIVATE';

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface AnnouncementUser {
  id:    string;
  name:  string;
  image: string | null;
}

export interface AnnouncementTarget {
  userId: string;
  user:   AnnouncementUser;
}

export interface AnnouncementProject {
  userId: string;
  user:   AnnouncementUser;
}

export interface Announcement {
  id:          string;
  title:       string;
  content:     string;
  visibility:  AnnouncementVisibility;
  isPinned:    boolean;
  createdAt:   string;
  updatedAt:   string;
  workspaceId: string;
  projectId:   string | null;
  project:     AnnouncementProject | null;
  createdById: string;
  createdBy:   AnnouncementUser;
  targets:     AnnouncementTarget[];
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface AnnouncementPagination {
  page:       number;
  pageSize:   number;
  totalCount: number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export interface AnnouncementsResponse {
  data:       Announcement[];
  pagination: AnnouncementPagination;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export type AnnouncementSubmitDto = AnnouncementFormState;
export interface CreateAnnouncementDto {
  title:      string;
  content:    string;
  visibility: AnnouncementVisibility;
  workspaceSlug: string;
  isPinned?:  boolean;
  targetIds?: string[];
  projectId?: string | null;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface AnnouncementFilters {
  visibility?: AnnouncementVisibility | 'ALL';
  isPinned?:   boolean;
  page?:       number;
  pageSize?:   number;
}

import { LucideIcon } from 'lucide-react';

export interface AnnouncementContentEditorProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export interface EditorTool {
  id: string;
  icon: LucideIcon;
  label: string;
  wrap?: [string, string] | null;
  insert?: string;
  sample: string;
}

export interface PreviewContentProps {
  raw: string;
}

// announcement.types.ts
export interface WorkspaceMember {
  userId: string;
  user: { id: string; name: string; image: string | null };
}
export interface AnnouncementFormState {
  title:      string;
  content:    string;
  visibility: AnnouncementVisibility;
  isPinned:   boolean;
  targetIds:  string[];
  projectId:  string | null;
}



export interface AnnouncementModalProps {
  isOpen:            boolean;
  isLoading:         boolean;
  isValid:           boolean;
  form:              AnnouncementFormState;
  members:           WorkspaceMember[];
  projects?:         WorkspaceProject[];
  lockedProjectId?:  string | null;
  onClose:           () => void;
  onSubmit:          (data: AnnouncementSubmitDto) => Promise<void>;               // no args — hook owns the data
  onTitleChange:     (v: string) => void;
  onContentChange:   (v: string) => void;
  onVisibilityChange:(v: AnnouncementVisibility) => void;
  onIsPinnedChange:  (v: boolean) => void;
  onProjectChange:   (id: string | null) => void;
  onTargetToggle:    (uid: string) => void;
}

export interface WorkspaceProject {
  id:   string;
  name: string;
}

export interface FormState {
  title:      string;
  content:    string;
  visibility: AnnouncementVisibility;
  isPinned:   boolean;
  targetIds:  string[];
  projectId:  string | null;
}

export interface AnnouncementFormProps {
  formState:          FormState;
  members:            WorkspaceMember[];
  onTitleChange:      (v: string) => void;
  onContentChange:    (v: string) => void;
  onVisibilityChange: (v: AnnouncementVisibility) => void;
  onIsPinnedChange:   (v: boolean) => void;
  onTargetToggle:     (uid: string) => void;
  disabled?:          boolean;
  projects?:          WorkspaceProject[];
  lockedProjectId?:   string | null;
  onProjectChange?:   (id: string | null) => void;
}