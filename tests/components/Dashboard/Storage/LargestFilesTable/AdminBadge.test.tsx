import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    Shield: icon('shield-icon'),
  };
});

import { AdminBadge } from '@/components/Dashboard/Storage/LargestFilesTable/AdminBadge';

describe('AdminBadge', () => {
  it('renders the admin badge', () => {
    render(<AdminBadge />);
    expect(screen.getByText(/Admin Mode/)).toBeInTheDocument();
  });

  it('renders the admin mode description', () => {
    render(<AdminBadge />);
    expect(screen.getByText(/You can delete any file in this workspace/)).toBeInTheDocument();
  });

  it('renders the shield icon', () => {
    render(<AdminBadge />);
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
  });
});
