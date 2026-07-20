import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlanLimitsSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/PlanLimitsSection'

vi.mock('next/link', () => ({
  default: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <a {...props}>{children}</a>,
}))

const mockPlanLimits = {
  currentPlan: 'FREE',
  memberCount: 3,
  memberLimit: 10,
  storageUsedMB: 800,
  storageLimitMB: 1024,
  projectCount: 4,
  projectLimit: 5,
  automationCount: 1,
  automationLimit: 2,
}

describe('PlanLimitsSection', () => {
  it('renders plan name badge', () => {
    render(<PlanLimitsSection planLimits={mockPlanLimits as any as Record<string, unknown>} workspaceSlug="test-ws" />)
    expect(screen.getByText('FREE')).toBeInTheDocument()
  })

  it('renders all four limit cards', () => {
    render(<PlanLimitsSection planLimits={mockPlanLimits as any as Record<string, unknown>} workspaceSlug="test-ws" />)
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Automations')).toBeInTheDocument()
  })

  it('shows upgrade button when nearing limits', () => {
    render(<PlanLimitsSection planLimits={mockPlanLimits as any as Record<string, unknown>} workspaceSlug="test-ws" />)
    expect(screen.getByText('Upgrade')).toBeInTheDocument()
  })

  it('shows warning banner when limits are near', () => {
    render(<PlanLimitsSection planLimits={mockPlanLimits as any as Record<string, unknown>} workspaceSlug="test-ws" />)
    expect(screen.getByText("You're approaching your plan limits")).toBeInTheDocument()
  })
})
