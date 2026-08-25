"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Returns a stable callback that patches URL search parameters without
 * scrolling. Passing null or "" for a key removes it. This makes the URL
 * the single source of truth for view state (filters, sort, pagination):
 * filtered views become shareable/bookmarkable and browser back/forward
 * restores previous views.
 *
 * NOTE: consecutive rapid calls each read the current searchParams snapshot,
 * so callers batching many changes should pass all keys in one call.
 */
export function useUpdateSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, searchParams, pathname],
  );
}
