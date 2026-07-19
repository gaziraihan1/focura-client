import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { WorkspaceInviteMemberModal } from '@/components/Dashboard/Workspaces/WorkspaceSettings/WorkspaceInviteMemberModal'

describe('WorkspaceInviteMemberModal', () => {
  const defaultProps = {
    isOpen: true,
    email: '',
    role: 'MEMBER' as const,
    isInviting: false,
    onEmailChange: vi.fn(),
    onRoleChange: vi.fn(),
    onInvite: vi.fn(),
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<WorkspaceInviteMemberModal {...defaultProps} isOpen={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders modal when isOpen is true', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    expect(screen.getByText('Invite Team Member')).toBeInTheDocument()
  })

  it('displays email input', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    expect(input).toBeInTheDocument()
    expect(input.getAttribute('type')).toBe('email')
  })

  it('calls onEmailChange when email input changes', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    expect(defaultProps.onEmailChange).toHaveBeenCalledWith('test@test.com')
  })

  it('displays role select with correct options', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    const options = select.querySelectorAll('option')
    expect(options.length).toBe(3)
    expect(options[0].textContent).toBe('Member')
    expect(options[1].textContent).toBe('Admin')
    expect(options[2].textContent).toBe('Guest')
  })

  it('calls onRoleChange when role select changes', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'ADMIN' } })
    expect(defaultProps.onRoleChange).toHaveBeenCalledWith('ADMIN')
  })

  it('calls onInvite when invite button is clicked', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="test@test.com" />)
    fireEvent.click(screen.getByText('Send Invitation'))
    expect(defaultProps.onInvite).toHaveBeenCalledTimes(1)
  })

  it('disables invite button when email is empty', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="" />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).toBeDisabled()
  })

  it('enables invite button when email is provided', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="test@test.com" />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).not.toBeDisabled()
  })

  it('disables invite button when isInviting is true', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="test@test.com" isInviting={true} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).toBeDisabled()
  })

  it('shows Loader2 spinner when isInviting is true', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} isInviting={true} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    const svg = inviteBtn.querySelector('svg')
    expect(svg!.getAttribute('class')).toContain('animate-spin')
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const modalRoot = screen.getByText('Invite Team Member').closest('div')!.parentElement!
    fireEvent.click(modalRoot)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('does not call onClose when modal content is clicked', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const innerContent = screen.getByText('Invite Team Member').closest('div')!
    fireEvent.click(innerContent)
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('sets email input value from props', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="existing@test.com" />)
    const input = screen.getByPlaceholderText('colleague@example.com') as HTMLInputElement
    expect(input.value).toBe('existing@test.com')
  })

  it('sets role select value from props', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} role="ADMIN" />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('ADMIN')
  })

  it('shows Mail icon when not inviting', () => {
    const { container } = render(<WorkspaceInviteMemberModal {...defaultProps} email="test@test.com" />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    const svg = inviteBtn.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg!.getAttribute('class')).not.toContain('animate-spin')
  })
})
