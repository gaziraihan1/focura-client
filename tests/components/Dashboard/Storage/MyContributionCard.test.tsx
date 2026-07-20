import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MyContributionCard } from '@/components/Dashboard/Storage/MyContributionCard'

vi.mock('framer-motion', () => ({
  motion: { div: (p: any) => <div {...p} /> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('@/hooks/useStoragePage', () => ({
  formatStorageSize: (mb: number) => mb + ' MB',
}))

describe('MyContributionCard', () => {
  const defaultProps = {
    contribution: { usageMB: 500, fileCount: 25, percentage: 15 },
    workspaceName: 'Acme Workspace',
  }

  it('renders "Your Contribution" heading', () => {
    render(<MyContributionCard {...defaultProps} />)
    expect(screen.getByText('Your Contribution')).toBeInTheDocument()
  })

  it('shows workspace name', () => {
    render(<MyContributionCard {...defaultProps} />)
    expect(screen.getByText(/Acme Workspace/)).toBeInTheDocument()
  })

  it('shows percentage', () => {
    render(<MyContributionCard {...defaultProps} />)
    expect(screen.getAllByText('15%').length).toBeGreaterThanOrEqual(1)
  })

  it('shows storage used', () => {
    render(<MyContributionCard {...defaultProps} />)
    expect(screen.getByText('500 MB')).toBeInTheDocument()
  })

  it('shows file count', () => {
    render(<MyContributionCard {...defaultProps} />)
    expect(screen.getAllByText('25').length).toBeGreaterThanOrEqual(1)
  })

  it('shows warning when percentage >= 30', () => {
    render(<MyContributionCard {...defaultProps} contribution={{ usageMB: 1000, fileCount: 50, percentage: 35 }} />)
    expect(screen.getByText(/significant portion/)).toBeInTheDocument()
  })

  it('hides warning when percentage < 30', () => {
    render(<MyContributionCard {...defaultProps} />)
    expect(screen.queryByText(/significant portion/)).not.toBeInTheDocument()
  })
})
