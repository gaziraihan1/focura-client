import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, ...props }: Record<string, unknown>) => (
      <div {...props} animate-width={animate?.width}>{children}</div>
    ),
  },
}));

vi.mock('@/utils/taskcard.utils', () => ({
  getProgressPercentage: (timeRemaining: number) =>
    Math.min(100, timeRemaining > 0 ? 100 - (timeRemaining / 1500) * 100 : 100),
}));

import { TaskProgressBar } from '@/components/Dashboard/AllTasks/FocusTaskCard/TaskProgressBar';

describe('TaskProgressBar', () => {
  it('renders the progress bar container', () => {
    const { container } = render(<TaskProgressBar timeRemaining={750} />);
    const barTrack = container.querySelector('.bg-muted\\/50');
    expect(barTrack).toBeInTheDocument();
  });

  it('sets width based on progress percentage', () => {
    const { container } = render(<TaskProgressBar timeRemaining={750} />);
    const bar = container.querySelector('.bg-linear-to-r');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute('animate-width', '50%');
  });
});
