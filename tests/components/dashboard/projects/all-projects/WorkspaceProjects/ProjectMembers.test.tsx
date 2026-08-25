import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('lucide-react', () => {
  return {
    Crown: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'crown-icon', ...props }),
  }
})

vi.mock('@/hooks/useNavigationPrefetch', () => ({
  useProjectOverviewPrefetch: () => vi.fn(),
  useWorkspaceOverviewPrefetch: () => vi.fn(),
}))

function createTestWrapper(children: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

import ProjectMembers from '@/components/dashboard/projects/all-projects/WorkspaceProjects/ProjectMembers'
import { mockMembers } from './testHelpers.tsx'

describe('ProjectMembers', () => {
  it('renders member names', () => {
    render(createTestWrapper(<ProjectMembers members={mockMembers.slice(0, 2)} />))
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('shows max 3 members', () => {
    render(createTestWrapper(<ProjectMembers members={mockMembers} />))
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
    expect(screen.queryByText('Diana')).not.toBeInTheDocument()
  })

  it('shows "+N more" for more than 3 members', () => {
    render(createTestWrapper(<ProjectMembers members={mockMembers} />))
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })

  it('does not show "+N more" for 3 or fewer members', () => {
    render(createTestWrapper(<ProjectMembers members={mockMembers.slice(0, 3)} />))
    expect(screen.queryByText(/\+.*more/)).not.toBeInTheDocument()
  })

  it('shows Crown icon for MANAGER role', () => {
    render(createTestWrapper(<ProjectMembers members={[mockMembers[0]]} />))
    expect(screen.getByTestId('crown-icon')).toBeInTheDocument()
  })

  it('does not show Crown icon for MEMBER role', () => {
    render(createTestWrapper(<ProjectMembers members={[mockMembers[1]]} />))
    expect(screen.queryByTestId('crown-icon')).not.toBeInTheDocument()
  })

  it('shows "Unknown" when member name is missing', () => {
    const membersWithoutName = [{ user: { id: 'u-1', name: null as unknown as string }, role: 'MEMBER' }]
    render(createTestWrapper(<ProjectMembers members={membersWithoutName} />))
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })
})
