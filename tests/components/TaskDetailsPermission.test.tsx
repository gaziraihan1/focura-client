import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaskDetailsPermission from '@/components/Dashboard/TaskDetails/TaskDetailsPermission'

vi.mock('lucide-react', () => ({
  Link: (props: any) => <svg data-testid="link-icon" {...props} />,
  Lock: (props: any) => <svg data-testid="lock-icon" {...props} />,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('TaskDetailsPermission', () => {
  it('renders access denied heading', () => {
    render(<TaskDetailsPermission />)
    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  it('renders permission denied message', () => {
    render(<TaskDetailsPermission />)
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument()
  })

  it('renders back to tasks link', () => {
    render(<TaskDetailsPermission />)
    const link = screen.getByText('Back to Tasks')
    expect(link).toHaveAttribute('href', '/dashboard/tasks')
  })

  it('renders lock icon', () => {
    render(<TaskDetailsPermission />)
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument()
  })
})
