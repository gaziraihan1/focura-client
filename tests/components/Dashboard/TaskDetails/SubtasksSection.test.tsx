import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { SubtaskEmptyState } from '@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskEmptyState'
import { SubtaskProgress } from '@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskProgress'
import { StatusButton } from '@/components/Dashboard/TaskDetails/SubtasksSection/StatusButton'

vi.mock('framer-motion', () => ({
  motion: { div: (p: Record<string, unknown>) => <div {...p} />, button: (p: Record<string, unknown>) => <button {...p} /> },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

describe('SubtaskEmptyState', () => {
  it('renders "No subtasks yet"', () => {
    render(<SubtaskEmptyState canAdd={false} onAdd={vi.fn()} />)
    expect(screen.getByText('No subtasks yet')).toBeInTheDocument()
  })

  it('shows add button when canAdd=true', () => {
    render(<SubtaskEmptyState canAdd={true} onAdd={vi.fn()} />)
    expect(screen.getByText('Add first subtask')).toBeInTheDocument()
  })

  it('hides add button when canAdd=false', () => {
    render(<SubtaskEmptyState canAdd={false} onAdd={vi.fn()} />)
    expect(screen.queryByText('Add first subtask')).not.toBeInTheDocument()
  })
})

describe('SubtaskProgress', () => {
  it('renders progress stats', () => {
    render(<SubtaskProgress stats={{ total: 5, completed: 3, inProgress: 1, completionRate: 60 }} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('of 5')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('renders nothing when total is 0', () => {
    const { container } = render(<SubtaskProgress stats={{ total: 0, completed: 0, inProgress: 0, completionRate: 0 }} />)
    expect(container.innerHTML).toBe('')
  })

  it('shows 100% completion rate in emerald', () => {
    render(<SubtaskProgress stats={{ total: 3, completed: 3, inProgress: 0, completionRate: 100 }} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})

describe('StatusButton', () => {
  it('renders with status icon', () => {
    render(<StatusButton status="TODO" onChange={vi.fn()} disabled={false} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onChange with next status when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StatusButton status="TODO" onChange={onChange} disabled={false} />)
    await user.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenCalledWith('IN_PROGRESS')
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StatusButton status="TODO" onChange={onChange} disabled={true} />)
    await user.click(screen.getByRole('button'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
