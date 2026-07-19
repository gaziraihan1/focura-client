import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnnouncementDetail } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementDetail/AnnouncementDetail';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />;
  return {
    ArrowLeft: icon('arrow-left'),
    Pin: icon('pin'),
    Globe: icon('globe'),
    Lock: icon('lock'),
    FolderOpen: icon('folder-open'),
    Clock: icon('clock'),
    User: icon('user'),
  };
});

vi.mock('@/lib/utils', () => ({ cn: (...c: any[]) => c.filter(Boolean).join(' ') }));
vi.mock('@/hooks/useAnnouncement', () => ({
  useAnnouncement: vi.fn(() => ({
    data: null,
    isLoading: false,
    isError: false,
  })),
}));
vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementDetail/AnnouncementDetailsSkeleton', () => ({
  AnnouncementDetailSkeleton: () => <div data-testid="skeleton" />,
}));
vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementDetail/AnnouncementAuthor', () => ({
  AnnouncementAuthor: () => <div data-testid="announcement-author" />,
}));
vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementDetail/AnnouncementTargets', () => ({
  AnnouncementTargets: () => <div data-testid="announcement-targets" />,
}));

describe('AnnouncementDetail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows error state when announcement not found', () => {
    render(<AnnouncementDetail id="a-1" workspaceSlug="ws" />);
    expect(screen.getByText('Announcement not found')).toBeInTheDocument();
  });

  it('shows the help text', () => {
    render(<AnnouncementDetail id="a-1" workspaceSlug="ws" />);
    expect(screen.getByText(/may have been deleted/)).toBeInTheDocument();
  });
});
