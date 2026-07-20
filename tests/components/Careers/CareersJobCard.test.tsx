import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CareersJobCard } from '@/components/Careers/CareersJobCard'

vi.mock('lucide-react', () => ({
  MapPin: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="map-pin" {...props} />,
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="clock" {...props} />,
  Briefcase: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="briefcase" {...props} />,
  Pin: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="pin" {...props} />,
  DollarSign: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="dollar" {...props} />,
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}))

const mockJob = {
  id: 'j1',
  title: 'Frontend Developer',
  slug: 'frontend-dev',
  department: 'ENGINEERING' as const,
  location: 'Remote',
  locationType: 'REMOTE' as const,
  type: 'FULL_TIME' as const,
  experienceLevel: 'MID' as const,
  salaryMin: 8000000,
  salaryMax: 12000000,
  salaryCurrency: 'USD',
  isPinned: false,
  closingDate: '2025-06-01',
  publishedAt: '2025-01-01',
  applicationUrl: 'https://apply.example.com',
  applicationEmail: 'hr@test.com',
  status: 'OPEN' as const,
}

describe('CareersJobCard', () => {
  const defaultProps = {
    job: mockJob,
    isNew: false,
    onClick: vi.fn(),
    onApply: vi.fn(),
  }

  it('renders job title', () => {
    render(<CareersJobCard {...defaultProps} />)
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
  })

  it('renders department label', () => {
    render(<CareersJobCard {...defaultProps} />)
    expect(screen.getByText('Engineering')).toBeInTheDocument()
  })

  it('renders Apply button', () => {
    render(<CareersJobCard {...defaultProps} />)
    expect(screen.getByText('Apply')).toBeInTheDocument()
  })

  it('shows New badge when isNew is true', () => {
    render(<CareersJobCard {...defaultProps} isNew={true} />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })
})
