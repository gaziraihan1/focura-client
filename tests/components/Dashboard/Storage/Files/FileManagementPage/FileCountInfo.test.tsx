import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    RefreshCw: icon('refresh-cw'),
  };
});

import { FileCountInfo } from '@/components/Dashboard/Storage/Files/FileManagementPage/FileCountInfo';

describe('FileCountInfo', () => {
  const defaultProps = {
    filesCount: 5,
    totalCount: 20,
    isAdmin: false,
    onRefresh: vi.fn(),
  };

  it('renders the file count info', () => {
    render(<FileCountInfo {...defaultProps} />);
    expect(screen.getByText('Showing 5 of 20 files')).toBeInTheDocument();
  });

  it('shows Admin View badge when isAdmin is true', () => {
    render(<FileCountInfo {...defaultProps} isAdmin={true} />);
    expect(screen.getByText('Admin View')).toBeInTheDocument();
  });

  it('does not show Admin View badge when isAdmin is false', () => {
    render(<FileCountInfo {...defaultProps} isAdmin={false} />);
    expect(screen.queryByText('Admin View')).not.toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<FileCountInfo {...defaultProps} onRefresh={onRefresh} />);
    await user.click(screen.getByTitle('Refresh'));
    expect(onRefresh).toHaveBeenCalledOnce();
  });

  it('renders the refresh icon', () => {
    render(<FileCountInfo {...defaultProps} />);
    expect(screen.getByTestId('refresh-cw')).toBeInTheDocument();
  });

  it('renders with zero files count', () => {
    render(<FileCountInfo {...defaultProps} filesCount={0} />);
    expect(screen.getByText('Showing 0 of 20 files')).toBeInTheDocument();
  });
});
