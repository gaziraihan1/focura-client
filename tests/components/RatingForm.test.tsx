import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RatingForm } from '@/components/rating/RatingForm';
import { createWrapper } from '../utils/renderWithProviders';

describe('RatingForm', () => {
  it('shows write a review button when no existing rating', () => {
    render(<RatingForm existingRating={null} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Write a Review')).toBeDefined();
  });

  it('shows unauthenticated prompt text when no existing rating', () => {
    render(<RatingForm existingRating={null} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText(/haven.*rated/)).toBeDefined();
  });

  it('shows existing rating in view mode', () => {
    const existingRating = {
      id: 'rating-1',
      userId: 'user-1',
      stars: 4,
      comment: 'Good tool!',
      edited: false,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
      user: { id: 'user-1', name: 'Test User', image: null },
    };
    render(<RatingForm existingRating={existingRating} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Your Review')).toBeDefined();
    expect(screen.getByText('Good tool!')).toBeDefined();
    expect(screen.getByText('Edit')).toBeDefined();
    expect(screen.getByText('Delete')).toBeDefined();
  });
});
