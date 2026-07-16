import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StorageSummaryCards } from '@/components/Dashboard/Storage/StorageSummaryCards'
import { MyContributionCard } from '@/components/Dashboard/Storage/MyContributionCard'

vi.mock('lucide-react', () => ({
  Database: (props: any) => <svg data-testid="database-icon" {...props} />,
  HardDrive: (props: any) => <svg data-testid="harddrive-icon" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="alert-icon" {...props} />,
  CheckCircle: (props: any) => <svg data-testid="check-icon" {...props} />,
  Building2: (props: any) => <svg data-testid="building-icon" {...props} />,
  User: (props: any) => <svg data-testid="user-icon" {...props} />,
  Files: (props: any) => <svg data-testid="files-icon" {...props} />,
  TrendingUp: (props: any) => <svg data-testid="trending-icon" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('@/hooks/useStoragePage', () => ({
  formatStorageSize: (mb: number) => `${(mb / 1024).toFixed(1)} GB`,
}))

describe('StorageSummaryCards', () => {
  const storageInfo = {
    usedMB: 5120,
    totalMB: 10240,
    remainingMB: 5120,
    percentage: 50,
    plan: 'PRO',
    workspaceName: 'My Workspace',
  }

  it('renders workspace name', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('My Workspace')).toBeInTheDocument()
  })

  it('renders plan name', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('PRO')).toBeInTheDocument()
  })

  it('renders Storage Used card', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('Storage Used')).toBeInTheDocument()
  })

  it('renders Total Limit card', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('Total Limit')).toBeInTheDocument()
  })

  it('renders Remaining card', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('Remaining')).toBeInTheDocument()
  })

  it('renders Usage percentage', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('renders formatted storage sizes', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getAllByText('5.0 GB').length).toBeGreaterThan(0)
    expect(screen.getByText('10.0 GB')).toBeInTheDocument()
  })

  it('renders check icon for low usage', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getAllByTestId('check-icon').length).toBeGreaterThan(0)
  })

  it('renders alert icon for high usage', () => {
    render(<StorageSummaryCards storageInfo={{ ...storageInfo, percentage: 96 }} />)
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
  })
})

describe('MyContributionCard', () => {
  const contribution = {
    usageMB: 2048,
    fileCount: 25,
    percentage: 20,
  }

  it('renders heading', () => {
    render(<MyContributionCard contribution={contribution} workspaceName="Acme" />)
    expect(screen.getByText('Your Contribution')).toBeInTheDocument()
  })

  it('renders workspace name', () => {
    render(<MyContributionCard contribution={contribution} workspaceName="Acme" />)
    expect(screen.getByText(/Acme/)).toBeInTheDocument()
  })

  it('renders percentage', () => {
    render(<MyContributionCard contribution={contribution} workspaceName="Acme" />)
    expect(screen.getAllByText(/20/).length).toBeGreaterThan(0)
  })

  it('renders file count', () => {
    render(<MyContributionCard contribution={contribution} workspaceName="Acme" />)
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('renders Storage Used label', () => {
    render(<MyContributionCard contribution={contribution} workspaceName="Acme" />)
    expect(screen.getByText('Storage Used')).toBeInTheDocument()
  })

  it('renders Total Files label', () => {
    render(<MyContributionCard contribution={contribution} workspaceName="Acme" />)
    expect(screen.getByText('Total Files')).toBeInTheDocument()
  })

  it('renders contribution level', () => {
    render(<MyContributionCard contribution={contribution} workspaceName="Acme" />)
    expect(screen.getByText('Contribution Level')).toBeInTheDocument()
  })

  it('shows warning for high usage', () => {
    render(<MyContributionCard contribution={{ ...contribution, percentage: 35 }} workspaceName="Acme" />)
    expect(screen.getByText(/significant portion/)).toBeInTheDocument()
  })

  it('hides warning for low usage', () => {
    render(<MyContributionCard contribution={contribution} workspaceName="Acme" />)
    expect(screen.queryByText(/significant portion/)).not.toBeInTheDocument()
  })
})
