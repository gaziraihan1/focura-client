// tests/mock/handlers/rating.handlers.ts
import { http, HttpResponse } from 'msw';
import type { Rating, RatingsResponse } from '@/types/rating.types';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const mockRatingUser = {
  id: 'user-1',
  name: 'Test User',
  image: null,
};

export const mockRating: Rating = {
  id: 'rating-1',
  userId: 'user-1',
  stars: 5,
  comment: 'Great application! Very helpful for productivity.',
  edited: false,
  createdAt: '2024-01-15T10:00:00.000Z',
  updatedAt: '2024-01-15T10:00:00.000Z',
  user: mockRatingUser,
};

export const mockRating2: Rating = {
  id: 'rating-2',
  userId: 'user-2',
  stars: 4,
  comment: 'Solid tool, works well for my team.',
  edited: false,
  createdAt: '2024-01-20T14:30:00.000Z',
  updatedAt: '2024-01-20T14:30:00.000Z',
  user: { id: 'user-2', name: 'Jane Doe', image: null },
};

export const mockRatingsResponse: RatingsResponse = {
  ratings: [mockRating, mockRating2],
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
  stats: {
    averageStars: 4.5,
    totalRatings: 2,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 },
  },
};

const ok = (data: unknown) => HttpResponse.json({ success: true, data });

export const ratingHandlers = [
  // List ratings (public)
  http.get(`${BASE}/api/v1/ratings`, () => {
    return HttpResponse.json({
      success: true,
      data: mockRatingsResponse.ratings,
      pagination: mockRatingsResponse.pagination,
      stats: mockRatingsResponse.stats,
    });
  }),

  // Get user's own rating
  http.get(`${BASE}/api/v1/ratings/mine`, () => {
    return ok(mockRating);
  }),

  // Create rating
  http.post(`${BASE}/api/v1/ratings`, async ({ request }) => {
    const body = (await request.json()) as { stars: number; comment?: string };
    const newRating: Rating = {
      id: 'rating-new',
      userId: 'user-1',
      stars: body.stars,
      comment: body.comment ?? null,
      edited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: mockRatingUser,
    };
    return ok(newRating);
  }),

  // Update rating
  http.put(`${BASE}/api/v1/ratings/:id`, async ({ request, params }) => {
    const body = (await request.json()) as { stars?: number; comment?: string };
    const updated: Rating = {
      ...mockRating,
      id: params.id as string,
      ...(body.stars !== undefined && { stars: body.stars }),
      ...(body.comment !== undefined && { comment: body.comment }),
      edited: true,
      updatedAt: new Date().toISOString(),
    };
    return ok(updated);
  }),

  // Delete rating
  http.delete(`${BASE}/api/v1/ratings/:id`, () => {
    return ok(null);
  }),
];
