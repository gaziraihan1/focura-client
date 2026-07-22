import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'

vi.mock('lucide-react', () => {
  return {
    Plus: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'plus-icon', ...props }),
  }
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

import { WorkspaceProjectsPageHeader } from '@/components/Dashboard/Projects/WorkspaceProjects/WorkspaceProjectsPageHeader'

describe('WorkspaceProjectsPageHeader', () => {
  it('renders title', () => {
    render(<WorkspaceProjectsPageHeader workspaceName="My Workspace" workspaceSlug="my-ws" canCreateProjects={true} />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('renders workspace name in subtitle', () => {
    render(<WorkspaceProjectsPageHeader workspaceName="My Workspace" workspaceSlug="my-ws" canCreateProjects={true} />)
    expect(screen.getByText('Browse projects in My Workspace')).toBeInTheDocument()
  })

  it('shows New Project button when canCreateProjects', () => {
    render(<WorkspaceProjectsPageHeader workspaceName="My Workspace" workspaceSlug="my-ws" canCreateProjects={true} />)
    expect(screen.getByText('New Project')).toBeInTheDocument()
  })

  it('hides New Project button when cannot create', () => {
    render(<WorkspaceProjectsPageHeader workspaceName="My Workspace" workspaceSlug="my-ws" canCreateProjects={false} />)
    expect(screen.queryByText('New Project')).not.toBeInTheDocument()
  })
})
