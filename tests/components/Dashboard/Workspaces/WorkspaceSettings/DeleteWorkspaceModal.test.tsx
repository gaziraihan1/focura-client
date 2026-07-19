import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { DeleteWorkspaceModal } from '@/components/Dashboard/Workspaces/WorkspaceSettings/DeleteWorkspaceModal'

describe('DeleteWorkspaceModal', () => {
  const defaultProps = {
    isOpen: true,
    workspaceName: 'My Workspace',
    isDeleting: false,
    onDelete: vi.fn(),
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<DeleteWorkspaceModal {...defaultProps} isOpen={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders modal content when isOpen is true', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    expect(screen.getByText('Delete Workspace?')).toBeInTheDocument()
  })

  it('displays workspace name in warning text', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    expect(screen.getByText('My Workspace')).toBeInTheDocument()
  })

  it('displays delete warning text', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    expect(screen.getByText(/permanently delete/)).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    fireEvent.click(deleteBtn)
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    // The backdrop is two levels up from the h3: h3 -> flex div -> card div -> backdrop div
    const backdrop = screen.getByText('Delete Workspace?').closest('div')!.parentElement!.parentElement!
    fireEvent.click(backdrop)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('does not call onClose when modal content is clicked', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    // The inner card div has stopPropagation
    const cardDiv = screen.getByText('Delete Workspace?').closest('div')!.parentElement!
    fireEvent.click(cardDiv)
    // The inner div has stopPropagation, so onClose should not be called
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('shows Loader2 spinner when isDeleting is true', () => {
    render(<DeleteWorkspaceModal {...defaultProps} isDeleting={true} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    const svg = deleteBtn.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg!.getAttribute('class')).toContain('animate-spin')
  })

  it('disables delete button when isDeleting is true', () => {
    render(<DeleteWorkspaceModal {...defaultProps} isDeleting={true} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    expect(deleteBtn).toBeDisabled()
  })

  it('delete button is not disabled when isDeleting is false', () => {
    render(<DeleteWorkspaceModal {...defaultProps} isDeleting={false} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    expect(deleteBtn).not.toBeDisabled()
  })

  it('renders AlertCircle icon in the header', () => {
    const { container } = render(<DeleteWorkspaceModal {...defaultProps} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('delete button has red background', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    expect(deleteBtn.className).toContain('bg-red-500')
  })
})
