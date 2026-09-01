import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StarRating } from '@/components/rating/StarRating';

describe('StarRating', () => {
  it('renders with correct aria-label', () => {
    render(<StarRating rating={3} />);
    const group = screen.getByRole('img');
    expect(group).toHaveAttribute('aria-label', '3 out of 5 stars');
  });

  it('renders 5 stars by default', () => {
    render(<StarRating rating={0} />);
    const stars = screen.getAllByRole('button', { hidden: true });
    expect(stars).toHaveLength(5);
  });

  it('renders custom maxStars', () => {
    render(<StarRating rating={0} maxStars={3} />);
    const stars = screen.getAllByRole('button', { hidden: true });
    expect(stars).toHaveLength(3);
  });

  it('calls onChange when interactive and clicked', () => {
    const onChange = vi.fn();
    render(<StarRating rating={0} interactive onChange={onChange} />);
    const stars = screen.getAllByRole('button');
    stars[2].click();
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does not call onChange when not interactive', () => {
    const onChange = vi.fn();
    render(<StarRating rating={0} interactive={false} onChange={onChange} />);
    const stars = screen.getAllByRole('button', { hidden: true });
    stars[0].click();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<StarRating rating={0} interactive disabled onChange={onChange} />);
    const stars = screen.getAllByRole('button', { hidden: true });
    stars[0].click();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies sm size class', () => {
    const { container } = render(<StarRating rating={3} size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('h-4')).toBe(true);
    expect(svg?.classList.contains('w-4')).toBe(true);
  });

  it('applies lg size class', () => {
    const { container } = render(<StarRating rating={3} size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('h-6')).toBe(true);
    expect(svg?.classList.contains('w-6')).toBe(true);
  });
});
