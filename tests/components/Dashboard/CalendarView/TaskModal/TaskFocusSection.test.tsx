import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TaskFocusSection } from '@/components/Dashboard/CalendarView/TaskModal/TaskFocusSection'

describe('TaskFocusSection', () => {
  it('renders nothing when no focus data', () => {
    const { container } = render(<TaskFocusSection />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders energy type badge', () => {
    render(<TaskFocusSection energyType="HIGH" />)
    expect(screen.getByText(/HIGH energy/)).toBeInTheDocument()
  })

  it('renders focus required badge', () => {
    render(<TaskFocusSection focusRequired />)
    expect(screen.getByText(/Focus required/)).toBeInTheDocument()
  })

  it('renders focus level', () => {
    render(<TaskFocusSection focusLevel={4} />)
    expect(screen.getByText(/Focus level 4\/5/)).toBeInTheDocument()
  })

  it('renders distraction cost', () => {
    render(<TaskFocusSection distractionCost={3} />)
    expect(screen.getByText(/Distraction cost 3/)).toBeInTheDocument()
  })

  it('renders multiple badges together', () => {
    render(<TaskFocusSection energyType="LOW" focusRequired focusLevel={2} distractionCost={5} />)
    expect(screen.getByText(/LOW energy/)).toBeInTheDocument()
    expect(screen.getByText(/Focus required/)).toBeInTheDocument()
    expect(screen.getByText(/Focus level 2\/5/)).toBeInTheDocument()
    expect(screen.getByText(/Distraction cost 5/)).toBeInTheDocument()
  })
})
