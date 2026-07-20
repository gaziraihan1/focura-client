import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from '@/components/Dashboard/Workspaces/EmptyState'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Workspaces EmptyState', () => {
  it('renders not found message', () => {
    render(<EmptyState />)
    expect(screen.getByText('Workspace not found')).toBeInTheDocument()
  })

  it('renders back to workspaces link', () => {
    render(<EmptyState />)
    const link = screen.getByText('Back to Workspaces')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces')
  })
})
