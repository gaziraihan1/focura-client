// tests/mock/handlers/feature.handlers.ts
import { http, HttpResponse } from 'msw'
import type { FeatureRequest, FeaturesResponse } from '@/types/feature.types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockFeatureUser = {
  id: 'user-1',
  name: 'Test User',
  image: null,
}

export const mockFeature: FeatureRequest = {
  id: 'feature-1',
  title: 'Dark Mode',
  description: 'Add dark mode support to the app',
  status: 'PENDING',
  adminNote: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  createdBy: mockFeatureUser,
  _count: { upvotes: 5, downvotes: 1 },
  userVote: null,
}

export const mockFeature2: FeatureRequest = {
  id: 'feature-2',
  title: 'Export to CSV',
  description: 'Allow exporting task data to CSV',
  status: 'APPROVED',
  adminNote: 'Great idea, will be implemented in Q2',
  createdAt: '2024-01-02T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
  createdBy: mockFeatureUser,
  _count: { upvotes: 12, downvotes: 0 },
  userVote: 'UP',
}

export const mockFeaturesResponse: FeaturesResponse = {
  data: [mockFeature, mockFeature2],
  pagination: {
    page: 1,
    pageSize: 20,
    totalCount: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const featureHandlers = [
  // Admin check
  http.get(`${BASE}/api/features/admin/me`, () =>
    ok({ isAdmin: false })
  ),

  // List features
  http.get(`${BASE}/api/features`, () =>
    // Hook reads res?.data and res?.pagination directly off the response
    HttpResponse.json({
      data: mockFeaturesResponse.data,
      pagination: mockFeaturesResponse.pagination,
    })
  ),

  // Get single feature
  http.get(`${BASE}/api/features/:id`, ({ params }) => {
    if (params.id === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return ok(mockFeature)
  }),

  // Create feature
  http.post(`${BASE}/api/features`, async ({ request }) => {
    const body = await request.json() as Partial<FeatureRequest>
    return ok({
      ...mockFeature,
      ...body,
      id: 'feature-new',
      status: 'PENDING',
      _count: { upvotes: 0, downvotes: 0 },
      userVote: null,
    })
  }),

  // Update status (admin)
  http.patch(`${BASE}/api/features/:id/status`, async ({ request, params }) => {
    const body = await request.json() as { status: string; adminNote?: string }
    return ok({ ...mockFeature, id: params.id as string, ...body })
  }),

  // Delete feature
  http.delete(`${BASE}/api/features/:id`, () => ok(null)),

  // Vote
  http.post(`${BASE}/api/features/:id/vote`, async ({ request, params }) => {
    const body = await request.json() as { type: string }
    const feature = {
      ...mockFeature,
      id: params.id as string,
      userVote: body.type,
      _count: {
        upvotes:   body.type === 'UP'   ? mockFeature._count.upvotes + 1 : mockFeature._count.upvotes,
        downvotes: body.type === 'DOWN' ? mockFeature._count.downvotes + 1 : mockFeature._count.downvotes,
      },
    }
      return HttpResponse.json({ action: 'added', feature })
  }),
]