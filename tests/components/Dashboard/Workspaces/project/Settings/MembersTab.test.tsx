import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MembersTab } from '@/components/Dashboard/Workspaces/project/Settings/MembersTab';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    Loader2: icon('loader2'),
    Users: icon('users'),
    Search: icon('search'),
    UserPlus: icon('user-plus'),
    Crown: icon('crown'),
    UserCheck: icon('user-check'),
    User: icon('user'),
  };
});

vi.mock('@/hooks/useProjects', () => ({
  useUpdateProjectMemberRole: vi.fn(() => ({ mutateAsync: vi.fn() })),
  useRemoveProjectMember: vi.fn(() => ({ mutateAsync: vi.fn() })),
}));

vi.mock('@/hooks/useTeam', () => ({
  useTeamMembers: vi.fn(() => ({ data: [] })),
}));

vi.mock('@/components/Dashboard/ProjectDetails/AddMemberModal', () => ({
  default: () => <div data-testid="add-member-modal" />,
}));

vi.mock('@/components/Dashboard/Workspaces/project/Settings/RoleDropdown', () => ({
  RoleDropdown: () => <div data-testid="role-dropdown" />,
}));

vi.mock('@/components/Dashboard/Workspaces/project/Settings/Avatar', () => ({
  Avatar: ({ name, ...props }: Record<string, unknown>) => <div data-testid="avatar" data-name={name} />,
}));

vi.mock('@/components/Dashboard/Workspaces/project/Settings/RoleBadge', () => ({
  RoleBadge: ({ role }: { role: string }) => <span data-testid="role-badge">{role}</span>,
}));

function makeProject(overrides: Record<string, unknown> = {}) {
  return {
    id: 'p-1',
    workspaceId: 'ws-1',
    members: [
      {
        userId: 'user-1',
        role: 'MANAGER',
        user: { id: 'user-1', name: 'Alice', email: 'alice@test.com', image: null },
      },
    ],
    ...overrides,
  };
}

describe('MembersTab (project Settings)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders member name', () => {
    render(<MembersTab project={makeProject()} canManage={true} userId="user-1" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<MembersTab project={makeProject()} canManage={true} userId="user-1" />);
    expect(screen.getByPlaceholderText('Search members…')).toBeInTheDocument();
  });

  it('shows total member count', () => {
    render(<MembersTab project={makeProject()} canManage={true} userId="user-1" />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('shows Add Member button when canManage', () => {
    render(<MembersTab project={makeProject()} canManage={true} userId="user-1" />);
    expect(screen.getByText('Add Member')).toBeInTheDocument();
  });
});
