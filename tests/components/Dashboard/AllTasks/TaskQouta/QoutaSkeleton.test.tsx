import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { QuotaSkeleton } from '@/components/Dashboard/AllTasks/TaskQouta/QoutaSkeleton';

describe('QuotaSkeleton', () => {
  it('renders a skeleton container', () => {
    const { container } = render(<QuotaSkeleton />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('animate-pulse');
  });

  it('renders muted placeholder elements', () => {
    const { container } = render(<QuotaSkeleton />);
    const mutedElements = container.querySelectorAll('.bg-muted');
    expect(mutedElements.length).toBeGreaterThan(0);
  });
});
