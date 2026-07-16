import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KanbanCardHeader } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardHeader'

describe('KanbanCardHeader', () => {
  it('renders priority badge', () => {
    render(<KanbanCardHeader priority="HIGH" isCompleted={false} isBlocked={false} />)
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('renders URGENT priority with correct style', () => {
    render(<KanbanCardHeader priority="URGENT" isCompleted={false} isBlocked={false} />)
    const badge = screen.getByText('URGENT')
    expect(badge).toHaveClass('bg-red-500')
  })

  it('renders HIGH priority with correct style', () => {
    render(<KanbanCardHeader priority="HIGH" isCompleted={false} isBlocked={false} />)
    const badge = screen.getByText('HIGH')
    expect(badge).toHaveClass('bg-orange-500')
  })

  it('renders MEDIUM priority with correct style', () => {
    render(<KanbanCardHeader priority="MEDIUM" isCompleted={false} isBlocked={false} />)
    const badge = screen.getByText('MEDIUM')
    expect(badge).toHaveClass('bg-blue-500')
  })

  it('renders LOW priority with correct style', () => {
    render(<KanbanCardHeader priority="LOW" isCompleted={false} isBlocked={false} />)
    const badge = screen.getByText('LOW')
    expect(badge).toHaveClass('bg-gray-500')
  })

  it('shows check icon when completed', () => {
    const { container } = render(<KanbanCardHeader priority="HIGH" isCompleted={true} isBlocked={false} />)
    expect(container.querySelector('.lucide-circle-check')).toBeInTheDocument()
  })

  it('shows alert icon when blocked', () => {
    const { container } = render(<KanbanCardHeader priority="HIGH" isCompleted={false} isBlocked={true} />)
    expect(container.querySelector('.lucide-circle-alert')).toBeInTheDocument()
  })

  it('does not show check icon when not completed', () => {
    const { container } = render(<KanbanCardHeader priority="HIGH" isCompleted={false} isBlocked={false} />)
    expect(container.querySelector('.lucide-circle-check')).not.toBeInTheDocument()
  })

  it('does not show alert icon when not blocked', () => {
    const { container } = render(<KanbanCardHeader priority="HIGH" isCompleted={false} isBlocked={false} />)
    expect(container.querySelector('.lucide-circle-alert')).not.toBeInTheDocument()
  })
})
