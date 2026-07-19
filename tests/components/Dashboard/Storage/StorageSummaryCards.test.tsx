import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StorageSummaryCards } from '@/components/Dashboard/Storage/StorageSummaryCards'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => ({
  Database: (props: any) => <svg {...props} />,
  HardDrive: (props: any) => <svg {...props} />,
  AlertCircle: (props: any) => <svg data-testid="alert" {...props} />,
  CheckCircle: (props: any) => <svg data-testid="check" {...props} />,
  Building2: (props: any) => <svg {...props} />,
}))

vi.mock('@/hooks/useStoragePage', () => ({
  formatStorageSize: (mb: number) => `${mb} MB`,
}))

const storageInfo = {
  usedMB: 300,
  totalMB: 1000,
  remainingMB: 700,
  percentage: 30,
  plan: 'PRO',
  workspaceId: 'ws-1',
  workspaceName: 'Test Workspace',
}

describe('StorageSummaryCards', () => {
  it('renders workspace name', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('Test Workspace')).toBeInTheDocument()
  })

  it('renders the current plan', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('PRO')).toBeInTheDocument()
  })

  it('renders storage used value', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('300 MB')).toBeInTheDocument()
  })

  it('renders usage percentage', () => {
    render(<StorageSummaryCards storageInfo={storageInfo} />)
    expect(screen.getByText('Usage')).toBeInTheDocument()
    expect(screen.getByText('Remaining')).toBeInTheDocument()
  })
})
