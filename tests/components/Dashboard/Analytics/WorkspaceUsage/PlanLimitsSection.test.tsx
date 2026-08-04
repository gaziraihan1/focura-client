import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlanLimitsSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/PlanLimitsSection'
import type { PlanLimitsMetrics } from '@/types/workspace-usage.types'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    C.displayName = name
    return C
  }
  return {
    Users: icon('Users'),
    HardDrive: icon('HardDrive'),
    Folder: icon('Folder'),
    Zap: icon('Zap'),
    ArrowUpRight: icon('ArrowUpRight'),
    Crown: icon('Crown'),
    AlertTriangle: icon('AlertTriangle'),
  }
})

const baseLimits: PlanLimitsMetrics = {
  currentPlan: 'PRO',
  memberCount: 10,
  memberLimit: 25,
  storageUsedMB: 512,
  storageLimitMB: 10240,
  projectCount: 5,
  projectLimit: 20,
  automationCount: 0,
  automationLimit: 10,
}

describe('PlanLimitsSection', () => {
  it('renders heading and plan badge', () => {
    render(<PlanLimitsSection planLimits={baseLimits} workspaceSlug="my-ws" />)
    expect(screen.getByText('Plan Limits')).toBeInTheDocument()
    expect(screen.getByText('PRO')).toBeInTheDocument()
  })

  it('renders all four limit cards', () => {
    render(<PlanLimitsSection planLimits={baseLimits} workspaceSlug="my-ws" />)
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Automations')).toBeInTheDocument()
  })

  it('formats storage in GB when over 1 GB', () => {
    render(
      <PlanLimitsSection
        planLimits={{ ...baseLimits, storageUsedMB: 2048, storageLimitMB: 10240 }}
        workspaceSlug="my-ws"
      />
    )
    expect(screen.getByText(/2\.0 GB/)).toBeInTheDocument()
  })

  it('renders unlimited state for -1 limits', () => {
    render(
      <PlanLimitsSection
        planLimits={{ ...baseLimits, memberLimit: -1 }}
        workspaceSlug="my-ws"
      />
    )
    expect(screen.getByText('Unlimited')).toBeInTheDocument()
  })

  it('shows warning banner and upgrade buttons when near limits', () => {
    render(
      <PlanLimitsSection
        planLimits={{ ...baseLimits, memberCount: 24, memberLimit: 25 }}
        workspaceSlug="my-ws"
      />
    )
    expect(screen.getByText("You're approaching your plan limits")).toBeInTheDocument()
    expect(screen.getByText('Upgrade Now')).toBeInTheDocument()
  })

  it('renders FREE upsell CTA with link to upgrade page', () => {
    render(
      <PlanLimitsSection
        planLimits={{ ...baseLimits, currentPlan: 'FREE' }}
        workspaceSlug="my-ws"
      />
    )
    expect(screen.getByText('Unlock More with Pro')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /upgrade/i })
    expect(link.getAttribute('href')).toBe('/dashboard/workspaces/my-ws/billing/upgrade')
  })
})
