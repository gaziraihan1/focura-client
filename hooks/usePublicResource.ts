import { ApiResponse } from "@/lib/axios";
import { PaginatedResult, PopularResourceDTO, ProductUpdateDTO, ResourceStatus } from "@/types/resource.types";

const PUBLIC_BASE = "/api/v1/resources";
interface ListParams {
  status?: ResourceStatus;
  category?: string;
  page?: number;
  limit?: number;
}

const PUBLIC_API_BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;

  function toQueryString(params: ListParams = {}): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
}


async function publicFetch<T>(path: string, revalidateSeconds = 60): Promise<T> {
  const res = await fetch(`${PUBLIC_API_BASE_URL}${path}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  const json: ApiResponse<T> = await res.json();
  if (!json.data) throw new Error(json.message ?? "Empty response");
  return json.data;
}

export const fetchPublicPopularResources = (params: ListParams = {}) =>
  publicFetch<PaginatedResult<PopularResourceDTO>>(
    `${PUBLIC_BASE}/popular${toQueryString(params)}`,
  );

export const fetchPublicPopularResource = (id: string) =>
  publicFetch<PopularResourceDTO>(`${PUBLIC_BASE}/popular/${id}`);

export const fetchPublicProductUpdates = (
  params: Omit<ListParams,  "category"> = {},
) =>
  publicFetch<PaginatedResult<ProductUpdateDTO>>(
    `${PUBLIC_BASE}/product-updates${toQueryString(params)}`,
  );

export const fetchPublicProductUpdate = (id: string) =>
  publicFetch<ProductUpdateDTO>(`${PUBLIC_BASE}/product-updates/${id}`);
