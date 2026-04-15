// tests/setup.ts
import '@testing-library/jest-dom'
import { vi, beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mock/server'

// ── Shared base URL (mirrors your real axios config) ───────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

const makeFetch = (url: string, init?: RequestInit) =>
  fetch(`${BASE_URL}${url}`, init).then(r => r.json())

// ── Mock lib/axios ─────────────────────────────────────────────────────────────
vi.mock('lib/axios', () => {
  const jsonHeaders = { 'Content-Type': 'application/json' }

  const axiosInstance = {
    get:    (url: string)              => makeFetch(url, { method: 'GET' }),
    post:   (url: string, data?: any)  => makeFetch(url, { method: 'POST',   body: JSON.stringify(data) }),
    put:    (url: string, data?: any)  => makeFetch(url, { method: 'PUT',    body: JSON.stringify(data) }),
    delete: (url: string)              => makeFetch(url, { method: 'DELETE' }),
  }

  const api = {
    get:    (endpoint: string)             => makeFetch(endpoint),
    post:   (endpoint: string, data?: any) => makeFetch(endpoint, { method: 'POST',   body: JSON.stringify(data), headers: jsonHeaders }),
    put:    (endpoint: string, data?: any) => makeFetch(endpoint, { method: 'PUT',    body: JSON.stringify(data), headers: jsonHeaders }),
    delete: (endpoint: string)             => makeFetch(endpoint, { method: 'DELETE', headers: jsonHeaders }),
  }

  return { api, axiosInstance, default: axiosInstance }
})

// ── Mock next-auth ─────────────────────────────────────────────────────────────
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' } },
    status: 'authenticated',
  }),
  getSession: () => Promise.resolve({ backendToken: 'test-token' }),
  signOut: vi.fn(),
  SessionProvider: ({ children }: any) => children,
}))

// ── Mock next/navigation ───────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  useRouter:   () => ({ push: vi.fn(), replace: vi.fn() }),
  useParams:   () => ({ workspaceSlug: 'test-ws' }),
  usePathname: () => '/dashboard',
}))

// ── Mock react-hot-toast ───────────────────────────────────────────────────────
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())