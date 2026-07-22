import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('lucide-react', () => {
  const mock = (name: string) => {
    const C = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    C.displayName = name
    return C
  }
  return { Calendar: mock('calendar'), Flag: mock('flag'), FolderKanban: mock('folder-kanban'), Users: mock('users'), Crown: mock('crown') }
})

import { ProjectCard } from '@/components/Dashboard/Projects/WorkspaceProjects/ProjectCard'
import { mockProject } from './testHelpers'

describe('ProjectCard', () => {
  it('renders project name', () => {
    render(<ProjectCard project={mockProject} workspaceSlug="ws-1" haveAccess={true} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders as Link when haveAccess is true', () => {
    render(<ProjectCard project={mockProject} workspaceSlug="ws-1" haveAccess={true} />)
    const link = screen.getByText('Test Project').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces/ws-1/projects/test-project')
  })

  it('renders as button when haveAccess is false', () => {
    render(<ProjectCard project={mockProject} workspaceSlug="ws-1" haveAccess={false} />)
    const button = screen.getByRole('button', { name: /open project test project/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onClick when button clicked (no access)', () => {
    const onClick = vi.fn()
    render(<ProjectCard project={mockProject} workspaceSlug="ws-1" haveAccess={false} onClick={onClick} />)
    fireEvent.click(screen.getByRole('button', { name: /open project test project/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders priority', () => {
    render(<ProjectCard project={mockProject} workspaceSlug="ws-1" haveAccess={true} />)
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('renders due date', () => {
    render(<ProjectCard project={mockProject} workspaceSlug="ws-1" haveAccess={true} />)
    expect(screen.getByText(/Due/)).toBeInTheDocument()
  })

  it('does not render due date section when no due date', () => {
    const projectNoDue = { ...mockProject, dueDate: null }
    render(<ProjectCard project={projectNoDue} workspaceSlug="ws-1" haveAccess={true} />)
    expect(screen.queryByText(/Due/)).not.toBeInTheDocument()
  })

  it('renders task and member counts', () => {
    render(<ProjectCard project={mockProject} workspaceSlug="ws-1" haveAccess={true} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
