import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RatingCard } from '@/components/rating/RatingCard';
import { mockRating } from '../mock/handlers/rating.handlers';

describe('RatingCard', () => {
  it('renders rating user name', () => {
    render(<RatingCard rating={mockRating} />);
    expect(screen.getByText('Test User')).toBeDefined();
  });

  it('renders star rating', () => {
    render(<RatingCard rating={mockRating} />);
    const stars = screen.getAllByRole('img');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('renders comment text', () => {
    render(<RatingCard rating={mockRating} />);
    expect(screen.getByText('Great application! Very helpful for productivity.')).toBeDefined();
  });

  it('renders formatted date', () => {
    render(<RatingCard rating={mockRating} />);
    expect(screen.getByText(/Jan 15, 2024/)).toBeDefined();
  });

  it('shows "You" badge when isOwn is true', () => {
    render(<RatingCard rating={mockRating} isOwn />);
    expect(screen.getByText('You')).toBeDefined();
  });

  it('does not show "You" badge when isOwn is false', () => {
    render(<RatingCard rating={mockRating} isOwn={false} />);
    expect(screen.queryByText('You')).toBeNull();
  });

  it('shows "(edited)" when rating is edited', () => {
    const editedRating = { ...mockRating, edited: true };
    render(<RatingCard rating={editedRating} />);
    expect(screen.getByText('(edited)')).toBeDefined();
  });

  it('does not show comment when comment is null', () => {
    const noCommentRating = { ...mockRating, comment: null };
    render(<RatingCard rating={noCommentRating} />);
    expect(screen.queryByText('Great application!')).toBeNull();
  });

  it('renders initials when no image', () => {
    render(<RatingCard rating={mockRating} />);
    expect(screen.getByText('TU')).toBeDefined();
  });
});
