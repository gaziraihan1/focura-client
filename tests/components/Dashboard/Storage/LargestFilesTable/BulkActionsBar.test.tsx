import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    Trash2: icon('trash-icon'),
    Loader2: icon('loader-icon'),
    AlertCircle: icon('alert-circle-icon'),
  };
});

vi.mock('@/hooks/useStoragePage', () => ({
  formatStorageSize: (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(2)} MB`;
  },
}));

import { BulkActionsBar } from '@/components/Dashboard/Storage/LargestFilesTable/BulkActionsBar';

describe('BulkActionsBar', () => {
  const defaultProps = {
    selectedCount: 3,
    selectedFilesSize: 150,
    deletableCount: 3,
    isAdmin: true,
    isDeleting: false,
    onClearSelection: vi.fn(),
    onBulkDelete: vi.fn(),
  };

  it('renders nothing when selectedCount is 0', () => {
    const { container } = render(
      <BulkActionsBar {...defaultProps} selectedCount={0} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows the selected count', () => {
    render(<BulkActionsBar {...defaultProps} />);
    expect(screen.getByText('3 file(s) selected')).toBeInTheDocument();
  });

  it('shows the formatted file size', () => {
    render(<BulkActionsBar {...defaultProps} />);
    expect(screen.getByText('150.00 MB')).toBeInTheDocument();
  });

  it('shows GB format for large sizes', () => {
    render(<BulkActionsBar {...defaultProps} selectedFilesSize={2048} />);
    expect(screen.getByText('2.00 GB')).toBeInTheDocument();
  });

  it('calls onClearSelection when Clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClearSelection = vi.fn();
    render(<BulkActionsBar {...defaultProps} onClearSelection={onClearSelection} />);
    await user.click(screen.getByText('Clear'));
    expect(onClearSelection).toHaveBeenCalledOnce();
  });

  it('calls onBulkDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onBulkDelete = vi.fn();
    render(<BulkActionsBar {...defaultProps} onBulkDelete={onBulkDelete} />);
    await user.click(screen.getByText('Delete Selected'));
    expect(onBulkDelete).toHaveBeenCalledOnce();
  });

  it('shows "Delete My Files" for non-admin users', () => {
    render(<BulkActionsBar {...defaultProps} isAdmin={false} />);
    expect(screen.getByText('Delete My Files')).toBeInTheDocument();
  });

  it('shows "Delete Selected" for admin users', () => {
    render(<BulkActionsBar {...defaultProps} isAdmin={true} />);
    expect(screen.getByText('Delete Selected')).toBeInTheDocument();
  });

  it('disables delete button when isDeleting is true', () => {
    render(<BulkActionsBar {...defaultProps} isDeleting={true} />);
    expect(screen.getByText('Delete Selected')).toBeDisabled();
  });

  it('disables delete button when deletableCount is 0', () => {
    render(<BulkActionsBar {...defaultProps} deletableCount={0} />);
    expect(screen.getByText('Delete Selected')).toBeDisabled();
  });

  it('shows loader icon when isDeleting is true', () => {
    render(<BulkActionsBar {...defaultProps} isDeleting={true} />);
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('shows trash icon when not deleting', () => {
    render(<BulkActionsBar {...defaultProps} isDeleting={false} />);
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('shows warning for non-admin when deletableCount < selectedCount', () => {
    render(
      <BulkActionsBar
        {...defaultProps}
        isAdmin={false}
        deletableCount={1}
        selectedCount={3}
      />
    );
    expect(screen.getByText(/Only 1 file\(s\) can be deleted/)).toBeInTheDocument();
  });

  it('does not show warning for admin even when deletableCount < selectedCount', () => {
    render(
      <BulkActionsBar
        {...defaultProps}
        isAdmin={true}
        deletableCount={1}
        selectedCount={3}
      />
    );
    expect(screen.queryByText(/Only/)).not.toBeInTheDocument();
  });

  it('renders alert circle icon when warning is shown', () => {
    render(
      <BulkActionsBar
        {...defaultProps}
        isAdmin={false}
        deletableCount={0}
        selectedCount={3}
      />
    );
    expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
  });
});
