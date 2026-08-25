import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('lucide-react', () => {
  const Star = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid='star-icon' {...props} />;
  Star.displayName = 'Star';
  return { Star };
});

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}));

import TemplateRatingStars from '@/components/public/templates/TemplateRatingStars';

describe('TemplateRatingStars', () => {
  it('shows the average and rating count', () => {
    render(<TemplateRatingStars average={4.8} count={160} />);
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(160)')).toBeInTheDocument();
  });

  it('shows an em dash when there are no ratings yet', () => {
    render(<TemplateRatingStars average={0} count={0} />);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByText('(0)')).not.toBeInTheDocument();
  });

  it('calls onRate with the chosen star count', () => {
    const onRate = vi.fn();
    render(<TemplateRatingStars average={4.8} count={160} onRate={onRate} />);
    fireEvent.click(screen.getByRole('radio', { name: '3 stars' }));
    expect(onRate).toHaveBeenCalledWith(3);
  });

  it('disables the picker while a rate request is pending', () => {
    const onRate = vi.fn();
    render(<TemplateRatingStars average={4.8} count={160} onRate={onRate} pending />);
    const button = screen.getByRole('radio', { name: '5 stars' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onRate).not.toHaveBeenCalled();
  });
});
