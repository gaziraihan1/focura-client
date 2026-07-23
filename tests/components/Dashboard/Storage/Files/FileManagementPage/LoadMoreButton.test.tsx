import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    Loader2: icon('loader2'),
  };
});

import { LoadMoreButton } from '@/components/Dashboard/Storage/Files/FileManagementPage/LoadMoreButton';

describe('LoadMoreButton', () => {
  it('renders nothing when hasMore is false', () => {
    const { container } = render(
      <LoadMoreButton hasMore={false} isLoading={false} onLoadMore={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the button when hasMore is true', () => {
    render(<LoadMoreButton hasMore={true} isLoading={false} onLoadMore={vi.fn()} />);
    expect(screen.getByText('Load More Files')).toBeInTheDocument();
  });

  it('calls onLoadMore when button is clicked', async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    render(<LoadMoreButton hasMore={true} isLoading={false} onLoadMore={onLoadMore} />);
    await user.click(screen.getByText('Load More Files'));
    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it('disables button when isLoading is true', () => {
    render(<LoadMoreButton hasMore={true} isLoading={true} onLoadMore={vi.fn()} />);
    expect(screen.getByText('Load More Files')).toBeDisabled();
  });

  it('shows loader icon when isLoading is true', () => {
    render(<LoadMoreButton hasMore={true} isLoading={true} onLoadMore={vi.fn()} />);
    expect(screen.getByTestId('loader2')).toBeInTheDocument();
  });

  it('does not show loader icon when isLoading is false', () => {
    render(<LoadMoreButton hasMore={true} isLoading={false} onLoadMore={vi.fn()} />);
    expect(screen.queryByTestId('loader2')).not.toBeInTheDocument();
  });
});
