export type ResourceStatus = "DRAFT" | "PUBLIC" | "ARCHIVE";

// ─── Popular Resource ───────────────────────────────────────────────────────

export interface PopularResourceDTO {
  id: string;
  slug: string
  title: string;
  description: string;
  image: string;
  category: string;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePopularResourceInput {
  title: string;
  description: string;
  image: string;
  category: string;
  status: ResourceStatus;
}

export type UpdatePopularResourceInput = Partial<CreatePopularResourceInput>;

// ─── Product Update ─────────────────────────────────────────────────────────

export interface ProductUpdateDTO {
  id: string;
  slug: string
  title: string;
  date: string;
  description: string;
  version: string;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductUpdateInput {
  title: string;
  date: string;
  description: string;
  version: string;
  status: ResourceStatus;
}

export type UpdateProductUpdateInput = Partial<CreateProductUpdateInput>;

// ─── Shared ──────────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ResourceFormKind = "popular" | "update";