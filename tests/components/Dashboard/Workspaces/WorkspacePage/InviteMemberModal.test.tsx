import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name, image, size }: any) => (
    <div data-testid="avatar" data-name={name} data-image={image} data-size={size}>
      {name}
    </div>
  ),
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

import { InviteMemberModal } from '@/components/Dashboard/Workspaces/WorkspacePage/InviteMemberModal'
import { useInviteMember } from '@/hooks/useWorkspace'

describe('InviteMemberModal', () => {
  const defaultProps = {
    workspaceId: 'ws-1',
    isOpen: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<InviteMemberModal {...defaultProps} isOpen={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders modal when isOpen is true', () => {
    render(<InviteMemberModal {...defaultProps} />)
    expect(screen.getByText('Invite Team Member')).toBeInTheDocument()
  })

  it('renders email input', () => {
    render(<InviteMemberModal {...defaultProps} />)
    expect(screen.getByPlaceholderText('colleague@example.com')).toBeInTheDocument()
  })

  it('renders role select', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    const options = select.querySelectorAll('option')
    expect(options.length).toBe(3)
    expect(options[0].textContent).toBe('Member')
    expect(options[1].textContent).toBe('Admin')
    expect(options[2].textContent).toBe('Guest')
  })

  it('defaults role to MEMBER', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('MEMBER')
  })

  it('updates email state on input change', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    expect((input as HTMLInputElement).value).toBe('test@test.com')
  })

  it('updates role state on select change', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'ADMIN' } })
    expect((select as HTMLSelectElement).value).toBe('ADMIN')
  })

  it('disables invite button when email is empty', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).toBeDisabled()
  })

  it('enables invite button when email is entered', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).not.toBeDisabled()
  })

  it('calls inviteMember.mutateAsync on invite click', async () => {
    const mockMutate = vi.fn().mockResolvedValue({})
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    fireEvent.click(screen.getByText('Send Invitation'))
    expect(mockMutate).toHaveBeenCalledWith({
      workspaceId: 'ws-1',
      email: 'test@test.com',
      role: 'MEMBER',
    })
  })

  it('calls onClose after successful invite', async () => {
    const mockMutate = vi.fn().mockResolvedValue({})
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    fireEvent.click(screen.getByText('Send Invitation'))
    // onClose should be called after mutateAsync resolves
    await vi.waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('calls onClose when cancel is clicked', () => {
    render(<InviteMemberModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const backdrop = screen.getByText('Invite Team Member').closest('div')!.parentElement!
    fireEvent.click(backdrop)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('does not call onClose when modal content clicked', () => {
    render(<InviteMemberModal {...defaultProps} />)
    // The inner div (closest to h3) has stopPropagation
    const innerContent = screen.getByText('Invite Team Member').closest('div')!
    fireEvent.click(innerContent)
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('disables invite button when isPending', () => {
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: true })
    render(<InviteMemberModal {...defaultProps} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).toBeDisabled()
  })

  it('shows loading spinner when isPending', () => {
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: true })
    render(<InviteMemberModal {...defaultProps} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    const svg = inviteBtn.querySelector('svg')
    expect(svg!.getAttribute('class')).toContain('animate-spin')
  })

  it('does not call mutateAsync when email is empty', async () => {
    const mockMutate = vi.fn()
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Send Invitation'))
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('handles invite error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockMutate = vi.fn().mockRejectedValue(new Error('fail'))
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    fireEvent.click(screen.getByText('Send Invitation'))
    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Invite error:', expect.any(Error))
    })
    consoleSpy.mockRestore()
  })

  it('shows Mail icon when not pending', () => {
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    const svg = inviteBtn.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has correct form structure', () => {
    render(<InviteMemberModal {...defaultProps} />)
    expect(screen.getByText('Email Address')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
  })
})
