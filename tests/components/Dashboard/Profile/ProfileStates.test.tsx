import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { ProfileLoadingState } from '@/components/Dashboard/Profile/ProfileLoadingState'
import { ProfilePageHeader } from '@/components/Dashboard/Profile/ProfilePageHeader'

describe('ProfileLoadingState', () => {
  it('renders loader/spinner', () => {
    render(<ProfileLoadingState />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })
})

describe('ProfilePageHeader', () => {
  const defaultProps = {
    isEditing: false,
    isSaving: false,
    onEdit: vi.fn(),
    onCancel: vi.fn(),
    onSave: vi.fn(),
  }

  it('renders "Profile" heading', () => {
    render(<ProfilePageHeader {...defaultProps} />)
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('shows Edit Profile button when not editing', () => {
    render(<ProfilePageHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument()
  })

  it('shows Cancel and Save buttons when editing', () => {
    render(<ProfilePageHeader {...defaultProps} isEditing={true} />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  it('calls onEdit when Edit Profile clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<ProfilePageHeader {...defaultProps} onEdit={onEdit} />)
    await user.click(screen.getByRole('button', { name: /edit profile/i }))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Cancel clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ProfilePageHeader {...defaultProps} isEditing={true} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('hides Edit Profile button when editing', () => {
    render(<ProfilePageHeader {...defaultProps} isEditing={true} />)
    expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument()
  })
})
