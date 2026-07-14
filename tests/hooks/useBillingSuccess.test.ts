import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams('plan=PRO&from=FREE'),
}))

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

import { useBillingSuccess } from '@/hooks/useBillingSuccess'

const STORAGE_KEY = 'focura:upgrade-plan'

describe('useBillingSuccess', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('returns PRO plan details from search params', async () => {
    const { result } = renderHook(
      () => useBillingSuccess('ws-1', 'Test Workspace', 'test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.visible).toBe(true))

    expect(result.current.planName).toBe('PRO')
    expect(result.current.prevPlan).toBe('FREE')
    expect(result.current.meta.label).toBeDefined()
    expect(result.current.gainedFeatures).toBeDefined()
    expect(result.current.subscriptionDetails.length).toBeGreaterThanOrEqual(5)
    expect(result.current.billingCycle).toBe('Monthly')
  })

  it('falls back to subscription data when no search params or storage', async () => {
    const { result } = renderHook(
      () => useBillingSuccess('ws-1', 'Test Workspace', 'test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.visible).toBe(true))
    expect(result.current.planName).toBe('PRO')
  })

  it('clears sessionStorage after reading', () => {
    sessionStorage.setItem(STORAGE_KEY, 'PRO')

    renderHook(
      () => useBillingSuccess('ws-1', 'Test Workspace', 'test-ws'),
      { wrapper: createWrapper() }
    )

    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('includes trial info when subscription is trialing', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:workspaceId/billing/subscription`, () =>
        HttpResponse.json({
          data: {
            workspaceId: 'ws-1',
            planName: 'PRO',
            status: 'TRIALING',
            billingCycle: 'MONTHLY',
            currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
            cancelAtPeriodEnd: false,
            trialEnd: new Date(Date.now() + 14 * 86400000).toISOString(),
            stripeSubscriptionId: 'stripe-sub-1',
          },
        })
      )
    )

    const { result } = renderHook(
      () => useBillingSuccess('ws-1', 'Test Workspace', 'test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.visible).toBe(true))

    expect(result.current.isTrialing).toBe(true)
    expect(result.current.trialDays).toBeGreaterThan(0)
  })
})
