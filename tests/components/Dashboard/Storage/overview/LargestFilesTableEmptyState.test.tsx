import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  File: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="file-icon" {...props} />,
}));

import { EmptyState } from '@/components/shared/EmptyState';
import { File } from 'lucide-react';

describe('EmptyState', () => {
  it('renders the shared empty state', () => {
    render(<EmptyState icon={File} title="No files found" description="" />);
    expect(screen.getByTestId('file-icon')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<EmptyState icon={File} title="No files found" description="" />);
    expect(screen.getByText('No files found')).toBeInTheDocument();
  });

  it('displays an empty description', () => {
    render(<EmptyState icon={File} title="No files found" description="" />);
    const description = screen.getByText('No files found').closest('div')?.querySelector('p');
    expect(description?.textContent).toBe('');
  });
});
