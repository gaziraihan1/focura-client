import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TaskEmpty from '@/components/Dashboard/TaskDetails/TaskEmpty'
import { IntentBadge, IntentCard } from '@/components/Dashboard/TaskDetails/IntentBadge'
import TaskDetailsSkeleton from '@/components/Dashboard/TaskDetails/TaskDetailsSkeleton'
import TaskDetailsPermission from '@/components/Dashboard/TaskDetails/TaskDetailsPermission'
import { FocusRequirementsCard } from '@/components/Dashboard/TaskDetails/FocusRequirementsCard'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => <a href={href} {...props}>{children}</a>,
}))
vi.mock('framer-motion', () => ({
  motion: { div: (p: Record<string, unknown>) => <div {...p} /> },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))
vi.mock('@/utils/task.utils', () => ({
  getFocusLevelColor: () => 'text-purple-500',
  getEnergyTypeColor: () => 'bg-blue-100',
}))

describe('TaskEmpty', () => {
  it('renders "Task not found" heading', () => {
    render(<TaskEmpty />)
    expect(screen.getByText('Task not found')).toBeInTheDocument()
  })

  it('shows "Back to Tasks" link', () => {
    render(<TaskEmpty />)
    const link = screen.getByText('Back to Tasks')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/dashboard/tasks')
  })
})

describe('IntentBadge', () => {
  it('renders EXECUTION label "Do Work"', () => {
    render(<IntentBadge intent="EXECUTION" />)
    expect(screen.getByText('Do Work')).toBeInTheDocument()
  })

  it('renders PLANNING label "Think & Plan"', () => {
    render(<IntentBadge intent="PLANNING" />)
    expect(screen.getByText('Think & Plan')).toBeInTheDocument()
  })

  it('renders REVIEW label "Review"', () => {
    render(<IntentBadge intent="REVIEW" />)
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  it('renders LEARNING label "Learn"', () => {
    render(<IntentBadge intent="LEARNING" />)
    expect(screen.getByText('Learn')).toBeInTheDocument()
  })

  it('renders COMMUNICATION label "Communicate"', () => {
    render(<IntentBadge intent="COMMUNICATION" />)
    expect(screen.getByText('Communicate')).toBeInTheDocument()
  })

  it('hides label when showLabel=false', () => {
    render(<IntentBadge intent="EXECUTION" showLabel={false} />)
    expect(screen.queryByText('Do Work')).not.toBeInTheDocument()
  })

  it('defaults to EXECUTION intent', () => {
    render(<IntentBadge />)
    expect(screen.getByText('Do Work')).toBeInTheDocument()
  })
})

describe('IntentCard', () => {
  it('renders EXECUTION intent card', () => {
    render(<IntentCard intent="EXECUTION" />)
    expect(screen.getByText('Do Work')).toBeInTheDocument()
    expect(screen.getByText('Active implementation and building')).toBeInTheDocument()
  })

  it('renders PLANNING intent card', () => {
    render(<IntentCard intent="PLANNING" />)
    expect(screen.getByText('Think & Plan')).toBeInTheDocument()
    expect(screen.getByText('Strategy and organization')).toBeInTheDocument()
  })
})

describe('TaskDetailsSkeleton', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<TaskDetailsSkeleton />)
    const skeletonElements = container.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })
})

describe('TaskDetailsPermission', () => {
  it('renders "Access Denied" heading', () => {
    render(<TaskDetailsPermission />)
    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  it('shows permission denied message', () => {
    render(<TaskDetailsPermission />)
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument()
  })
})

describe('FocusRequirementsCard', () => {
  it('renders "Focus Requirements" heading', () => {
    render(<FocusRequirementsCard />)
    expect(screen.getByText('Focus Requirements')).toBeInTheDocument()
  })

  it('shows focus level when provided', () => {
    render(<FocusRequirementsCard focusLevel={3} />)
    expect(screen.getByText('Focus Level')).toBeInTheDocument()
    expect(screen.getByText('3/5')).toBeInTheDocument()
  })

  it('shows energy type when provided', () => {
    render(<FocusRequirementsCard energyType="HIGH" />)
    expect(screen.getByText('Energy Type')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('shows distraction cost when provided', () => {
    render(<FocusRequirementsCard distractionCost={4} />)
    expect(screen.getByText('Distraction Cost')).toBeInTheDocument()
    expect(screen.getByText('4/5')).toBeInTheDocument()
  })
})
