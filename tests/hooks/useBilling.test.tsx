// tests/hooks/useBilling.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'
import { createWrapper } from '../utils/renderWithProviders'

import {
  useWorkspaceSubscription,
  useWorkspaceInvoices,
  useCreateCheckout,
  useCreatePortal,
  useChangePlan,
  useCancelSubscription,
  useReactivateSubscription,
} from '@/hooks/useBilling'


const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── window.location mock ──────────────────────────────────────────────────────
// jsdom seals window.location as non-configurable. Rather than fighting it,
// we capture redirects by spying on window.location.assign. The hooks use
// `window.location.href = url` which jsdom silently ignores in test env,
// so we verify redirect intent via the returned url value from the mutation.


afterEach(() => {
  vi.restoreAllMocks()
})

// ── useWorkspaceSubscription ──────────────────────────────────────────────────

describe('useWorkspaceSubscription', () => {
  it('fetches subscription for a paid workspace', async () => {
    const { result } = renderHook(
      () => useWorkspaceSubscription('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.workspaceId).toBe('ws-1')
    expect(result.current.data?.planName).toBe('PRO')
    expect(result.current.data?.status).toBe('ACTIVE')
    expect(result.current.data?.billingCycle).toBe('MONTHLY')
    expect(result.current.data?.cancelAtPeriodEnd).toBe(false)
    expect(result.current.data?.trialEnd).toBeNull()
  })

  it('returns null data for a FREE workspace (404)', async () => {
    const { result } = renderHook(
      () => useWorkspaceSubscription('ws-free'),
      { wrapper: createWrapper() }
    )

    // retry: false — goes straight to error state, no retries
    await waitFor(() => expect(result.current.isError).toBe(true))

    // The hook intentionally does not retry on 404 (FREE workspaces have no subscription)
    expect(result.current.data).toBeUndefined()
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useWorkspaceSubscription(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('enters error state when API fails', async () => {
    server.use(
      http.get(`${BASE}/api/workspaces/:workspaceId/billing/subscription`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useWorkspaceSubscription('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useWorkspaceInvoices ──────────────────────────────────────────────────────

describe('useWorkspaceInvoices', () => {
  it('fetches invoices for a workspace', async () => {
    const { result } = renderHook(
      () => useWorkspaceInvoices('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].id).toBe('inv-1')
    expect(result.current.data?.[0].amount).toBe(1999)
    expect(result.current.data?.[0].currency).toBe('usd')
    expect(result.current.data?.[0].status).toBe('paid')
  })

  it('returns invoice with pdf and hosted urls', async () => {
    const { result } = renderHook(
      () => useWorkspaceInvoices('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const inv = result.current.data?.[0]
    expect(inv?.pdfUrl).toBe('https://stripe.com/invoice/inv-1.pdf')
    expect(inv?.hostedUrl).toBe('https://stripe.com/invoice/inv-1')
    expect(inv?.invoiceNumber).toBe('INV-0001')
  })

  it('handles invoices with null pdf and hosted urls', async () => {
    const { result } = renderHook(
      () => useWorkspaceInvoices('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const inv = result.current.data?.[1]
    expect(inv?.pdfUrl).toBeNull()
    expect(inv?.hostedUrl).toBeNull()
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useWorkspaceInvoices(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('enters error state when API fails', async () => {
    server.use(
      http.get(`${BASE}/api/workspaces/:workspaceId/billing/invoices`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useWorkspaceInvoices('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useCreateCheckout ─────────────────────────────────────────────────────────

describe('useCreateCheckout', () => {
  it('creates a checkout session and returns the Stripe URL', async () => {
    const { result } = renderHook(
      () => useCreateCheckout('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ planName: 'PRO', billingCycle: 'MONTHLY' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe('https://checkout.stripe.com/session-123')
  })

  it('works for BUSINESS plan with YEARLY billing', async () => {
    const { result } = renderHook(
      () => useCreateCheckout('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ planName: 'BUSINESS', billingCycle: 'YEARLY' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe('https://checkout.stripe.com/session-123')
  })

  it('enters error state when checkout creation fails', async () => {
    server.use(
      http.post(
        `${BASE}/api/workspaces/:workspaceId/billing/create-checkout-session`,
        () => new HttpResponse(null, { status: 400 })
      )
    )

    const { result } = renderHook(
      () => useCreateCheckout('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ planName: 'PRO', billingCycle: 'MONTHLY' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('returns undefined when API returns no url', async () => {
    server.use(
      http.post(
        `${BASE}/api/workspaces/:workspaceId/billing/create-checkout-session`,
        () => HttpResponse.json({ data: { url: null } })
      )
    )

    const { result } = renderHook(
      () => useCreateCheckout('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ planName: 'PRO', billingCycle: 'MONTHLY' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    // url was null → mutationFn returns null/undefined, no redirect fires
    expect(result.current.data).toBeFalsy()
  })
})

// ── useCreatePortal ───────────────────────────────────────────────────────────

describe('useCreatePortal', () => {
  it('creates a portal session and returns the Stripe URL', async () => {
    const { result } = renderHook(
      () => useCreatePortal('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe('https://billing.stripe.com/portal-123')
  })

  it('enters error state when portal creation fails', async () => {
    server.use(
      http.post(
        `${BASE}/api/workspaces/:workspaceId/billing/create-portal-session`,
        () => new HttpResponse(null, { status: 403 })
      )
    )

    const { result } = renderHook(
      () => useCreatePortal('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('returns undefined when API returns no url', async () => {
    server.use(
      http.post(
        `${BASE}/api/workspaces/:workspaceId/billing/create-portal-session`,
        () => HttpResponse.json({ data: { url: null } })
      )
    )

    const { result } = renderHook(
      () => useCreatePortal('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeFalsy()
  })
})

// ── useChangePlan ─────────────────────────────────────────────────────────────

describe('useChangePlan', () => {
  it('changes plan to BUSINESS YEARLY', async () => {
    const { result } = renderHook(
      () => useChangePlan('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ newPlanName: 'BUSINESS', billingCycle: 'YEARLY' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('downgrades to FREE (cancel at period end)', async () => {
    const { result } = renderHook(
      () => useChangePlan('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ newPlanName: 'FREE' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('applies optimistic update to subscription cache', async () => {
    const wrapper = createWrapper()
    const { result: subResult } = renderHook(
      () => useWorkspaceSubscription('ws-1'),
      { wrapper }
    )

    await waitFor(() => expect(subResult.current.isSuccess).toBe(true))
    expect(subResult.current.data?.planName).toBe('PRO')

    const { result: mutResult } = renderHook(
      () => useChangePlan('ws-1'),
      { wrapper }
    )

    act(() => {
      mutResult.current.mutate({ newPlanName: 'BUSINESS', billingCycle: 'YEARLY' })
    })

    // Optimistic update fires synchronously in onMutate
    await waitFor(() => {
      expect(subResult.current.data?.planName).toBe('BUSINESS')
    })
  })

  it('rolls back optimistic update on error', async () => {
    server.use(
      http.post(
        `${BASE}/api/workspaces/:workspaceId/billing/change-plan`,
        () => new HttpResponse(null, { status: 500 })
      )
    )

    const wrapper = createWrapper()
    const { result: subResult } = renderHook(
      () => useWorkspaceSubscription('ws-1'),
      { wrapper }
    )

    await waitFor(() => expect(subResult.current.isSuccess).toBe(true))
    expect(subResult.current.data?.planName).toBe('PRO')

    const { result: mutResult } = renderHook(
      () => useChangePlan('ws-1'),
      { wrapper }
    )

    await act(async () => {
      mutResult.current.mutate({ newPlanName: 'BUSINESS' })
    })

    await waitFor(() => expect(mutResult.current.isError).toBe(true))

    // Cache should be restored to PRO after rollback
    expect(subResult.current.data?.planName).toBe('PRO')
  })

  it('enters error state when API fails', async () => {
    server.use(
      http.post(
        `${BASE}/api/workspaces/:workspaceId/billing/change-plan`,
        () => new HttpResponse(null, { status: 422 })
      )
    )

    const { result } = renderHook(
      () => useChangePlan('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ newPlanName: 'PRO' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useCancelSubscription ─────────────────────────────────────────────────────

describe('useCancelSubscription', () => {
  it('cancels at period end by default', async () => {
    const { result } = renderHook(
      () => useCancelSubscription('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('cancels immediately when passed immediately: true', async () => {
    const { result } = renderHook(
      () => useCancelSubscription('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ immediately: true, reason: 'Too expensive' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('enters error state when cancellation fails', async () => {
    server.use(
      http.post(
        `${BASE}/api/workspaces/:workspaceId/billing/cancel-subscription`,
        () => new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useCancelSubscription('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useReactivateSubscription ─────────────────────────────────────────────────

describe('useReactivateSubscription', () => {
  it('reactivates a subscription set to cancel at period end', async () => {
    const { result } = renderHook(
      () => useReactivateSubscription('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('enters error state when reactivation fails', async () => {
    server.use(
      http.post(
        `${BASE}/api/workspaces/:workspaceId/billing/reactivate-subscription`,
        () => new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useReactivateSubscription('ws-1'),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})