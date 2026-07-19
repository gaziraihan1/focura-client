import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PermissionModal } from '@/components/Shared/PermissionModal'

describe('PermissionModal', () => {
  const defaultProps = {
    operation: 'create' as const,
    isOpen: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when not open', () => {
    const { container } = render(
      <PermissionModal {...defaultProps} isOpen={false} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders Permission Required heading', () => {
    render(<PermissionModal {...defaultProps} />)
    expect(screen.getByText('Permission Required')).toBeInTheDocument()
  })

  it('shows correct verb for create operation', () => {
    render(<PermissionModal {...defaultProps} operation="create" />)
    expect(screen.getAllByText('create').length).toBeGreaterThanOrEqual(1)
  })

  it('shows correct verb for update operation', () => {
    render(<PermissionModal {...defaultProps} operation="update" />)
    expect(screen.getAllByText('update').length).toBeGreaterThanOrEqual(1)
  })

  it('shows correct verb for delete operation', () => {
    render(<PermissionModal {...defaultProps} operation="delete" />)
    expect(screen.getAllByText('delete').length).toBeGreaterThanOrEqual(1)
  })

  it('shows correct verb for manage operation', () => {
    render(<PermissionModal {...defaultProps} operation="manage" />)
    expect(screen.getAllByText('manage').length).toBeGreaterThanOrEqual(1)
  })

  it('shows custom resource name', () => {
    render(<PermissionModal {...defaultProps} resource="label" />)
    expect(screen.getAllByText(/label/).length).toBeGreaterThanOrEqual(1)
  })

  it('closes on Got it button click', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<PermissionModal {...defaultProps} onClose={onClose} />)
    
    await user.click(screen.getByText('Got it'))
    expect(onClose).toHaveBeenCalled()
  })

  it('closes on Escape key', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<PermissionModal {...defaultProps} onClose={onClose} />)
    
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('closes on close button click', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<PermissionModal {...defaultProps} onClose={onClose} />)
    
    await user.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows Who can verb this section', () => {
    render(<PermissionModal {...defaultProps} operation="create" />)
    expect(screen.getByText(/Who can create this\?/)).toBeInTheDocument()
  })

  it('shows role pills', () => {
    render(<PermissionModal {...defaultProps} />)
    expect(screen.getByText('Workspace Owner')).toBeInTheDocument()
    expect(screen.getByText('Workspace Admin')).toBeInTheDocument()
  })
})
