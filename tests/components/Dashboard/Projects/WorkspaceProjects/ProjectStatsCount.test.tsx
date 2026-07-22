import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'

vi.mock('lucide-react', () => {
  const mock = (name: string) => {
    const C = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    C.displayName = name
    return C
  }
  return { FolderKanban: mock('folder-kanban'), Users: mock('users') }
})

import ProjectStatsCount from '@/components/Dashboard/Projects/WorkspaceProjects/ProjectStatsCount'

describe('ProjectStatsCount', () => {
  it('renders task count and singular label', () => {
    render(<ProjectStatsCount taskCount={1} memberCount={2} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('task')).toBeInTheDocument()
  })

  it('renders task count and plural label', () => {
    render(<ProjectStatsCount taskCount={5} memberCount={2} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('tasks')).toBeInTheDocument()
  })

  it('renders member count and singular label', () => {
    render(<ProjectStatsCount taskCount={5} memberCount={1} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('member')).toBeInTheDocument()
  })

  it('renders member count and plural label', () => {
    render(<ProjectStatsCount taskCount={1} memberCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('members')).toBeInTheDocument()
  })

  it('renders FolderKanban icon for tasks', () => {
    render(<ProjectStatsCount taskCount={1} memberCount={1} />)
    expect(screen.getByTestId('folder-kanban-icon')).toBeInTheDocument()
  })

  it('renders Users icon for members', () => {
    render(<ProjectStatsCount taskCount={1} memberCount={1} />)
    expect(screen.getByTestId('users-icon')).toBeInTheDocument()
  })
})
