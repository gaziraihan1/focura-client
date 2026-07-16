import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ClearActivitiesDialog } from '@/components/Dashboard/ActivityLogs/ClearActivitiesDialog'

describe('ClearActivitiesDialog', () => {
  const onClose = vi.fn()
  const onConfirm = vi.fn()

  beforeEach(() => vi.clearAllMocks())

  it('returns null when not open', () => {
    const { container } = render(
      <ClearActivitiesDialog isOpen={false} isPending={false} onClose={onClose} onConfirm={onConfirm} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders dialog when open', () => {
    render(
      <ClearActivitiesDialog isOpen={true} isPending={false} onClose={onClose} onConfirm={onConfirm} />
    )
    expect(screen.getByText('Clear all activities?')).toBeInTheDocument()
    expect(screen.getByText(/permanently delete all activity logs/)).toBeInTheDocument()
  })

  it('renders cancel and confirm buttons', () => {
    render(
      <ClearActivitiesDialog isOpen={true} isPending={false} onClose={onClose} onConfirm={onConfirm} />
    )
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Clear Activities')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', () => {
    render(
      <ClearActivitiesDialog isOpen={true} isPending={false} onClose={onClose} onConfirm={onConfirm} />
    )
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onConfirm when confirm is clicked', () => {
    render(
      <ClearActivitiesDialog isOpen={true} isPending={false} onClose={onClose} onConfirm={onConfirm} />
    )
    fireEvent.click(screen.getByText('Clear Activities'))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('shows clearing text when pending', () => {
    render(
      <ClearActivitiesDialog isOpen={true} isPending={true} onClose={onClose} onConfirm={onConfirm} />
    )
    expect(screen.getByText('Clearing...')).toBeInTheDocument()
  })

  it('disables confirm button when pending', () => {
    render(
      <ClearActivitiesDialog isOpen={true} isPending={true} onClose={onClose} onConfirm={onConfirm} />
    )
    expect(screen.getByText('Clearing...').closest('button')).toBeDisabled()
  })
})
