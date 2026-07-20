import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CareersJobDetailModal } from '@/components/Careers/CareersJobDetailModal'

vi.mock('lucide-react', () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
  MapPin: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="map-pin" {...props} />,
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="clock" {...props} />,
  Briefcase: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="briefcase" {...props} />,
  Pin: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="pin" {...props} />,
  DollarSign: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="dollar" {...props} />,
  Calendar: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="calendar" {...props} />,
  Link: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="link" {...props} />,
  Mail: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="mail" {...props} />,
}))

const mockJob = {
  id: 'j1',
  title: 'Senior Engineer',
  slug: 'senior-engineer',
  department: 'ENGINEERING' as const,
  location: 'Remote',
  locationType: 'REMOTE' as const,
  type: 'FULL_TIME' as const,
  experienceLevel: 'SENIOR' as const,
  salaryMin: 12000000,
  salaryMax: 18000000,
  salaryCurrency: 'USD',
  description: 'Build amazing things',
  requirements: '5+ years experience',
  niceToHave: 'TypeScript',
  benefits: 'Health insurance',
  isPinned: true,
  closingDate: '2025-06-01',
  publishedAt: '2025-01-01',
  applicationUrl: 'https://apply.example.com',
  applicationEmail: 'hr@test.com',
  status: 'OPEN' as const,
}

describe('CareersJobDetailModal', () => {
  it('renders nothing when job is null', () => {
    const { container } = render(<CareersJobDetailModal job={null} onClose={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders job title', () => {
    render(<CareersJobDetailModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
  })

  it('renders job description', () => {
    render(<CareersJobDetailModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getByText('Build amazing things')).toBeInTheDocument()
  })

  it('renders Apply Now button', () => {
    render(<CareersJobDetailModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getByText('Apply Now')).toBeInTheDocument()
  })
})
