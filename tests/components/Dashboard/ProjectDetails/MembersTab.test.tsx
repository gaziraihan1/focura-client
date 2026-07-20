import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MembersTab from '@/components/Dashboard/ProjectDetails/MembersTab';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    UserPlus: icon('user-plus'),
    Users: icon('users'),
    Crown: icon('crown'),
    Eye: icon('eye'),
    X: icon('x'),
  };
});

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock('@/hooks/useProjects', () => ({
  useUpdateProjectMemberRole: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useRemoveProjectMember: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspaceMembers: vi.fn(() => ({ data: [] })),
}));

vi.mock('@/components/Dashboard/ProjectDetails/AddMemberModal', () => ({
  default: () => <div data-testid="add-member-modal" />,
}));

function makeProject(overrides: Record<string, unknown> = {}) {
  return {
    id: 'p-1',
    isAdmin: true,
    workspace: { id: 'ws-1' },
    members: [
      {
        id: 'pm-1',
        userId: 'user-1',
        role: 'MANAGER' as const,
        user: { id: 'user-1', name: 'Alice', email: 'alice@test.com', image: undefined },
      },
    ],
    ...overrides,
  };
}

describe('MembersTab (ProjectDetails)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders member name', () => {
    render(<MembersTab project={makeProject()} showAddMember={false} setShowAddMember={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders team members heading with count', () => {
    render(<MembersTab project={makeProject()} showAddMember={false} setShowAddMember={vi.fn()} />);
    expect(screen.getByText(/Team Members/)).toBeInTheDocument();
  });

  it('shows Add Member button when isAdmin', () => {
    render(<MembersTab project={makeProject()} showAddMember={false} setShowAddMember={vi.fn()} />);
    expect(screen.getByText('Add Member')).toBeInTheDocument();
  });

  it('hides Add Member button when not admin', () => {
    render(<MembersTab project={makeProject({ isAdmin: false })} showAddMember={false} setShowAddMember={vi.fn()} />);
    expect(screen.queryByText('Add Member')).not.toBeInTheDocument();
  });
});
