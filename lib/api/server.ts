import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { SERVER_API_BASE_URL } from "@/lib/config/api";

export interface ServerApiOptions {
  /**
   * When false, returns the FULL backend envelope
   * ({ success, data?, pagination?, message? }) instead of unwrapping `.data`.
   * Required when prefetching React Query caches whose queryFn stores the
   * envelope (e.g. the paginated admin list hooks in hooks/useAdmin.ts).
   */
  unwrap?: boolean;
  /** Abort the upstream request after this many ms. Default: 10_000. */
  timeoutMs?: number;
}

/**
 * Server-side GET against the Focura backend using the session's backendToken.
 * Returns null on ANY failure (no session/token, non-2xx, network/timeout) —
 * callers must treat null as "no data" and degrade gracefully.
 */
export async function serverApi<T = unknown>(
  endpoint: string,
  options: ServerApiOptions = {},
): Promise<T | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.backendToken;
    if (!token) return null;

    const res = await fetch(`${SERVER_API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (options.unwrap === false) return json as T;
    return (json?.data ?? json) as T;
  } catch {
    return null;
  }
}

/**
 * Like {@link serverApi} but THROWS instead of returning null.
 *
 * Use this for React Query `prefetchQuery` during SSR: a queryFn that resolves
 * to null would poison the hydrated cache (client observers would see
 * `data: null` as fresh and never refetch). Throwing keeps the cache entry
 * absent so the client-side hook fetches normally after hydration.
 */
export async function serverApiStrict<T = unknown>(
  endpoint: string,
  options: ServerApiOptions = {},
): Promise<T> {
  const data = await serverApi<T>(endpoint, options);
  if (data === null || data === undefined) {
    throw new Error(`serverApiStrict: no data for "${endpoint}"`);
  }
  return data;
}
