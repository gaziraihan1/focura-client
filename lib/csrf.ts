import { getSession } from 'next-auth/react';

let cachedCsrfToken: string | null = null;
let csrfTokenExpiry = 0;

const CSRF_TOKEN_CACHE_DURATION = 55 * 60 * 1000; // 55 minutes (token valid for 1 hour)

/**
 * Fetch CSRF token from backend
 */
async function fetchCsrfToken(backendToken?: string): Promise<string | null> {
  try {
    const token = backendToken || (await getSession())?.backendToken;
    if (!token) {
      console.warn('No backend token available for CSRF token fetch');
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/csrf-token`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch CSRF token:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data?.csrfToken || null;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
}

/**
 * Get CSRF token with caching
 * @param forceRefresh - bypass cache and fetch fresh token
 * @param backendToken - explicit backend token to use (avoids stale session issues)
 */
export async function getCsrfToken(forceRefresh = false, backendToken?: string): Promise<string | null> {
  const now = Date.now();

  // If an explicit token is provided, always fetch fresh (different backend token = different CSRF)
  if (backendToken) {
    const token = await fetchCsrfToken(backendToken);
    if (token) {
      cachedCsrfToken = token;
      csrfTokenExpiry = now + CSRF_TOKEN_CACHE_DURATION;
    }
    return token;
  }

  if (!forceRefresh && cachedCsrfToken && now < csrfTokenExpiry) {
    return cachedCsrfToken;
  }

  const token = await fetchCsrfToken();

  if (token) {
    cachedCsrfToken = token;
    csrfTokenExpiry = now + CSRF_TOKEN_CACHE_DURATION;
  }

  return token;
}

/**
 * Invalidate cached CSRF token
 */
export function invalidateCsrfToken(): void {
  cachedCsrfToken = null;
  csrfTokenExpiry = 0;
}