"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  PopularResourceDTO,
  ProductUpdateDTO,
  CreatePopularResourceInput,
  UpdatePopularResourceInput,
  CreateProductUpdateInput,
  UpdateProductUpdateInput,
  PaginatedResult,
  ResourceStatus,
} from "@/types/resource.types";
import { api, ApiResponse } from "@/lib/axios";

const ADMIN_BASE = "/api/v1/admin/resources";
const PUBLIC_BASE = "/api/v1/resources";

interface ListParams {
  status?: ResourceStatus;
  category?: string;
  page?: number;
  limit?: number;
}

function toQueryString(params: ListParams = {}): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
}

// ════════════════════════════════════════════════════════════════════════
// ADMIN — authenticated, goes through the `api` client (session token +
// CSRF + auto retry/forceLogout are all handled by its interceptors).
// ════════════════════════════════════════════════════════════════════════

export const adminCreatePopularResource = (payload: CreatePopularResourceInput) =>
  api.post<PopularResourceDTO>(`${ADMIN_BASE}/popular`, payload, { showSuccessToast: true });

export const adminUpdatePopularResource = (slug: string, payload: UpdatePopularResourceInput) =>
  api.patch<PopularResourceDTO>(`${ADMIN_BASE}/popular/${slug}`, payload, { showSuccessToast: true });

export const adminDeletePopularResource = (slug: string) =>
  api.delete<null>(`${ADMIN_BASE}/popular/${slug}`, { showSuccessToast: true });

export const adminListPopularResources = (params: ListParams = {}) =>
  api.get<PaginatedResult<PopularResourceDTO>>(`${ADMIN_BASE}/popular${toQueryString(params)}`);

export const adminCreateProductUpdate = (payload: CreateProductUpdateInput) =>
  api.post<ProductUpdateDTO>(`${ADMIN_BASE}/product-updates`, payload, { showSuccessToast: true });

export const adminUpdateProductUpdate = (slug: string, payload: UpdateProductUpdateInput) =>
  api.patch<ProductUpdateDTO>(`${ADMIN_BASE}/product-updates/${slug}`, payload, {
    showSuccessToast: true,
  });

export const adminDeleteProductUpdate = (slug: string) =>
  api.delete<null>(`${ADMIN_BASE}/product-updates/${slug}`, { showSuccessToast: true });

export const adminListProductUpdates = (params: ListParams = {}) =>
  api.get<PaginatedResult<ProductUpdateDTO>>(
    `${ADMIN_BASE}/product-updates${toQueryString(params)}`,
  );

// ════════════════════════════════════════════════════════════════════════
// PUBLIC — unauthenticated. Deliberately NOT using the `api` client: it
// depends on next-auth/react's getSession(), which only works client-side.
// These are plain fetch so they also work from Server Components (RSC/ISR).
// ════════════════════════════════════════════════════════════════════════

const PUBLIC_API_BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;

async function publicFetch<T>(path: string, revalidateSeconds = 60): Promise<T> {
  const res = await fetch(`${PUBLIC_API_BASE_URL}${path}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  const json: ApiResponse<T> = await res.json();
  if (!json.data) throw new Error(json.message ?? "Empty response");
  return json.data;
}

export const fetchPublicPopularResources = (params: Omit<ListParams, "status"> = {}) =>
  publicFetch<PaginatedResult<PopularResourceDTO>>(
    `${PUBLIC_BASE}/popular${toQueryString(params)}`,
  );

export const fetchPublicPopularResource = (id: string) =>
  publicFetch<PopularResourceDTO>(`${PUBLIC_BASE}/popular/${id}`);

export const fetchPublicProductUpdates = (
  params: Omit<ListParams, "status" | "category"> = {},
) =>
  publicFetch<PaginatedResult<ProductUpdateDTO>>(
    `${PUBLIC_BASE}/product-updates${toQueryString(params)}`,
  );

export const fetchPublicProductUpdate = (id: string) =>
  publicFetch<ProductUpdateDTO>(`${PUBLIC_BASE}/product-updates/${id}`);

// ════════════════════════════════════════════════════════════════════════
// QUERY KEY FACTORY
// Base keys (popularAll / productUpdatesAll) are used for broad invalidation
// after any mutation. Page-scoped keys scope individual list queries.
// ════════════════════════════════════════════════════════════════════════

export const RESOURCE_QUERY_KEYS = {
  popularAll: ["admin", "resources", "popular"] as const,
  popular: (page: number) => ["admin", "resources", "popular", page] as const,

  productUpdatesAll: ["admin", "resources", "product-updates"] as const,
  productUpdates: (page: number) => ["admin", "resources", "product-updates", page] as const,
} as const;

// ─── Popular Resources ──────────────────────────────────────────────────────

export function useAdminPopularResources(page = 1, limit = 8) {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.popular(page),
    queryFn: () => adminListPopularResources({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });
}

export function useCreatePopularResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePopularResourceInput) => adminCreatePopularResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.popularAll });
    },
  });
}

export function useUpdatePopularResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: UpdatePopularResourceInput }) =>
      adminUpdatePopularResource(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.popularAll });
    },
  });
}

export function useDeletePopularResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => adminDeletePopularResource(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.popularAll });
    },
  });
}

// ─── Product Updates ────────────────────────────────────────────────────────

export function useAdminProductUpdates(page = 1, limit = 8) {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.productUpdates(page),
    queryFn: () => adminListProductUpdates({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });
}

export function useCreateProductUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductUpdateInput) => adminCreateProductUpdate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.productUpdatesAll });
    },
  });
}

export function useUpdateProductUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: UpdateProductUpdateInput }) =>
      adminUpdateProductUpdate(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.productUpdatesAll });
    },
  });
}

export function useDeleteProductUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => adminDeleteProductUpdate(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.productUpdatesAll });
    },
  });
}