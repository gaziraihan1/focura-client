import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { ClearActivitiesDialog } from '@/components/Dashboard/ActivityLogs/ClearActivitiesDialog'

describe('ClearActivitiesDialog', () => {
  const defaultProps = {
    isOpen: true,
    isPending: false,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  }

  it('renders nothing when isOpen=false', () => {
    const { container } = render(<ClearActivitiesDialog {...defaultProps} isOpen={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('shows dialog when isOpen=true', () => {
    render(<ClearActivitiesDialog {...defaultProps} />)
    expect(screen.getByText('Clear all activities?')).toBeInTheDocument()
  })

  it('shows confirmation text', () => {
    render(<ClearActivitiesDialog {...defaultProps} />)
    expect(screen.getByText(/permanently delete all activity logs/)).toBeInTheDocument()
  })

  it('calls onClose when Cancel clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ClearActivitiesDialog {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when Clear Activities clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<ClearActivitiesDialog {...defaultProps} onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: /clear activities/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('shows "Clearing..." text when isPending=true', () => {
    render(<ClearActivitiesDialog {...defaultProps} isPending={true} />)
    expect(screen.getByText('Clearing...')).toBeInTheDocument()
  })
})
