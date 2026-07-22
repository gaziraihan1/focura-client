import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('lucide-react', () => {
  return {
    FolderKanban: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'folder-kanban-icon', ...props }),
  }
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

import { ProjectsEmptyState } from '@/components/Dashboard/Projects/WorkspaceProjects/ProjectsEmptyState'

describe('ProjectsEmptyState', () => {
  it('shows "No projects yet" when no search query', () => {
    render(<ProjectsEmptyState hasSearchQuery={false} workspaceSlug="ws-1" canCreateProjects={true} />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })

  it('shows "No projects match your search" when has search query', () => {
    render(<ProjectsEmptyState hasSearchQuery={true} workspaceSlug="ws-1" canCreateProjects={true} />)
    expect(screen.getByText('No projects match your search')).toBeInTheDocument()
  })

  it('shows Create Project button when canCreateProjects and no search', () => {
    render(<ProjectsEmptyState hasSearchQuery={false} workspaceSlug="ws-1" canCreateProjects={true} />)
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('hides Create Project button when has search query', () => {
    render(<ProjectsEmptyState hasSearchQuery={true} workspaceSlug="ws-1" canCreateProjects={true} />)
    expect(screen.queryByText('Create Project')).not.toBeInTheDocument()
  })

  it('hides Create Project button when cannot create', () => {
    render(<ProjectsEmptyState hasSearchQuery={false} workspaceSlug="ws-1" canCreateProjects={false} />)
    expect(screen.queryByText('Create Project')).not.toBeInTheDocument()
  })
})
