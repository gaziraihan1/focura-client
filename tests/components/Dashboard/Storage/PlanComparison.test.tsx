import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlanComparison } from '@/components/Dashboard/Storage/PlanComparison'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => ({
  Check: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check" {...props} />,
}))

vi.mock('@/hooks/useStoragePage', () => ({
  getPlanLimits: (plan: string) => ({
    FREE: { storage: 1024, features: ['Basic file storage', 'Up to 5 MB per file', '5 team members'] },
    PRO: { storage: 10240, features: ['Enhanced storage', 'Up to 25 MB per file'] },
    BUSINESS: { storage: 51200, features: ['Large storage', 'Up to 100 MB per file'] },
  }[plan] || { storage: 1024, features: ['Basic'] }),
}))

vi.mock('@/constants/storage.constants', () => ({
  plans: [
    { name: 'FREE', icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />, description: 'For small teams' },
    { name: 'PRO', icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />, description: 'For growing teams', popular: true },
    { name: 'BUSINESS', icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />, description: 'For organizations' },
  ],
}))

describe('PlanComparison', () => {
  it('renders the heading', () => {
    render(<PlanComparison currentPlan="FREE" workspaceName="Test WS" />)
    expect(screen.getByText('Workspace Plan Comparison')).toBeInTheDocument()
  })

  it('renders workspace name in the description', () => {
    render(<PlanComparison currentPlan="FREE" workspaceName="Test WS" />)
    expect(screen.getByText(/Upgrade Test WS/)).toBeInTheDocument()
  })

  it('renders plan names', () => {
    render(<PlanComparison currentPlan="FREE" workspaceName="Test WS" />)
    expect(screen.getByText('FREE')).toBeInTheDocument()
    expect(screen.getByText('PRO')).toBeInTheDocument()
    expect(screen.getByText('BUSINESS')).toBeInTheDocument()
  })

  it('shows Active Plan for the current plan', () => {
    render(<PlanComparison currentPlan="PRO" workspaceName="Test WS" />)
    expect(screen.getByText('Active Plan')).toBeInTheDocument()
  })
})
