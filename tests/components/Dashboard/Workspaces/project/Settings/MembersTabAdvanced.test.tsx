import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { MembersTab } from '@/components/Dashboard/Workspaces/project/Settings/MembersTab'
import { createWrapper } from '@/tests/utils/renderWithProviders'

vi.mock('framer-motion', () => ({
  motion: { div: (p: any) => <div {...p} /> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('@/components/Dashboard/ProjectDetails/AddMemberModal', () => ({
  default: () => <div data-testid="add-member-modal">Add Member Modal</div>,
}))
vi.mock('@/components/Dashboard/Workspaces/project/Settings/RoleDropdown', () => ({
  RoleDropdown: ({ role, onChange }: any) => (
    <select data-testid="role-dropdown" value={role} onChange={(e) => onChange(e.target.value)}>
      <option value="VIEWER">Viewer</option>
      <option value="COLLABORATOR">Collaborator</option>
      <option value="MANAGER">Manager</option>
    </select>
  ),
}))
vi.mock('@/components/Dashboard/Workspaces/project/Settings/Avatar', () => ({
  Avatar: ({ name }: any) => <div data-testid="avatar">{name}</div>,
}))
vi.mock('@/hooks/useProjects', () => ({
  useUpdateProjectMemberRole: () => ({ mutateAsync: vi.fn() }),
  useRemoveProjectMember: () => ({ mutateAsync: vi.fn() }),
}))
vi.mock('@/hooks/useTeam', () => ({
  useTeamMembers: () => ({ data: [] }),
}))

const mockProject = {
  id: 'proj-1',
  workspaceId: 'ws-1',
  members: [
    { id: 'm-1', user: { id: 'u-1', name: 'Alice', email: 'alice@test.com', image: null }, role: 'MANAGER' },
    { id: 'm-2', user: { id: 'u-2', name: 'Bob', email: 'bob@test.com', image: null }, role: 'VIEWER' },
  ],
}

describe('MembersTab', () => {
  it('renders member names', () => {
    render(<MembersTab project={mockProject as any} canManage={true} userId="u-1" />, { wrapper: createWrapper() })
    expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Bob').length).toBeGreaterThanOrEqual(1)
  })

  it('renders search input', () => {
    render(<MembersTab project={mockProject as any} canManage={true} userId="u-1" />, { wrapper: createWrapper() })
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('renders add member button when canManage', () => {
    render(<MembersTab project={mockProject as any} canManage={true} userId="u-1" />, { wrapper: createWrapper() })
    expect(screen.getByText(/add member/i)).toBeInTheDocument()
  })

  it('hides add member button when cannot manage', () => {
    render(<MembersTab project={mockProject as any} canManage={false} userId="u-1" />, { wrapper: createWrapper() })
    expect(screen.queryByText(/add member/i)).not.toBeInTheDocument()
  })
})
