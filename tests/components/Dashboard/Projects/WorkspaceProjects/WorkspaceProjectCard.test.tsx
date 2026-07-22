import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import React from 'react'
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
  return {
    Calendar: mock('calendar'),
    Flag: mock('flag'),
    CheckCircle2: mock('check-circle2'),
    FolderKanban: mock('folder-kanban'),
    Users: mock('users'),
    Crown: mock('crown'),
    X: mock('x'),
  }
})

import { WorkspaceProjectCard } from '@/components/Dashboard/Projects/WorkspaceProjects/WorkspaceProjectCard'
import { mockProject } from './testHelpers'

describe('WorkspaceProjectCard', () => {
  it('renders project name', () => {
    render(
      <WorkspaceProjectCard
        project={mockProject}
        workspaceSlug="ws-1"
        currentUserId="user-1"
        canCreateProjects={true}
      />
    )
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('shows access denied modal when clicking without access', () => {
    const { container } = render(
      <WorkspaceProjectCard
        project={mockProject}
        workspaceSlug="ws-1"
        currentUserId="user-99"
        canCreateProjects={false}
      />
    )
    // Debug: log all buttons
    const buttons = container.querySelectorAll('button')
    console.log('Found buttons:', buttons.length)
    buttons.forEach((b, i) => console.log(`Button ${i}:`, b.getAttribute('aria-label'), b.textContent?.substring(0, 50)))

    // Find and click the card button
    const cardButton = Array.from(buttons).find((b) =>
      b.getAttribute('aria-label')?.includes('Open project')
    )
    expect(cardButton).toBeTruthy()
    fireEvent.click(cardButton!)
    expect(screen.getByText('Access Restricted')).toBeInTheDocument()
  })

  it('does not show access denied modal when user has access', () => {
    render(
      <WorkspaceProjectCard
        project={mockProject}
        workspaceSlug="ws-1"
        currentUserId="user-1"
        canCreateProjects={false}
      />
    )
    expect(screen.queryByText('Access Restricted')).not.toBeInTheDocument()
  })

  it('has access when canCreateProjects is true', () => {
    render(
      <WorkspaceProjectCard
        project={mockProject}
        workspaceSlug="ws-1"
        currentUserId="user-99"
        canCreateProjects={true}
      />
    )
    const link = screen.getByText('Test Project').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces/ws-1/projects/test-project')
  })
})
