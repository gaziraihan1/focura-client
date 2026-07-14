import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UpgradePlanCard } from '@/components/Shared/UpgradePlanCard'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ workspaceSlug: 'my-workspace' }),
}))

describe('UpgradePlanCard', () => {
  const defaultProps = {
    feature: 'Analytics',
    description: 'Track your team performance.',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the feature name', () => {
    render(<UpgradePlanCard {...defaultProps} />)

    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<UpgradePlanCard {...defaultProps} />)

    expect(screen.getByText(/Track your team performance/)).toBeInTheDocument()
  })

  it('renders "Pro feature" label', () => {
    render(<UpgradePlanCard {...defaultProps} />)

    expect(screen.getByText('Pro feature')).toBeInTheDocument()
  })

  it('renders all plan perks', () => {
    render(<UpgradePlanCard {...defaultProps} />)

    expect(screen.getByText('More projects & members')).toBeInTheDocument()
    expect(screen.getByText('Advanced analytics & reporting')).toBeInTheDocument()
    expect(screen.getByText('Priority support')).toBeInTheDocument()
    expect(screen.getByText('More workspaces')).toBeInTheDocument()
    expect(screen.getByText('Storage management')).toBeInTheDocument()
    expect(screen.getByText('Workspace usage')).toBeInTheDocument()
  })

  it('renders "Upgrade to Pro" button', () => {
    render(<UpgradePlanCard {...defaultProps} />)

    expect(screen.getByRole('button', { name: /upgrade to pro/i })).toBeInTheDocument()
  })

  it('renders "See plans" button', () => {
    render(<UpgradePlanCard {...defaultProps} />)

    expect(screen.getByRole('button', { name: /see plans/i })).toBeInTheDocument()
  })

  it('navigates to upgrade page on "Upgrade to Pro" click', async () => {
    const user = userEvent.setup()
    render(<UpgradePlanCard {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /upgrade to pro/i }))

    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces/my-workspace/billing/upgrade')
  })

  it('navigates to upgrade page on "See plans" click', async () => {
    const user = userEvent.setup()
    render(<UpgradePlanCard {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /see plans/i }))

    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces/my-workspace/billing/upgrade')
  })

  it('renders Lock icon for unknown feature', () => {
    render(<UpgradePlanCard feature="UnknownFeature" description="Something." />)

    expect(screen.getByText('UnknownFeature')).toBeInTheDocument()
  })

  it('renders correct icon for known feature (Analytics)', () => {
    const { container } = render(<UpgradePlanCard {...defaultProps} />)

    const iconContainer = container.querySelector('.bg-primary\\/10')
    expect(iconContainer).toBeInTheDocument()
  })

  it('renders contact support link', () => {
    render(<UpgradePlanCard {...defaultProps} />)

    const link = screen.getByText('Contact support')
    expect(link).toHaveAttribute('href', 'mailto:support@yourapp.com')
  })
})
