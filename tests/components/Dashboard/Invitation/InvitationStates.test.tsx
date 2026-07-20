import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { InvitationLoadingState } from '@/components/Dashboard/Invitation/InvitationLoadingState'
import { InvitationErrorState } from '@/components/Dashboard/Invitation/InvitationErrorState'
import { InvitationSuccessState } from '@/components/Dashboard/Invitation/InvitationSuccessState'
import { InvitationExpiredState } from '@/components/Dashboard/Invitation/InvitationExpiredState'

describe('InvitationLoadingState', () => {
  it('renders "Loading invitation..." text', () => {
    render(<InvitationLoadingState />)
    expect(screen.getByText('Loading invitation...')).toBeInTheDocument()
  })
})

describe('InvitationErrorState', () => {
  it('renders "Invalid Invitation" heading', () => {
    render(<InvitationErrorState error={null} onGoToDashboard={vi.fn()} />)
    expect(screen.getByText('Invalid Invitation')).toBeInTheDocument()
  })

  it('shows default error message when error is null', () => {
    render(<InvitationErrorState error={null} onGoToDashboard={vi.fn()} />)
    expect(screen.getByText(/invitation link is invalid/)).toBeInTheDocument()
  })

  it('shows custom error message when provided', () => {
    render(<InvitationErrorState error="Custom error" onGoToDashboard={vi.fn()} />)
    expect(screen.getByText('Custom error')).toBeInTheDocument()
  })

  it('calls onGoToDashboard when button clicked', async () => {
    const user = userEvent.setup()
    const onGoToDashboard = vi.fn()
    render(<InvitationErrorState error={null} onGoToDashboard={onGoToDashboard} />)
    await user.click(screen.getByRole('button', { name: /go to dashboard/i }))
    expect(onGoToDashboard).toHaveBeenCalledTimes(1)
  })
})

describe('InvitationSuccessState', () => {
  it('renders welcome message with workspace name', () => {
    render(<InvitationSuccessState workspaceName="Acme Team" />)
    expect(screen.getByText('Welcome to Acme Team!')).toBeInTheDocument()
  })

  it('shows successfully joined text', () => {
    render(<InvitationSuccessState workspaceName="Acme Team" />)
    expect(screen.getByText(/successfully joined the workspace/)).toBeInTheDocument()
  })
})

describe('InvitationExpiredState', () => {
  it('renders "Invitation Expired" heading', () => {
    render(<InvitationExpiredState workspaceName="Acme Team" onGoToDashboard={vi.fn()} />)
    expect(screen.getByText('Invitation Expired')).toBeInTheDocument()
  })

  it('shows workspace name', () => {
    render(<InvitationExpiredState workspaceName="Acme Team" onGoToDashboard={vi.fn()} />)
    expect(screen.getByText('Acme Team')).toBeInTheDocument()
  })

  it('calls onGoToDashboard when button clicked', async () => {
    const user = userEvent.setup()
    const onGoToDashboard = vi.fn()
    render(<InvitationExpiredState workspaceName="Acme" onGoToDashboard={onGoToDashboard} />)
    await user.click(screen.getByRole('button', { name: /go to dashboard/i }))
    expect(onGoToDashboard).toHaveBeenCalledTimes(1)
  })
})
