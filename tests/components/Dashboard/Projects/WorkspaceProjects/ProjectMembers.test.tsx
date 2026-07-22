import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('lucide-react', () => {
  return {
    Crown: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'crown-icon', ...props }),
  }
})

import ProjectMembers from '@/components/Dashboard/Projects/WorkspaceProjects/ProjectMembers'
import { mockMembers } from './testHelpers'

describe('ProjectMembers', () => {
  it('renders member names', () => {
    render(<ProjectMembers members={mockMembers.slice(0, 2)} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('shows max 3 members', () => {
    render(<ProjectMembers members={mockMembers} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
    expect(screen.queryByText('Diana')).not.toBeInTheDocument()
  })

  it('shows "+N more" for more than 3 members', () => {
    render(<ProjectMembers members={mockMembers} />)
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })

  it('does not show "+N more" for 3 or fewer members', () => {
    render(<ProjectMembers members={mockMembers.slice(0, 3)} />)
    expect(screen.queryByText(/\+.*more/)).not.toBeInTheDocument()
  })

  it('shows Crown icon for MANAGER role', () => {
    render(<ProjectMembers members={[mockMembers[0]]} />)
    expect(screen.getByTestId('crown-icon')).toBeInTheDocument()
  })

  it('does not show Crown icon for MEMBER role', () => {
    render(<ProjectMembers members={[mockMembers[1]]} />)
    expect(screen.queryByTestId('crown-icon')).not.toBeInTheDocument()
  })

  it('shows "Unknown" when member name is missing', () => {
    const membersWithoutName = [{ user: { id: 'u-1', name: null as unknown as string }, role: 'MEMBER' }]
    render(<ProjectMembers members={membersWithoutName} />)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })
})
