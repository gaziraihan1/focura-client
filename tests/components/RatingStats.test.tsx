import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RatingStats } from '@/components/rating/RatingStats';
import { mockRatingsResponse } from '../mock/handlers/rating.handlers';

const { stats } = mockRatingsResponse;

describe('RatingStats', () => {
  it('renders average stars value', () => {
    render(<RatingStats stats={stats} />);
    expect(screen.getByText('4.5')).toBeDefined();
  });

  it('renders total reviews count', () => {
    render(<RatingStats stats={stats} />);
    expect(screen.getByText('2 reviews')).toBeDefined();
  });

  it('renders singular form for one review', () => {
    const singleStats = { ...stats, totalRatings: 1 };
    render(<RatingStats stats={singleStats} />);
    expect(screen.getByText('1 review')).toBeDefined();
  });

  it('renders star distribution bars', () => {
    render(<RatingStats stats={stats} />);
    // Check star labels — use getAllByText where numbers may appear multiple times
    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
  });

  it('renders correct count for each star level', () => {
    render(<RatingStats stats={stats} />);
    // Star labels (5,4,3,2,1) + count values are present
    const allNumbers = screen.getAllByText(/^\d+$/);
    expect(allNumbers.length).toBeGreaterThanOrEqual(5);
  });

  it('renders with zero ratings', () => {
    const zeroStats = {
      averageStars: 0,
      totalRatings: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
    render(<RatingStats stats={zeroStats} />);
    expect(screen.getByText('0.0')).toBeDefined();
    expect(screen.getByText('0 reviews')).toBeDefined();
  });
});
