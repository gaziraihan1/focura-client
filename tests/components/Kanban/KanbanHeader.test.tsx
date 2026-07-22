import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { KanbanHeader } from '@/components/Dashboard/KanbanView/KanbanHeader'

vi.mock('lucide-react', () => ({
  Target: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="target-icon" {...props} />,
  Zap: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="zap-icon" {...props} />,
  Settings: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="settings-icon" {...props} />,
}))

const defaultProps = {
  scope: 'personal' as const,
  onScopeChange: vi.fn(),
  taskCounts: { total: 10, inProgress: 3, blocked: 1 },
  focusMode: false,
  onFocusModeChange: vi.fn(),
}

describe('KanbanHeader', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the title', () => {
    render(<KanbanHeader {...defaultProps} />)
    expect(screen.getByText('Kanban')).toBeInTheDocument()
  })

  it('renders task counts', () => {
    render(<KanbanHeader {...defaultProps} />)
    expect(screen.getByText('10 tasks')).toBeInTheDocument()
    expect(screen.getByText('3 in progress')).toBeInTheDocument()
    expect(screen.getByText('1 blocked')).toBeInTheDocument()
  })

  it('renders scope buttons', () => {
    render(<KanbanHeader {...defaultProps} />)
    expect(screen.getByText('personal')).toBeInTheDocument()
    expect(screen.getByText('assigned')).toBeInTheDocument()
    expect(screen.getByText('team')).toBeInTheDocument()
  })

  it('calls onScopeChange when scope button is clicked', () => {
    render(<KanbanHeader {...defaultProps} />)
    fireEvent.click(screen.getByText('team'))
    expect(defaultProps.onScopeChange).toHaveBeenCalledWith('team')
  })

  it('calls onFocusModeChange when focus button is clicked', () => {
    render(<KanbanHeader {...defaultProps} />)
    const focusButton = screen.getByTestId('zap-icon').closest('button')!
    fireEvent.click(focusButton)
    expect(defaultProps.onFocusModeChange).toHaveBeenCalledWith(true)
  })

  it('renders settings button', () => {
    render(<KanbanHeader {...defaultProps} />)
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
  })

  it('does not show blocked count when zero', () => {
    render(
      <KanbanHeader
        {...defaultProps}
        taskCounts={{ total: 10, inProgress: 3, blocked: 0 }}
      />
    )
    expect(screen.queryByText('0 blocked')).not.toBeInTheDocument()
  })

  it('highlights active scope', () => {
    render(<KanbanHeader {...defaultProps} scope="assigned" />)
    const assignedBtn = screen.getByText('assigned')
    expect(assignedBtn.closest('button')).toHaveClass('bg-background')
  })
})
