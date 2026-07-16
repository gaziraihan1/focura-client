import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KanbanCardProjectIndicator } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardProjectIndicator'

describe('KanbanCardProjectIndicator', () => {
  it('renders project color bar when project is provided', () => {
    const { container } = render(
      <KanbanCardProjectIndicator project={{ id: '1', name: 'Test', color: '#3b82f6' }} />
    )
    const bar = container.querySelector('[style*="background-color"]')
    expect(bar).toBeInTheDocument()
  })

  it('returns null when project is null', () => {
    const { container } = render(<KanbanCardProjectIndicator project={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('returns null when project is undefined', () => {
    const { container } = render(<KanbanCardProjectIndicator />)
    expect(container.innerHTML).toBe('')
  })

  it('applies correct color', () => {
    const { container } = render(
      <KanbanCardProjectIndicator project={{ id: '1', name: 'Test', color: '#ef4444' }} />
    )
    const bar = container.querySelector('[style*="background-color"]')
    expect(bar).toHaveStyle({ backgroundColor: '#ef4444' })
  })
})
