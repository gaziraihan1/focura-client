import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskDescription } from '@/components/Dashboard/CalendarView/TaskModal/TaskDescription'

describe('TaskDescription', () => {
  it('renders description text', () => {
    render(<TaskDescription description="This is a task description" />)
    expect(screen.getByText('This is a task description')).toBeInTheDocument()
  })

  it('renders description header', () => {
    render(<TaskDescription description="Some text" />)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('returns null when description is null', () => {
    const { container } = render(<TaskDescription description={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('returns null when description is undefined', () => {
    const { container } = render(<TaskDescription />)
    expect(container.innerHTML).toBe('')
  })
})
