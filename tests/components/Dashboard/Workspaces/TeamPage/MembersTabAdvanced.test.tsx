import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { MembersTab } from '@/components/Dashboard/Workspaces/TeamPage/MembersTab'

vi.mock('@/components/Dashboard/Workspaces/TeamPage/MemberRow', () => ({
  MemberRow: ({ member }: any) => <tr><td>{member.displayName}</td><td>{member.role}</td></tr>,
}))
vi.mock('@/components/Dashboard/Workspaces/TeamPage/EmptyState', () => ({
  EmptyState: ({ title }: any) => <div>{title}</div>,
}))
vi.mock('@/components/Dashboard/Workspaces/TeamPage/RoleDropdown', () => ({
  WorkspaceRoleOption: {},
}))

const mockMembers = [
  { id: 'm-1', userId: 'u-1', displayName: 'Alice Owner', role: 'OWNER', user: { email: 'alice@test.com', image: null }, joinedAt: '2024-01-01' },
  { id: 'm-2', userId: 'u-2', displayName: 'Bob Admin', role: 'ADMIN', user: { email: 'bob@test.com', image: null }, joinedAt: '2024-02-01' },
  { id: 'm-3', userId: 'u-3', displayName: 'Charlie Member', role: 'MEMBER', user: { email: 'charlie@test.com', image: null }, joinedAt: '2024-03-01' },
]

describe('MembersTab', () => {
  const defaultProps = {
    members: mockMembers,
    currentUserId: 'u-1',
    canManage: true,
    onRoleChange: vi.fn(),
  }

  it('renders all members', () => {
    render(<MembersTab {...defaultProps} />)
    expect(screen.getByText('Alice Owner')).toBeInTheDocument()
    expect(screen.getByText('Bob Admin')).toBeInTheDocument()
    expect(screen.getByText('Charlie Member')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<MembersTab {...defaultProps} />)
    expect(screen.getByPlaceholderText(/search members/i)).toBeInTheDocument()
  })

  it('renders role filter buttons', () => {
    render(<MembersTab {...defaultProps} />)
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /owners/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /admins/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /members/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /guests/i })).toBeInTheDocument()
  })

  it('filters by role when clicking filter button', async () => {
    const user = userEvent.setup()
    render(<MembersTab {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: /owners/i }))
    expect(screen.getByText('Alice Owner')).toBeInTheDocument()
    expect(screen.queryByText('Bob Admin')).not.toBeInTheDocument()
  })

  it('shows member count', () => {
    const { container } = render(<MembersTab {...defaultProps} />)
    const footer = container.querySelector('.border-t')
    expect(footer).toBeInTheDocument()
    expect(footer?.textContent).toContain('3')
  })
})
