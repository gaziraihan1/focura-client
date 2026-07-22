import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('lucide-react', () => {
  const mock = (name: string) => {
    const C = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    C.displayName = name
    return C
  }
  return { CheckCircle2: mock('check-circle2'), FolderKanban: mock('folder-kanban') }
})

import ProjectDetails from '@/components/Dashboard/Projects/WorkspaceProjects/ProjectDetails'
import { mockProject } from './testHelpers'

describe('ProjectDetails', () => {
  it('renders project name', () => {
    render(<ProjectDetails project={mockProject} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders project description', () => {
    render(<ProjectDetails project={mockProject} />)
    expect(screen.getByText('A test project')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<ProjectDetails project={mockProject} />)
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
  })

  it('renders joined badge when joined is true', () => {
    render(<ProjectDetails project={mockProject} joined={true} />)
    expect(screen.getByText('Joined')).toBeInTheDocument()
  })

  it('does not render joined badge when joined is false', () => {
    render(<ProjectDetails project={mockProject} joined={false} />)
    expect(screen.queryByText('Joined')).not.toBeInTheDocument()
  })

  it('renders FolderKanban icon when no icon is set', () => {
    render(<ProjectDetails project={mockProject} />)
    expect(screen.getByTestId('folder-kanban-icon')).toBeInTheDocument()
  })

  it('renders custom icon when set', () => {
    const projectWithIcon = { ...mockProject, icon: '🚀' }
    render(<ProjectDetails project={projectWithIcon} />)
    expect(screen.getByText('🚀')).toBeInTheDocument()
  })

  it('renders no description when description is empty', () => {
    const projectNoDesc = { ...mockProject, description: null }
    render(<ProjectDetails project={projectNoDesc} />)
    expect(screen.queryByText('A test project')).not.toBeInTheDocument()
  })
})
