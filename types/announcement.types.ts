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

export interface Announcement {
  id:          string;
  title:       string;
  content:     string;
  visibility:  AnnouncementVisibility;
  isPinned:    boolean;
  createdAt:   string;
  updatedAt:   string;
  workspaceId: string;
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

export interface CreateAnnouncementDto {
  title:      string;
  content:    string;
  visibility: AnnouncementVisibility;
  isPinned?:  boolean;
  targetIds?: string[];
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface AnnouncementFilters {
  visibility?: AnnouncementVisibility | 'ALL';
  isPinned?:   boolean;
  page?:       number;
  pageSize?:   number;
}