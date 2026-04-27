// tests/setup.ts
import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mock/server';

// ─────────────────────────────────────────────────────────────
// axios mock
// ─────────────────────────────────────────────────────────────
vi.mock('@/lib/axios', () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
  const jsonHeaders = { 'Content-Type': 'application/json' };

  async function makeFetch<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, init);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  const axiosInstance = {
    get: <T>(url: string) =>
      makeFetch<T>(url, { method: 'GET' }).then((data) => ({ data })),

    post: <T>(url: string, data?: unknown) =>
      makeFetch<T>(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: jsonHeaders,
      }).then((data) => ({ data })),

    put: <T>(url: string, data?: unknown) =>
      makeFetch<T>(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: jsonHeaders,
      }).then((data) => ({ data })),

    patch: <T>(url: string, data?: unknown) =>
      makeFetch<T>(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: jsonHeaders,
      }).then((data) => ({ data })),

    delete: <T>(url: string) =>
      makeFetch<T>(url, {
        method: 'DELETE',
        headers: jsonHeaders,
      }).then((data) => ({ data })),
  };

  const api = {
    get:    <T>(endpoint: string)                  => axiosInstance.get<T>(endpoint).then(r => r.data),
    post:   <T>(endpoint: string, data?: unknown)  => axiosInstance.post<T>(endpoint, data).then(r => r.data),
    put:    <T>(endpoint: string, data?: unknown)  => axiosInstance.put<T>(endpoint, data).then(r => r.data),
    patch:  <T>(endpoint: string, data?: unknown)  => axiosInstance.patch<T>(endpoint, data).then(r => r.data),
    delete: <T>(endpoint: string)                  => axiosInstance.delete<T>(endpoint).then(r => r.data),
  };

  return { api, axiosInstance, default: axiosInstance };
});

// ─────────────────────────────────────────────────────────────
// next-auth mock
// ─────────────────────────────────────────────────────────────
vi.mock('next-auth/react', () => {
  type Session = {
    user: { id: string; name: string; email: string };
    backendToken: string;
  };

  return {
    useSession: () => ({
      data: {
        user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
        backendToken: 'test-token',
      } satisfies Session,
      status: 'authenticated',
    }),

    getSession: (): Promise<Session> =>
      Promise.resolve({
        user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
        backendToken: 'test-token',
      }),

    signOut: vi.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// ─────────────────────────────────────────────────────────────
// next/navigation mock
// ─────────────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  usePathname: () => '/dashboard',
}));

// ─────────────────────────────────────────────────────────────
// toast mock
// ─────────────────────────────────────────────────────────────
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

// ─────────────────────────────────────────────────────────────
// MSW lifecycle
// ─────────────────────────────────────────────────────────────
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());