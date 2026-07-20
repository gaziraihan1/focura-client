import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskStatsCards } from '@/components/Dashboard/AllTasks/TaskStatsCards'

vi.mock('lucide-react', () => ({
  User: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  CheckCircle2: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  ListTodo: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  TrendingUp: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Users: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

const defaultStats = {
  personal: 5,
  assigned: 3,
  dueToday: 2,
  overdue: 1,
  totalTasks: 10,
  inProgress: 4,
  completed: 6,
}

describe('TaskStatsCards', () => {
  it('renders all tab cards by default', () => {
    render(<TaskStatsCards stats={defaultStats} />)
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Assigned')).toBeInTheDocument()
    expect(screen.getByText('Due Today')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders personal tab cards', () => {
    render(<TaskStatsCards stats={defaultStats} activeTab="personal" />)
    expect(screen.getByText('Personal Tasks')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('renders assigned tab cards', () => {
    render(<TaskStatsCards stats={defaultStats} activeTab="assigned" />)
    expect(screen.getByText('Assigned to Me')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('renders stat values', () => {
    render(<TaskStatsCards stats={defaultStats} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
