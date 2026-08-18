import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarToggle } from '@/components/Dashboard/SidebarToggle';

describe('SidebarToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a toggle button', () => {
    render(<SidebarToggle collapsed={false} onToggle={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('labels itself "Collapse sidebar" when expanded and exposes aria-expanded', () => {
    render(<SidebarToggle collapsed={false} onToggle={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('labels itself "Expand sidebar" when collapsed and exposes aria-expanded', () => {
    render(<SidebarToggle collapsed={true} onToggle={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Expand sidebar' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<SidebarToggle collapsed={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('merges the provided className into the button', () => {
    render(
      <SidebarToggle
        collapsed={false}
        onToggle={vi.fn()}
        className="hidden lg:inline-flex"
      />,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hidden', 'lg:inline-flex');
  });
});
