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

import { ProjectsEmptyState } from '@/components/dashboard/projects/all-projects/ProjectsEmptyState'

describe('ProjectsEmptyState', () => {
  it('shows "No projects yet" when no search query', () => {
    render(<ProjectsEmptyState hasSearchQuery={false} variant="panel" action={{ label: 'Create Project', onClick: vi.fn() }} />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })

  it('shows "No projects match your search" when has search query', () => {
    render(<ProjectsEmptyState hasSearchQuery={true} variant="panel" />)
    expect(screen.getByText('No projects match your search')).toBeInTheDocument()
  })

  it('shows Create Project button when action provided and no search', () => {
    render(<ProjectsEmptyState hasSearchQuery={false} variant="panel" action={{ label: 'Create Project', onClick: vi.fn() }} />)
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('hides Create Project button when has search query', () => {
    render(<ProjectsEmptyState hasSearchQuery={true} variant="panel" action={{ label: 'Create Project', onClick: vi.fn() }} />)
    expect(screen.queryByText('Create Project')).not.toBeInTheDocument()
  })

  it('hides Create Project button when no action provided', () => {
    render(<ProjectsEmptyState hasSearchQuery={false} variant="panel" />)
    expect(screen.queryByText('Create Project')).not.toBeInTheDocument()
  })
})
