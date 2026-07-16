import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfilePageHeader } from '@/components/Dashboard/Profile/ProfilePageHeader'
import { ProfileLoadingState } from '@/components/Dashboard/Profile/ProfileLoadingState'
import { ProfileStatsCard } from '@/components/Dashboard/Profile/ProfileStatsCard'
import { ProfileStorageCard } from '@/components/Dashboard/Profile/ProfileStorageCard'
import { ProfilePlanCard } from '@/components/Dashboard/Profile/ProfilePlanCard'
import { ProfileSidebar } from '@/components/Dashboard/Profile/ProfileSidebar'

vi.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
  Save: (props: any) => <svg data-testid="save-icon" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader-icon" {...props} />,
  Shield: (props: any) => <svg data-testid="shield-icon" {...props} />,
  Calendar: (props: any) => <svg data-testid="calendar-icon" {...props} />,
  HardDrive: (props: any) => <svg data-testid="harddrive-icon" {...props} />,
  Crown: (props: any) => <svg data-testid="crown-icon" {...props} />,
  Check: (props: any) => <svg data-testid="check-icon" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('ProfilePageHeader', () => {
  const defaultProps = {
    isEditing: false,
    isSaving: false,
    onEdit: vi.fn(),
    onCancel: vi.fn(),
    onSave: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders heading and description', () => {
    render(<ProfilePageHeader {...defaultProps} />)
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText(/Manage your account/)).toBeInTheDocument()
  })

  it('shows Edit Profile button when not editing', () => {
    render(<ProfilePageHeader {...defaultProps} />)
    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
  })

  it('calls onEdit when Edit Profile is clicked', () => {
    render(<ProfilePageHeader {...defaultProps} />)
    fireEvent.click(screen.getByText('Edit Profile'))
    expect(defaultProps.onEdit).toHaveBeenCalled()
  })

  it('shows Save and Cancel buttons when editing', () => {
    render(<ProfilePageHeader {...defaultProps} isEditing={true} />)
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('hides Edit Profile when editing', () => {
    render(<ProfilePageHeader {...defaultProps} isEditing={true} />)
    expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument()
  })

  it('calls onSave when Save Changes is clicked', () => {
    render(<ProfilePageHeader {...defaultProps} isEditing={true} />)
    fireEvent.click(screen.getByText('Save Changes'))
    expect(defaultProps.onSave).toHaveBeenCalled()
  })

  it('calls onCancel when Cancel is clicked', () => {
    render(<ProfilePageHeader {...defaultProps} isEditing={true} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('shows loading spinner when saving', () => {
    render(<ProfilePageHeader {...defaultProps} isEditing={true} isSaving={true} />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('disables buttons when saving', () => {
    render(<ProfilePageHeader {...defaultProps} isEditing={true} isSaving={true} />)
    const saveBtn = screen.getByText('Save Changes').closest('button')
    const cancelBtn = screen.getByText('Cancel').closest('button')
    expect(saveBtn).toBeDisabled()
    expect(cancelBtn).toBeDisabled()
  })
})

describe('ProfileLoadingState', () => {
  it('renders loading spinner', () => {
    render(<ProfileLoadingState />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })
})

describe('ProfileStatsCard', () => {
  it('renders role', () => {
    render(<ProfileStatsCard role="ADMIN" createdAt="2024-01-15T00:00:00Z" />)
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('renders member since date', () => {
    render(<ProfileStatsCard role="MEMBER" createdAt="2024-01-15T00:00:00Z" />)
    expect(screen.getByText(/January/)).toBeInTheDocument()
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('renders Role and Member Since labels', () => {
    render(<ProfileStatsCard role="OWNER" createdAt="2024-01-15T00:00:00Z" />)
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Member Since')).toBeInTheDocument()
  })
})

describe('ProfileStorageCard', () => {
  it('renders Storage heading', () => {
    render(<ProfileStorageCard storage={{ total: 10240, used: 5120, remaining: 5120 }} />)
    expect(screen.getByText('Storage')).toBeInTheDocument()
  })

  it('renders used storage in GB', () => {
    render(<ProfileStorageCard storage={{ total: 10240, used: 5120, remaining: 5120 }} />)
    expect(screen.getByText('5.00 GB')).toBeInTheDocument()
  })

  it('renders total storage in GB', () => {
    render(<ProfileStorageCard storage={{ total: 10240, used: 5120, remaining: 5120 }} />)
    expect(screen.getByText('10.00 GB')).toBeInTheDocument()
  })

  it('renders remaining percentage', () => {
    render(<ProfileStorageCard storage={{ total: 1000, used: 250, remaining: 750 }} />)
    expect(screen.getByText('75.0% remaining')).toBeInTheDocument()
  })

  it('renders 0 when storage is null', () => {
    render(<ProfileStorageCard storage={null} />)
    expect(screen.getAllByText(/0/).length).toBeGreaterThan(0)
    expect(screen.getByText('0% remaining')).toBeInTheDocument()
  })
})

describe('ProfilePlanCard', () => {
  it('renders Current Plan heading', () => {
    render(<ProfilePlanCard />)
    expect(screen.getByText('Current Plan')).toBeInTheDocument()
  })

  it('shows no plan message when no workspaces', () => {
    render(<ProfilePlanCard />)
    expect(screen.getByText('No workspace plan active')).toBeInTheDocument()
  })

  it('renders plan badge when workspace exists', () => {
    render(
      <ProfilePlanCard
        ownedWorkspaces={[{ id: 'ws-1', plan: 'PRO', maxStorage: 10240, slug: 'my-ws' }]}
      />
    )
    expect(screen.getByText('PRO')).toBeInTheDocument()
  })

  it('renders upgrade button when workspace exists', () => {
    render(
      <ProfilePlanCard
        ownedWorkspaces={[{ id: 'ws-1', plan: 'FREE', maxStorage: 1024, slug: 'my-ws' }]}
      />
    )
    expect(screen.getByText('Upgrade Plan')).toBeInTheDocument()
  })

  it('renders upgrade link with correct href', () => {
    render(
      <ProfilePlanCard
        ownedWorkspaces={[{ id: 'ws-1', plan: 'PRO', maxStorage: 10240, slug: 'my-ws' }]}
      />
    )
    const link = screen.getByText('Upgrade Plan').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces/my-ws/billing/upgrade')
  })

  it('renders feature list with storage info', () => {
    render(
      <ProfilePlanCard
        ownedWorkspaces={[{ id: 'ws-1', plan: 'PRO', maxStorage: 10240, slug: 'my-ws' }]}
      />
    )
    expect(screen.getByText('10 GB storage')).toBeInTheDocument()
    expect(screen.getByText('Unlimited projects')).toBeInTheDocument()
    expect(screen.getByText('Up to 5 team members')).toBeInTheDocument()
  })
})

describe('ProfileSidebar', () => {
  it('renders all three cards', () => {
    render(
      <ProfileSidebar
        role="ADMIN"
        createdAt="2024-01-15T00:00:00Z"
        storage={{ total: 10240, used: 5120, remaining: 5120 }}
        ownedWorkspaces={[{ id: 'ws-1', plan: 'PRO', maxStorage: 10240, slug: 'my-ws' }]}
      />
    )
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByText('Current Plan')).toBeInTheDocument()
  })
})
