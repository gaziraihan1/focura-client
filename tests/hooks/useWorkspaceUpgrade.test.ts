import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useWorkspaceUpgrade, useWorkspaceBilling } from '@/hooks/useWorkspaceUpgrade'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const mockSubscription = {
  workspaceId: 'ws-1',
  planName: 'FREE',
  status: 'ACTIVE',
  billingCycle: 'MONTHLY',
  currentPeriodEnd: '2025-08-01T00:00:00.000Z',
  cancelAtPeriodEnd: false,
  trialEnd: null,
  stripeSubscriptionId: 'stripe-sub-1',
}

describe('useWorkspaceUpgrade', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with FREE plan', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:id/billing/subscription`, () => {
        return HttpResponse.json({ data: mockSubscription })
      })
    )

    const { result } = renderHook(
      () => useWorkspaceUpgrade('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isPending).toBe(false))

    expect(result.current.currentPlan).toBe('FREE')
    expect(result.current.hasActiveSub).toBe(false)
    expect(result.current.cycle).toBe('monthly')
  })

  it('sets billing cycle', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:id/billing/subscription`, () => {
        return HttpResponse.json({ data: mockSubscription })
      })
    )

    const { result } = renderHook(
      () => useWorkspaceUpgrade('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isPending).toBe(false))

    act(() => result.current.setCycle('yearly'))
    expect(result.current.cycle).toBe('yearly')
  })

  it('detects active subscription', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:id/billing/subscription`, () => {
        return HttpResponse.json({ data: { ...mockSubscription, planName: 'PRO' } })
      })
    )

    const { result } = renderHook(
      () => useWorkspaceUpgrade('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isPending).toBe(false))

    expect(result.current.currentPlan).toBe('PRO')
    expect(result.current.hasActiveSub).toBe(true)
  })
})

describe('useWorkspaceBilling', () => {
  it('fetches subscription and invoices', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:id/billing/subscription`, () => {
        return HttpResponse.json({ data: mockSubscription })
      }),
      http.get(`${BASE}/api/v1/workspaces/:id/billing/invoices`, () => {
        return HttpResponse.json({
          data: [
            {
              id: 'inv-1',
              amount: 1999,
              currency: 'usd',
              status: 'paid',
              invoiceNumber: 'INV-0001',
              periodStart: '2025-06-01T00:00:00.000Z',
              periodEnd: '2025-07-01T00:00:00.000Z',
            },
          ],
        })
      })
    )

    const { result } = renderHook(
      () => useWorkspaceBilling('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.subLoading).toBe(false))

    expect(result.current.sub?.planName).toBe('FREE')
    expect(result.current.invoices).toHaveLength(1)
  })

  it('exposes handler functions', () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:id/billing/subscription`, () => {
        return HttpResponse.json({ data: mockSubscription })
      }),
      http.get(`${BASE}/api/v1/workspaces/:id/billing/invoices`, () => {
        return HttpResponse.json({ data: [] })
      })
    )

    const { result } = renderHook(
      () => useWorkspaceBilling('ws-1'),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.handleOpenPortal).toBe('function')
    expect(typeof result.current.handleCancelSubscription).toBe('function')
    expect(typeof result.current.handleReactivateSubscription).toBe('function')
  })
})
