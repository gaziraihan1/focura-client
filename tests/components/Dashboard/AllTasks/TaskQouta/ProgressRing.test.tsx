import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressRing } from '@/components/Dashboard/AllTasks/TaskQouta/ProgressRing';

describe('ProgressRing', () => {
  it('renders SVG with two circles', () => {
    const { container } = render(<ProgressRing used={5} limit={10} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('applies destructive stroke when usage >= 90%', () => {
    const { container } = render(<ProgressRing used={9} limit={10} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle?.getAttribute('class')).toContain('stroke-destructive');
  });

  it('applies primary stroke when usage < 70%', () => {
    const { container } = render(<ProgressRing used={3} limit={10} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle?.getAttribute('class')).toContain('stroke-primary');
  });

  it('uses chart-2 stroke when unlimited', () => {
    const { container } = render(<ProgressRing used={0} limit={null} isUnlimited />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle?.getAttribute('class')).toContain('stroke-chart-2');
  });
});
