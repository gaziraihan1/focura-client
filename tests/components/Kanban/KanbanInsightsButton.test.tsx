import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { KanbanInsightsButton } from '@/components/Dashboard/KanbanView/KanbanInsightsButton'

describe('KanbanInsightsButton', () => {
  it('renders when showInsights is false', () => {
    render(<KanbanInsightsButton showInsights={false} onToggle={vi.fn()} />)
    expect(screen.getByText('Show Insights')).toBeInTheDocument()
  })

  it('does not render when showInsights is true', () => {
    render(<KanbanInsightsButton showInsights={true} onToggle={vi.fn()} />)
    expect(screen.queryByText('Show Insights')).not.toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<KanbanInsightsButton showInsights={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByText('Show Insights'))
    expect(onToggle).toHaveBeenCalled()
  })
})
