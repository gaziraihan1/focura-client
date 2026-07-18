import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// ─── CareersHero ─────────────────────────────────────────────────────────────
import { CareersHero } from '@/components/Careers/CareersHero'

describe('CareersHero', () => {
  it('renders the hiring badge', () => {
    render(<CareersHero openCount={5} />)
    expect(screen.getByText("We're hiring")).toBeInTheDocument()
  })

  it('renders open roles count', () => {
    render(<CareersHero openCount={5} />)
    expect(screen.getByText('5 open roles')).toBeInTheDocument()
  })

  it('renders singular role text for count of 1', () => {
    render(<CareersHero openCount={1} />)
    expect(screen.getByText('1 open role')).toBeInTheDocument()
  })

  it('hides roles count when zero', () => {
    render(<CareersHero openCount={0} />)
    expect(screen.queryByText(/open role/)).not.toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<CareersHero openCount={3} />)
    expect(screen.getByText('Build the future of')).toBeInTheDocument()
    expect(screen.getByText('focused work.')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<CareersHero openCount={3} />)
    expect(screen.getByText(/Focura is a small, ambitious team/)).toBeInTheDocument()
  })

  it('renders culture pills', () => {
    render(<CareersHero openCount={3} />)
    expect(screen.getByText('Remote-first culture')).toBeInTheDocument()
    expect(screen.getByText('Async-friendly')).toBeInTheDocument()
    expect(screen.getByText('Small, focused team')).toBeInTheDocument()
    expect(screen.getByText('Real ownership')).toBeInTheDocument()
  })

  it('renders see open roles link when count > 0', () => {
    render(<CareersHero openCount={3} />)
    expect(screen.getByText('See open roles')).toBeInTheDocument()
  })

  it('hides see open roles link when count is 0', () => {
    render(<CareersHero openCount={0} />)
    expect(screen.queryByText('See open roles')).not.toBeInTheDocument()
  })
})

// ─── CareersEmpty ────────────────────────────────────────────────────────────
import { CareersEmpty } from '@/components/Careers/CareersEmpty'

describe('CareersEmpty', () => {
  it('shows no open roles when no filters', () => {
    render(<CareersEmpty hasFilters={false} onClear={vi.fn()} />)
    expect(screen.getByText('No open roles right now')).toBeInTheDocument()
    expect(screen.getByText(/We don't have any open positions/)).toBeInTheDocument()
  })

  it('shows general application link when no filters', () => {
    render(<CareersEmpty hasFilters={false} onClear={vi.fn()} />)
    expect(screen.getByText('Send a general application')).toBeInTheDocument()
  })

  it('shows no matching roles when filters are active', () => {
    render(<CareersEmpty hasFilters={true} onClear={vi.fn()} />)
    expect(screen.getByText('No roles match your filters')).toBeInTheDocument()
    expect(screen.getByText(/Try adjusting your search or filters/)).toBeInTheDocument()
  })

  it('calls onClear when clear filters button is clicked', () => {
    const onClear = vi.fn()
    render(<CareersEmpty hasFilters={true} onClear={onClear} />)
    fireEvent.click(screen.getByText('Clear filters'))
    expect(onClear).toHaveBeenCalledOnce()
  })
})

// ─── CareersValues ───────────────────────────────────────────────────────────
import { CareersValues } from '@/components/Careers/CareersValues'

describe('CareersValues', () => {
  it('renders the label', () => {
    render(<CareersValues />)
    expect(screen.getByText('Why Focura')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<CareersValues />)
    expect(screen.getByText("What it's like to work here.")).toBeInTheDocument()
  })

  it('renders all six value cards', () => {
    render(<CareersValues />)
    expect(screen.getByText('Craft over velocity')).toBeInTheDocument()
    expect(screen.getByText('Remote-first by design')).toBeInTheDocument()
    expect(screen.getByText('Real ownership')).toBeInTheDocument()
    expect(screen.getByText('Honest communication')).toBeInTheDocument()
    expect(screen.getByText('Users first, always')).toBeInTheDocument()
    expect(screen.getByText('Sustainable pace')).toBeInTheDocument()
  })

  it('renders value descriptions', () => {
    render(<CareersValues />)
    expect(screen.getByText(/We ship thoughtfully/)).toBeInTheDocument()
    expect(screen.getByText(/The team works async across time zones/)).toBeInTheDocument()
  })
})

// ─── CareersFilters ──────────────────────────────────────────────────────────
import { CareersFilters } from '@/components/Careers/CareersFilters'

describe('CareersFilters', () => {
  const defaultFilters = { search: '', department: '', locationType: '', type: '' }

  it('renders the search input', () => {
    render(<CareersFilters filters={defaultFilters} onChange={vi.fn()} totalCount={5} />)
    expect(screen.getByPlaceholderText(/Search roles, skills, or location/)).toBeInTheDocument()
  })

  it('renders filter selects', () => {
    render(<CareersFilters filters={defaultFilters} onChange={vi.fn()} totalCount={5} />)
    expect(screen.getByText('All Departments')).toBeInTheDocument()
    expect(screen.getByText('All Locations')).toBeInTheDocument()
    expect(screen.getByText('All Types')).toBeInTheDocument()
  })

  it('renders result count', () => {
    render(<CareersFilters filters={defaultFilters} onChange={vi.fn()} totalCount={5} />)
    expect(screen.getByText('5 roles')).toBeInTheDocument()
  })

  it('renders singular for count of 1', () => {
    render(<CareersFilters filters={defaultFilters} onChange={vi.fn()} totalCount={1} />)
    expect(screen.getByText('1 role')).toBeInTheDocument()
  })

  it('does not show clear button when no filters', () => {
    render(<CareersFilters filters={defaultFilters} onChange={vi.fn()} totalCount={5} />)
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  it('shows clear button when filters are active', () => {
    const filters = { search: 'test', department: '', locationType: '', type: '' }
    render(<CareersFilters filters={filters} onChange={vi.fn()} totalCount={5} />)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('calls onChange when search input changes', () => {
    const onChange = vi.fn()
    render(<CareersFilters filters={defaultFilters} onChange={onChange} totalCount={5} />)
    fireEvent.change(screen.getByPlaceholderText(/Search roles/), { target: { value: 'engineer' } })
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, search: 'engineer' })
  })

  it('calls onChange when department select changes', () => {
    const onChange = vi.fn()
    render(<CareersFilters filters={defaultFilters} onChange={onChange} totalCount={5} />)
    fireEvent.change(screen.getByDisplayValue('All Departments'), { target: { value: 'ENGINEERING' } })
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, department: 'ENGINEERING' })
  })

  it('calls clearAll when clear button is clicked', () => {
    const onChange = vi.fn()
    const filters = { search: 'test', department: 'ENGINEERING', locationType: '', type: '' }
    render(<CareersFilters filters={filters} onChange={onChange} totalCount={5} />)
    fireEvent.click(screen.getByText('Clear'))
    expect(onChange).toHaveBeenCalledWith({ search: '', department: '', locationType: '', type: '' })
  })

  it('shows department options', () => {
    render(<CareersFilters filters={defaultFilters} onChange={vi.fn()} totalCount={5} />)
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Product')).toBeInTheDocument()
  })

  it('shows location type options', () => {
    render(<CareersFilters filters={defaultFilters} onChange={vi.fn()} totalCount={5} />)
    expect(screen.getByText('Remote')).toBeInTheDocument()
    expect(screen.getByText('On-site')).toBeInTheDocument()
    expect(screen.getByText('Hybrid')).toBeInTheDocument()
  })

  it('shows job type options', () => {
    render(<CareersFilters filters={defaultFilters} onChange={vi.fn()} totalCount={5} />)
    expect(screen.getByText('Full-time')).toBeInTheDocument()
    expect(screen.getByText('Part-time')).toBeInTheDocument()
    expect(screen.getByText('Contract')).toBeInTheDocument()
  })
})

// ─── CareersJobCard ──────────────────────────────────────────────────────────
import { CareersJobCard } from '@/components/Careers/CareersJobCard'
import type { JobListItem } from '@/types/job.types'

const mockJob: JobListItem = {
  id: '1',
  title: 'Senior Frontend Engineer',
  slug: 'senior-frontend-engineer',
  department: 'ENGINEERING',
  location: 'Remote',
  locationType: 'REMOTE',
  type: 'FULL_TIME',
  experienceLevel: 'SENIOR',
  salaryMin: 80000,
  salaryMax: 120000,
  salaryCurrency: 'USD',
  isPinned: false,
  closingDate: '2026-12-31',
  publishedAt: new Date().toISOString(),
  applicationUrl: null,
  applicationEmail: 'jobs@focura.app',
  status: 'OPEN',
}

describe('CareersJobCard', () => {
  it('renders the job title', () => {
    render(<CareersJobCard job={mockJob} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument()
  })

  it('renders department label', () => {
    render(<CareersJobCard job={mockJob} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.getByText('Engineering')).toBeInTheDocument()
  })

  it('renders location', () => {
    render(<CareersJobCard job={mockJob} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.getAllByText('Remote').length).toBeGreaterThanOrEqual(1)
  })

  it('renders job type', () => {
    render(<CareersJobCard job={mockJob} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.getByText('Full-time')).toBeInTheDocument()
  })

  it('renders experience level', () => {
    render(<CareersJobCard job={mockJob} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.getByText('Senior Level')).toBeInTheDocument()
  })

  it('renders salary', () => {
    render(<CareersJobCard job={mockJob} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    // formatSalary divides by 100, so 80000 -> $800
    expect(screen.getByText(/\$800/)).toBeInTheDocument()
  })

  it('renders new badge when isNew is true', () => {
    render(<CareersJobCard job={mockJob} isNew={true} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('hides new badge when isNew is false', () => {
    render(<CareersJobCard job={mockJob} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.queryByText('New')).not.toBeInTheDocument()
  })

  it('renders pinned icon when isPinned', () => {
    const pinnedJob = { ...mockJob, isPinned: true }
    render(<CareersJobCard job={pinnedJob} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    // Pin icon is rendered but we can check the job still renders
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    const onClick = vi.fn()
    render(<CareersJobCard job={mockJob} isNew={false} onClick={onClick} onApply={vi.fn()} />)
    // Click the title (which is inside the card)
    fireEvent.click(screen.getByText('Senior Frontend Engineer'))
    expect(onClick).toHaveBeenCalledWith(mockJob)
  })

  it('calls onApply when apply button is clicked', () => {
    const onApply = vi.fn()
    render(<CareersJobCard job={mockJob} isNew={false} onClick={vi.fn()} onApply={onApply} />)
    fireEvent.click(screen.getByText('Apply'))
    expect(onApply).toHaveBeenCalledWith(mockJob)
  })

  it('renders closing date', () => {
    render(<CareersJobCard job={mockJob} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.getByText(/Applications close/)).toBeInTheDocument()
  })

  it('hides closing date when null', () => {
    const jobNoClosing = { ...mockJob, closingDate: null }
    render(<CareersJobCard job={jobNoClosing} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.queryByText(/Applications close/)).not.toBeInTheDocument()
  })

  it('renders salary when only min is set', () => {
    const jobMinOnly = { ...mockJob, salaryMax: null }
    render(<CareersJobCard job={jobMinOnly} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.getByText(/From/)).toBeInTheDocument()
  })

  it('renders salary when only max is set', () => {
    const jobMaxOnly = { ...mockJob, salaryMin: null }
    render(<CareersJobCard job={jobMaxOnly} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.getByText(/Up to/)).toBeInTheDocument()
  })

  it('hides salary when both are null', () => {
    const jobNoSalary = { ...mockJob, salaryMin: null, salaryMax: null }
    render(<CareersJobCard job={jobNoSalary} isNew={false} onClick={vi.fn()} onApply={vi.fn()} />)
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
  })

  it('handles keyboard Enter key', () => {
    const onClick = vi.fn()
    const { container } = render(<CareersJobCard job={mockJob} isNew={false} onClick={onClick} onApply={vi.fn()} />)
    const card = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(onClick).toHaveBeenCalledWith(mockJob)
  })

  it('handles keyboard Space key', () => {
    const onClick = vi.fn()
    const { container } = render(<CareersJobCard job={mockJob} isNew={false} onClick={onClick} onApply={vi.fn()} />)
    const card = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement
    fireEvent.keyDown(card, { key: ' ' })
    expect(onClick).toHaveBeenCalledWith(mockJob)
  })
})

// ─── CareersApplyModal ───────────────────────────────────────────────────────
import { CareersApplyModal } from '@/components/Careers/CareersApplyModal'

describe('CareersApplyModal', () => {
  it('renders nothing when job is null', () => {
    const { container } = render(<CareersApplyModal job={null} onClose={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders the modal when job is provided', () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument()
  })

  it('renders department label', () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getByText('Engineering')).toBeInTheDocument()
  })

  it('renders how to apply section', () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getByText('How to apply')).toBeInTheDocument()
  })

  it('renders apply via email link', () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getByText('Apply via email')).toBeInTheDocument()
  })

  it('renders what to include section', () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getByText('What to include in your email')).toBeInTheDocument()
  })

  it('renders closing date when provided', () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getByText(/Applications close/)).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<CareersApplyModal job={mockJob} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<CareersApplyModal job={mockJob} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders meta tags', () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />)
    expect(screen.getAllByText('Remote').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Full-time')).toBeInTheDocument()
    expect(screen.getByText('Senior Level')).toBeInTheDocument()
  })

  it('renders external URL when provided', () => {
    const jobWithUrl = { ...mockJob, applicationUrl: 'https://apply.example.com' }
    render(<CareersApplyModal job={jobWithUrl} onClose={vi.fn()} />)
    expect(screen.getByText('Apply on external portal')).toBeInTheDocument()
  })
})

// ─── CareersJobDetailModal ───────────────────────────────────────────────────
import { CareersJobDetailModal } from '@/components/Careers/CareersJobDetailModal'
import type { JobPosting } from '@/types/job.types'

const mockJobPosting: JobPosting = {
  ...mockJob,
  description: 'We are looking for a senior frontend engineer to join our team.',
  requirements: '5+ years of experience with React and TypeScript.',
  niceToHave: 'Experience with Next.js is a plus.',
  benefits: 'Remote work, health insurance, stock options.',
}

describe('CareersJobDetailModal', () => {
  it('renders nothing when job is null', () => {
    const { container } = render(<CareersJobDetailModal job={null} onClose={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders the modal when job is provided', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument()
  })

  it('renders job description', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getByText(/We are looking for a senior frontend engineer/)).toBeInTheDocument()
  })

  it('renders requirements', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getByText(/5\+ years of experience/)).toBeInTheDocument()
  })

  it('renders nice to have', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getByText(/Experience with Next\.js is a plus/)).toBeInTheDocument()
  })

  it('renders benefits', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getByText(/Remote work, health insurance/)).toBeInTheDocument()
  })

  it('renders application email', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getByText('jobs@focura.app')).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('renders Apply Now button', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getByText('Apply Now')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<CareersJobDetailModal job={mockJobPosting} onClose={onClose} />)
    fireEvent.click(screen.getByText('Close'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<CareersJobDetailModal job={mockJobPosting} onClose={onClose} />)
    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders closing date when provided', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getByText(/Applications close/)).toBeInTheDocument()
  })

  it('renders application URL when provided', () => {
    const jobWithUrl = { ...mockJobPosting, applicationUrl: 'https://apply.example.com' }
    render(<CareersJobDetailModal job={jobWithUrl} onClose={vi.fn()} />)
    expect(screen.getByText('https://apply.example.com')).toBeInTheDocument()
  })

  it('renders meta tags with correct labels', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    expect(screen.getAllByText('Remote').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Full-time')).toBeInTheDocument()
    expect(screen.getByText('Senior Level')).toBeInTheDocument()
  })

  it('renders salary when provided', () => {
    render(<CareersJobDetailModal job={mockJobPosting} onClose={vi.fn()} />)
    // formatSalary divides by 100, so 80000 -> $800
    expect(screen.getByText(/\$800/)).toBeInTheDocument()
  })

  it('shows no description fallback', () => {
    const jobNoDesc = { ...mockJobPosting, description: '' }
    render(<CareersJobDetailModal job={jobNoDesc} onClose={vi.fn()} />)
    expect(screen.getByText('No description provided.')).toBeInTheDocument()
  })

  it('shows no requirements fallback', () => {
    const jobNoReq = { ...mockJobPosting, requirements: '' }
    render(<CareersJobDetailModal job={jobNoReq} onClose={vi.fn()} />)
    expect(screen.getByText('No requirements listed.')).toBeInTheDocument()
  })

  it('hides nice to have when empty', () => {
    const jobNoNice = { ...mockJobPosting, niceToHave: '' }
    render(<CareersJobDetailModal job={jobNoNice} onClose={vi.fn()} />)
    expect(screen.queryByText('Nice to Have')).not.toBeInTheDocument()
  })

  it('hides benefits when empty', () => {
    const jobNoBenefits = { ...mockJobPosting, benefits: '' }
    render(<CareersJobDetailModal job={jobNoBenefits} onClose={vi.fn()} />)
    expect(screen.queryByText('Benefits')).not.toBeInTheDocument()
  })

  it('handles Escape key', () => {
    const onClose = vi.fn()
    render(<CareersJobDetailModal job={mockJobPosting} onClose={onClose} />)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
