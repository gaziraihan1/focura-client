'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

/**
 * Sync a string state value with a URL search param.
 * On mount, reads the initial value from the URL.
 * On change, updates both the local state and the URL.
 */
export function useUrlState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = (searchParams.get(key) as T) || defaultValue;

  const setValue = useCallback(
    (newValue: T) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, newValue);
      }
      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [key, defaultValue, pathname, router, searchParams],
  );

  return [value, setValue];
}
