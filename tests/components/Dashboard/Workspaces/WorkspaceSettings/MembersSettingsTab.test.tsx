import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name, image, size }: Record<string, unknown>) => (
    <div data-testid="avatar" data-name={name} data-image={image} data-size={size}>
      {name}
    </div>
  ),
}))

import { MembersSettingsTab } from '@/components/Dashboard/Workspaces/WorkspaceSettings/MembersSettingsTab'

describe('MembersSettingsTab', () => {
  const members = [
    {
      id: 'm1',
      role: 'OWNER',
      user: { id: 'u1', name: 'Alice Owner', email: 'alice@test.com', image: 'https://img.test/a.jpg' },
    },
    {
      id: 'm2',
      role: 'ADMIN',
      user: { id: 'u2', name: 'Bob Admin', email: 'bob@test.com' },
    },
    {
      id: 'm3',
      role: 'MEMBER',
      user: { id: 'u3', name: 'Charlie Member', email: 'charlie@test.com' },
    },
    {
      id: 'm4',
      role: 'GUEST',
      user: { id: 'u4', name: '', email: 'guest@test.com' },
    },
  ]

  const defaultProps = {
    members,
    isAdmin: true,
    isRemovingMember: false,
    onInviteClick: vi.fn(),
    onRemoveMember: vi.fn(),
    onUpdateRole: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all members', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    expect(screen.getAllByText('Alice Owner').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Bob Admin').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Charlie Member').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('guest@test.com')).toBeInTheDocument()
  })

  it('displays correct member count in header', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    expect(screen.getByText('Team Members (4)')).toBeInTheDocument()
  })

  it('shows invite button when isAdmin is true', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    expect(screen.getByText('Invite Member')).toBeInTheDocument()
  })

  it('hides invite button when isAdmin is false', () => {
    render(<MembersSettingsTab {...defaultProps} isAdmin={false} />)
    expect(screen.queryByText('Invite Member')).not.toBeInTheDocument()
  })

  it('calls onInviteClick when invite button is clicked', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    fireEvent.click(screen.getByText('Invite Member'))
    expect(defaultProps.onInviteClick).toHaveBeenCalledTimes(1)
  })

  it('shows Crown icon for OWNER role', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const svgs = document.querySelectorAll('svg')
    const crownIcons = Array.from(svgs).filter(svg => svg.classList.contains('lucide-crown'))
    expect(crownIcons.length).toBeGreaterThan(0)
  })

  it('shows role select for non-OWNER members when admin', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    // Bob, Charlie, Guest should have selects (3 non-owner members)
    expect(selects.length).toBe(3)
  })

  it('does not show role select for OWNER', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    // The OWNER row should show a span with the role, not a select
    // There should be 3 selects (for Bob, Charlie, Guest) - not 4
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBe(3)
  })

  it('calls onUpdateRole when role select changes', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'MEMBER' } })
    expect(defaultProps.onUpdateRole).toHaveBeenCalledWith('m2', 'MEMBER')
  })

  it('shows remove button for non-OWNER members when admin', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const removeButtons = screen.getAllByRole('button').filter(
      btn => btn.className.includes('text-red-500')
    )
    // There should be remove buttons for Bob, Charlie, Guest
    expect(removeButtons.length).toBe(3)
  })

  it('does not show remove button for OWNER', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const allBtns = document.querySelectorAll('button')
    // All buttons with text-red-500 are remove buttons, should be 3 (non-owner members only)
    const redButtons = Array.from(allBtns).filter(btn => btn.className.includes('text-red-500'))
    expect(redButtons.length).toBe(3)
  })

  it('calls onRemoveMember when remove button is clicked', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const removeButtons = screen.getAllByRole('button').filter(
      btn => btn.querySelector('svg') && btn.className.includes('text-red-500')
    )
    fireEvent.click(removeButtons[0])
    expect(defaultProps.onRemoveMember).toHaveBeenCalledWith('m2')
  })

  it('disables remove buttons when isRemovingMember is true', () => {
    render(<MembersSettingsTab {...defaultProps} isRemovingMember={true} />)
    const removeButtons = screen.getAllByRole('button').filter(
      btn => btn.querySelector('svg') && btn.className.includes('text-red-500')
    )
    removeButtons.forEach(btn => {
      expect(btn).toBeDisabled()
    })
  })

  it('does not show role select for non-admin viewers', () => {
    render(<MembersSettingsTab {...defaultProps} isAdmin={false} />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('shows role as span for non-admin viewers', () => {
    render(<MembersSettingsTab {...defaultProps} isAdmin={false} />)
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('MEMBER')).toBeInTheDocument()
    expect(screen.getByText('GUEST')).toBeInTheDocument()
    // OWNER is also shown
    expect(screen.getByText('OWNER')).toBeInTheDocument()
  })

  it('renders empty member list', () => {
    render(<MembersSettingsTab {...defaultProps} members={[]} />)
    expect(screen.getByText('Team Members (0)')).toBeInTheDocument()
  })

  it('renders avatars for members', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const avatars = screen.getAllByTestId('avatar')
    expect(avatars.length).toBe(4)
  })

  it('displays member emails', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
    expect(screen.getByText('charlie@test.com')).toBeInTheDocument()
  })

  it('select has correct option values', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const select = screen.getAllByRole('combobox')[0]
    const options = select.querySelectorAll('option')
    expect(options.length).toBe(3)
    expect(options[0].textContent).toBe('Admin')
    expect(options[1].textContent).toBe('Member')
    expect(options[2].textContent).toBe('Guest')
  })
})
