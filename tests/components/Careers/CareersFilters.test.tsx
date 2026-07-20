import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CareersFilters } from '@/components/Careers/CareersFilters'

vi.mock('lucide-react', () => ({
  Search: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="search" {...props} />,
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x" {...props} />,
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}))

const defaultProps = {
  filters: { search: '', department: '', locationType: '', type: '' },
  onChange: vi.fn(),
  totalCount: 10,
}

describe('CareersFilters', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the search input', () => {
    render(<CareersFilters {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search roles, skills, or location…')).toBeInTheDocument()
  })

  it('renders the result count', () => {
    render(<CareersFilters {...defaultProps} />)
    expect(screen.getByText('10 roles')).toBeInTheDocument()
  })

  it('renders All Departments select', () => {
    render(<CareersFilters {...defaultProps} />)
    expect(screen.getByText('All Departments')).toBeInTheDocument()
  })

  it('renders Clear button when filters are active', () => {
    render(
      <CareersFilters
        {...defaultProps}
        filters={{ search: 'engineer', department: '', locationType: '', type: '' }}
      />
    )
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })
})
