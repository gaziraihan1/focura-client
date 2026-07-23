import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  File: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="file-icon" {...props} />,
}));

vi.mock('@/components/Shared/EmptyState', () => ({
  EmptyState: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="shared-empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

import { EmptyState } from '@/components/Dashboard/Storage/LargestFilesTable/EmptyState';

describe('EmptyState', () => {
  it('renders the shared empty state', () => {
    render(<EmptyState />);
    expect(screen.getByTestId('shared-empty-state')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<EmptyState />);
    expect(screen.getByText('No files found')).toBeInTheDocument();
  });

  it('displays an empty description', () => {
    render(<EmptyState />);
    const description = screen.getByTestId('shared-empty-state').querySelector('p');
    expect(description?.textContent).toBe('');
  });
});
