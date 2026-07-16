import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamTasksPageHeader } from '@/components/Dashboard/TeamTask/TeamTasksPageHeader'
import { TeamTaskStatusIcon } from '@/components/Dashboard/TeamTask/TaskCardTeam/TeamTaskStatusIcon'
import { Stat } from '@/components/Dashboard/TeamTask/Stat'
import { Section } from '@/components/Dashboard/TeamTask/Section'

vi.mock('lucide-react', () => ({
  Users: (props: any) => <svg data-testid="users-icon" {...props} />,
  Clock: (props: any) => <svg data-testid="clock-icon" {...props} />,
  CheckCircle2: (props: any) => <svg data-testid="check-icon" {...props} />,
  AlertTriangle: (props: any) => <svg data-testid="alert-icon" {...props} />,
}))

vi.mock('@/utils/task.utils', () => ({
  getStatusColor: () => 'bg-gray-100 text-gray-700',
}))

describe('TeamTasksPageHeader', () => {
  it('renders Team Tasks heading', () => {
    render(<TeamTasksPageHeader />)
    expect(screen.getByText('Team Tasks')).toBeInTheDocument()
  })

  it('renders default description when no workspaceId', () => {
    render(<TeamTasksPageHeader />)
    expect(screen.getByText(/Work that requires coordination/)).toBeInTheDocument()
  })

  it('renders workspace description when workspaceId provided', () => {
    render(<TeamTasksPageHeader workspaceId="ws-1" />)
    expect(screen.getByText(/Tasks assigned in this workspace/)).toBeInTheDocument()
  })

  it('renders users icon', () => {
    render(<TeamTasksPageHeader />)
    expect(screen.getByTestId('users-icon')).toBeInTheDocument()
  })
})

describe('TeamTaskStatusIcon', () => {
  it('renders clock icon for TODO status', () => {
    render(<TeamTaskStatusIcon status="TODO" />)
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
  })

  it('renders clock icon for IN_PROGRESS status', () => {
    render(<TeamTaskStatusIcon status="IN_PROGRESS" />)
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
  })

  it('renders check icon for COMPLETED status', () => {
    render(<TeamTaskStatusIcon status="COMPLETED" />)
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
  })

  it('renders alert icon for BLOCKED status', () => {
    render(<TeamTaskStatusIcon status="BLOCKED" />)
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
  })

  it('renders clock icon for CANCELLED status', () => {
    render(<TeamTaskStatusIcon status="CANCELLED" />)
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
  })
})

describe('Stat', () => {
  it('renders label and value', () => {
    render(<Stat label="Total Tasks" value={42} />)
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders danger style when danger is true', () => {
    const { container } = render(<Stat label="Overdue" value={5} danger={true} />)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border-destructive/40')
  })

  it('renders normal style by default', () => {
    const { container } = render(<Stat label="Active" value={10} />)
    const card = container.firstChild as HTMLElement
    expect(card.className).not.toContain('border-destructive/40')
  })

  it('renders zero value', () => {
    render(<Stat label="Blocked" value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

describe('Section', () => {
  it('renders title', () => {
    render(<Section title="My Section"><p>Content</p></Section>)
    expect(screen.getByText('My Section')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Section title="My Section"><p>Section content here</p></Section>)
    expect(screen.getByText('Section content here')).toBeInTheDocument()
  })

  it('renders highlighted title when highlight is true', () => {
    render(<Section title="Urgent Tasks" highlight={true}><p>Content</p></Section>)
    const heading = screen.getByText('Urgent Tasks')
    expect(heading.className).toContain('text-destructive')
  })

  it('renders normal title when highlight is false', () => {
    render(<Section title="Normal Section"><p>Content</p></Section>)
    const heading = screen.getByText('Normal Section')
    expect(heading.className).toContain('text-foreground')
  })
})
