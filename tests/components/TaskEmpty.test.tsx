import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaskEmpty from '@/components/Dashboard/TaskDetails/TaskEmpty'

vi.mock('lucide-react', () => ({
  AlertCircle: (props: any) => <svg data-testid="alert-icon" {...props} />,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('TaskEmpty', () => {
  it('renders not found message', () => {
    render(<TaskEmpty />)
    expect(screen.getByText('Task not found')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<TaskEmpty />)
    expect(screen.getByText(/doesn't exist/)).toBeInTheDocument()
  })

  it('renders back to tasks link', () => {
    render(<TaskEmpty />)
    const link = screen.getByText('Back to Tasks')
    expect(link).toHaveAttribute('href', '/dashboard/tasks')
  })

  it('renders alert icon', () => {
    render(<TaskEmpty />)
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
  })
})
