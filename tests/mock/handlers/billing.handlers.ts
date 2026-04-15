// tests/mock/handlers/billing.handlers.ts
import { http, HttpResponse } from 'msw'
import type { WorkspaceSubscription, InvoiceData } from '@/hooks/useBilling'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Fixtures ──────────────────────────────────────────────────────────────────

export const mockSubscription: WorkspaceSubscription = {
  workspaceId:          'ws-1',
  planName:             'PRO',
  status:               'ACTIVE',
  billingCycle:         'MONTHLY',
  currentPeriodEnd:     '2024-07-01T00:00:00.000Z',
  cancelAtPeriodEnd:    false,
  trialEnd:             null,
  stripeSubscriptionId: 'stripe-sub-1',
}

export const mockSubscriptionCancelling: WorkspaceSubscription = {
  ...mockSubscription,
  cancelAtPeriodEnd: true,
}

export const mockInvoice: InvoiceData = {
  id:            'inv-1',
  amount:        1999,
  currency:      'usd',
  status:        'paid',
  pdfUrl:        'https://stripe.com/invoice/inv-1.pdf',
  hostedUrl:     'https://stripe.com/invoice/inv-1',
  invoiceNumber: 'INV-0001',
  periodStart:   '2024-06-01T00:00:00.000Z',
  periodEnd:     '2024-07-01T00:00:00.000Z',
  paidAt:        '2024-06-01T00:00:00.000Z',
  createdAt:     '2024-06-01T00:00:00.000Z',
}

export const mockInvoice2: InvoiceData = {
  id:            'inv-2',
  amount:        1999,
  currency:      'usd',
  status:        'paid',
  pdfUrl:        null,
  hostedUrl:     null,
  invoiceNumber: 'INV-0002',
  periodStart:   '2024-05-01T00:00:00.000Z',
  periodEnd:     '2024-06-01T00:00:00.000Z',
  paidAt:        '2024-05-01T00:00:00.000Z',
  createdAt:     '2024-05-01T00:00:00.000Z',
}

// ── Handlers ──────────────────────────────────────────────────────────────────

export const billingHandlers = [
  // GET /api/workspaces/:id/billing/subscription
  http.get(`${BASE}/api/workspaces/:workspaceId/billing/subscription`, ({ params }) => {
    // Simulate FREE workspace returning 404
    if (params.workspaceId === 'ws-free') {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({ data: mockSubscription })
  }),

  // GET /api/workspaces/:id/billing/invoices
  http.get(`${BASE}/api/workspaces/:workspaceId/billing/invoices`, () =>
    HttpResponse.json({ data: [mockInvoice, mockInvoice2] })
  ),

  // POST /api/workspaces/:id/billing/create-checkout-session
  http.post(`${BASE}/api/workspaces/:workspaceId/billing/create-checkout-session`, () =>
    HttpResponse.json({ data: { url: 'https://checkout.stripe.com/session-123' } })
  ),

  // POST /api/workspaces/:id/billing/create-portal-session
  http.post(`${BASE}/api/workspaces/:workspaceId/billing/create-portal-session`, () =>
    HttpResponse.json({ data: { url: 'https://billing.stripe.com/portal-123' } })
  ),

  // POST /api/workspaces/:id/billing/change-plan
  http.post(`${BASE}/api/workspaces/:workspaceId/billing/change-plan`, async ({ request }) => {
    const body = await request.json() as { newPlanName: string; billingCycle?: string }
    return HttpResponse.json({
      data: { ...mockSubscription, planName: body.newPlanName, billingCycle: body.billingCycle ?? mockSubscription.billingCycle },
    })
  }),

  // POST /api/workspaces/:id/billing/cancel-subscription
  http.post(`${BASE}/api/workspaces/:workspaceId/billing/cancel-subscription`, () =>
    HttpResponse.json({ data: { ...mockSubscription, cancelAtPeriodEnd: true } })
  ),

  // POST /api/workspaces/:id/billing/reactivate-subscription
  http.post(`${BASE}/api/workspaces/:workspaceId/billing/reactivate-subscription`, () =>
    HttpResponse.json({ data: { ...mockSubscription, cancelAtPeriodEnd: false } })
  ),
]