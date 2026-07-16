import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InvitationLoadingState } from '@/components/Dashboard/Invitation/InvitationLoadingState'
import { InvitationSuccessState } from '@/components/Dashboard/Invitation/InvitationSuccessState'
import { InvitationErrorState } from '@/components/Dashboard/Invitation/InvitationErrorState'
import { InvitationExpiredState } from '@/components/Dashboard/Invitation/InvitationExpiredState'
import { InvitationAlreadyUsedState } from '@/components/Dashboard/Invitation/InvitationAlreadyUsedState'

vi.mock('lucide-react', () => ({
  Loader2: (props: any) => <svg data-testid="loader-icon" {...props} />,
  Check: (props: any) => <svg data-testid="check-icon" {...props} />,
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
  Clock: (props: any) => <svg data-testid="clock-icon" {...props} />,
}))

describe('InvitationLoadingState', () => {
  it('renders loading spinner', () => {
    render(<InvitationLoadingState />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('renders loading text', () => {
    render(<InvitationLoadingState />)
    expect(screen.getByText('Loading invitation...')).toBeInTheDocument()
  })
})

describe('InvitationSuccessState', () => {
  it('renders welcome message with workspace name', () => {
    render(<InvitationSuccessState workspaceName="Acme Corp" />)
    expect(screen.getByText('Welcome to Acme Corp!')).toBeInTheDocument()
  })

  it('renders success description', () => {
    render(<InvitationSuccessState workspaceName="Acme Corp" />)
    expect(screen.getByText(/successfully joined/)).toBeInTheDocument()
  })

  it('renders redirecting text', () => {
    render(<InvitationSuccessState workspaceName="Acme Corp" />)
    expect(screen.getByText(/Redirecting/)).toBeInTheDocument()
  })
})

describe('InvitationErrorState', () => {
  const defaultProps = {
    error: 'Token is invalid',
    onGoToDashboard: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders error heading', () => {
    render(<InvitationErrorState {...defaultProps} />)
    expect(screen.getByText('Invalid Invitation')).toBeInTheDocument()
  })

  it('renders custom error message', () => {
    render(<InvitationErrorState {...defaultProps} />)
    expect(screen.getByText('Token is invalid')).toBeInTheDocument()
  })

  it('renders default error when error is null', () => {
    render(<InvitationErrorState error={null} onGoToDashboard={vi.fn()} />)
    expect(screen.getByText(/invitation link is invalid/)).toBeInTheDocument()
  })

  it('renders Go to Dashboard button', () => {
    render(<InvitationErrorState {...defaultProps} />)
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument()
  })

  it('calls onGoToDashboard when button is clicked', () => {
    render(<InvitationErrorState {...defaultProps} />)
    fireEvent.click(screen.getByText('Go to Dashboard'))
    expect(defaultProps.onGoToDashboard).toHaveBeenCalled()
  })
})

describe('InvitationExpiredState', () => {
  const defaultProps = {
    workspaceName: 'Acme Corp',
    onGoToDashboard: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders expired heading', () => {
    render(<InvitationExpiredState {...defaultProps} />)
    expect(screen.getByText('Invitation Expired')).toBeInTheDocument()
  })

  it('renders workspace name', () => {
    render(<InvitationExpiredState {...defaultProps} />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('renders contact administrator message', () => {
    render(<InvitationExpiredState {...defaultProps} />)
    expect(screen.getByText(/contact the workspace administrator/)).toBeInTheDocument()
  })

  it('renders Go to Dashboard button', () => {
    render(<InvitationExpiredState {...defaultProps} />)
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument()
  })

  it('calls onGoToDashboard when button is clicked', () => {
    render(<InvitationExpiredState {...defaultProps} />)
    fireEvent.click(screen.getByText('Go to Dashboard'))
    expect(defaultProps.onGoToDashboard).toHaveBeenCalled()
  })
})

describe('InvitationAlreadyUsedState', () => {
  const defaultProps = {
    status: 'ACCEPTED',
    onGoToWorkspace: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders already accepted heading', () => {
    render(<InvitationAlreadyUsedState {...defaultProps} />)
    expect(screen.getByText('Already Accepted')).toBeInTheDocument()
  })

  it('renders status message', () => {
    render(<InvitationAlreadyUsedState {...defaultProps} />)
    expect(screen.getByText(/already been accepted/)).toBeInTheDocument()
  })

  it('renders Go to Workspace button', () => {
    render(<InvitationAlreadyUsedState {...defaultProps} />)
    expect(screen.getByText('Go to Workspace')).toBeInTheDocument()
  })

  it('calls onGoToWorkspace when button is clicked', () => {
    render(<InvitationAlreadyUsedState {...defaultProps} />)
    fireEvent.click(screen.getByText('Go to Workspace'))
    expect(defaultProps.onGoToWorkspace).toHaveBeenCalled()
  })

  it('renders different status text', () => {
    render(<InvitationAlreadyUsedState status="DECLINED" onGoToWorkspace={vi.fn()} />)
    expect(screen.getByText(/already been declined/)).toBeInTheDocument()
  })
})
