import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

vi.mock('@/hooks/useWorkspace', () => ({
  useRemoveMember: vi.fn(),
  useUpdateMemberRole: vi.fn(),
  useInviteMember: vi.fn(),
}))

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))

import { WorkspaceMembersTab } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceMembersTab'
import { useRemoveMember, useUpdateMemberRole } from '@/hooks/useWorkspace'

describe('WorkspaceMembersTab', () => {
  const members = [
    {
      id: 'm1',
      role: 'OWNER' as const,
      user: { id: 'u1', name: 'Alice Owner', email: 'alice@test.com', image: 'https://img.test/a.jpg' },
    },
    {
      id: 'm2',
      role: 'ADMIN' as const,
      user: { id: 'u2', name: 'Bob Admin', email: 'bob@test.com' },
    },
    {
      id: 'm3',
      role: 'MEMBER' as const,
      user: { id: 'u3', name: null as any, email: 'charlie@test.com' },
    },
    {
      id: 'm4',
      role: 'GUEST' as const,
      user: { id: 'u4', name: 'Dave Guest', email: 'dave@test.com' },
    },
  ]

  const defaultProps = {
    workspaceId: 'ws-1',
    members,
    isAdmin: true,
    isOwner: false,
    onInviteClick: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()
    ;(useRemoveMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
    ;(useUpdateMemberRole as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
    window.confirm = vi.fn(() => true)
  })

  it('renders all members', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('Alice Owner')).toBeInTheDocument()
    expect(screen.getByText('Bob Admin')).toBeInTheDocument()
    expect(screen.getByText('Dave Guest')).toBeInTheDocument()
  })

  it('displays member count', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('Team Members (4)')).toBeInTheDocument()
  })

  it('shows invite button when isAdmin', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('Invite Member')).toBeInTheDocument()
  })

  it('shows invite button when isOwner', () => {
    render(<WorkspaceMembersTab {...defaultProps} isAdmin={false} isOwner={true} />)
    expect(screen.getByText('Invite Member')).toBeInTheDocument()
  })

  it('hides invite button when neither admin nor owner', () => {
    render(<WorkspaceMembersTab {...defaultProps} isAdmin={false} isOwner={false} />)
    expect(screen.queryByText('Invite Member')).not.toBeInTheDocument()
  })

  it('calls onInviteClick when invite button clicked', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    fireEvent.click(screen.getByText('Invite Member'))
    expect(defaultProps.onInviteClick).toHaveBeenCalled()
  })

  it('shows user image when available', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const img = screen.getAllByRole('img')
    expect(img.length).toBeGreaterThan(0)
  })

  it('shows initials fallback when no image', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('B')).toBeInTheDocument() // Bob's initial
  })

  it('shows "U" when name is null and no image', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    // Member m3 has null name
    const initials = screen.getAllByText('U')
    expect(initials.length).toBeGreaterThan(0)
  })

  it('shows "Anonymous" when name is null', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('Anonymous')).toBeInTheDocument()
  })

  it('shows Crown icon for OWNER role', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const nameEl = screen.getByText('Alice Owner')
    const p = nameEl.closest('p')!
    const svgs = p.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('shows role select for non-owner members when admin', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBe(3) // Bob, null-name member, Dave
  })

  it('shows role badge for non-admin owners', () => {
    render(<WorkspaceMembersTab {...defaultProps} isAdmin={false} isOwner={false} />)
    expect(screen.getByText('Owner')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Member')).toBeInTheDocument()
    expect(screen.getByText('Guest')).toBeInTheDocument()
  })

  it('calls handleUpdateRole when select changes', () => {
    const mockMutate = vi.fn()
    ;(useUpdateMemberRole as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'MEMBER' } })
    expect(mockMutate).toHaveBeenCalledWith({
      workspaceId: 'ws-1',
      memberId: 'm2',
      role: 'MEMBER',
    })
  })

  it('calls confirm and handleRemoveMember when remove clicked', () => {
    const mockRemove = vi.fn()
    ;(useRemoveMember as any).mockReturnValue({ mutateAsync: mockRemove, isPending: false })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    fireEvent.click(removeButtons[0])
    expect(window.confirm).toHaveBeenCalledWith('Remove this member?')
    expect(mockRemove).toHaveBeenCalledWith({ workspaceId: 'ws-1', memberId: 'm2' })
  })

  it('does not call removeMember when confirm is cancelled', () => {
    const mockRemove = vi.fn()
    ;(useRemoveMember as any).mockReturnValue({ mutateAsync: mockRemove, isPending: false })
    ;(window.confirm as any).mockReturnValue(false)
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    fireEvent.click(removeButtons[0])
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('shows remove buttons for non-owner members when admin', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    expect(removeButtons.length).toBe(3) // Bob, null-name, Dave
  })

  it('hides remove buttons for OWNER', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const ownerRow = screen.getByText('Alice Owner').closest('div[class*="p-"]')!
    expect(ownerRow.querySelector('[aria-label="Remove member"]')).not.toBeInTheDocument()
  })

  it('disables select when updateMemberRole is pending', () => {
    ;(useUpdateMemberRole as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: true })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    selects.forEach(select => {
      expect(select).toBeDisabled()
    })
  })

  it('disables remove button when removeMember is pending', () => {
    ;(useRemoveMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: true })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    removeButtons.forEach(btn => {
      expect(btn).toBeDisabled()
    })
  })

  it('renders emails for all members', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
    expect(screen.getByText('charlie@test.com')).toBeInTheDocument()
    expect(screen.getByText('dave@test.com')).toBeInTheDocument()
  })

  it('handles error in removeMember gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockRemove = vi.fn().mockRejectedValue(new Error('fail'))
    ;(useRemoveMember as any).mockReturnValue({ mutateAsync: mockRemove, isPending: false })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    await fireEvent.click(removeButtons[0])
    // Should not throw
    expect(mockRemove).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('handles error in updateRole gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockUpdate = vi.fn().mockRejectedValue(new Error('fail'))
    ;(useUpdateMemberRole as any).mockReturnValue({ mutateAsync: mockUpdate, isPending: false })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    await fireEvent.change(selects[0], { target: { value: 'GUEST' } })
    expect(mockUpdate).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
