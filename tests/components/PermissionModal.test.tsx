import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PermissionModal } from '@/components/Shared/PermissionModal'

vi.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
  ShieldCheck: (props: any) => <svg data-testid="shield-icon" {...props} />,
  Lock: (props: any) => <svg data-testid="lock-icon" {...props} />,
}))

describe('PermissionModal', () => {
  const onClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when not open', () => {
    const { container } = render(
      <PermissionModal operation="create" isOpen={false} onClose={onClose} />
    )

    expect(container.innerHTML).toBe('')
  })

  it('renders dialog when open', () => {
    render(
      <PermissionModal operation="create" isOpen={true} onClose={onClose} />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(
      <PermissionModal operation="create" isOpen={true} onClose={onClose} />
    )

    expect(screen.getByText('Permission Required')).toBeInTheDocument()
  })

  it('renders operation-specific text', () => {
    render(
      <PermissionModal operation="delete" isOpen={true} onClose={onClose} resource="labels" />
    )

    // Check that the modal contains text about delete operation
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent(/delete/i)
    expect(dialog).toHaveTextContent(/labels/i)
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <PermissionModal operation="create" isOpen={true} onClose={onClose} />
    )

    fireEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Got it button is clicked', () => {
    render(
      <PermissionModal operation="create" isOpen={true} onClose={onClose} />
    )

    fireEvent.click(screen.getByText('Got it'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed', () => {
    render(
      <PermissionModal operation="create" isOpen={true} onClose={onClose} />
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when clicking backdrop', () => {
    render(
      <PermissionModal operation="create" isOpen={true} onClose={onClose} />
    )

    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog)

    expect(onClose).toHaveBeenCalled()
  })

  it('renders role pills', () => {
    render(
      <PermissionModal operation="create" isOpen={true} onClose={onClose} />
    )

    expect(screen.getByText('Workspace Owner')).toBeInTheDocument()
    expect(screen.getByText('Workspace Admin')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <PermissionModal operation="create" isOpen={true} onClose={onClose} className="custom-class" />
    )

    const panel = container.querySelector('.custom-class')
    expect(panel).toBeInTheDocument()
  })
})
