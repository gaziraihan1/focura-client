import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'

const mockUseWorkspaces = vi.fn()

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspaces: () => mockUseWorkspaces(),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQuery: (options: any) => {
      if (options.queryKey[0] === 'dashboard-activities') {
        return { data: options.enabled === false ? undefined : [], isLoading: false }
      }
      return actual.useQuery(options)
    },
  }
})

import { RecentActivity } from '@/components/Dashboard/RecentActivity'

describe('RecentActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Recent activity heading', () => {
    mockUseWorkspaces.mockReturnValue({ data: [], isLoading: false })
    render(<RecentActivity />, { wrapper: createWrapper() })
    expect(screen.getByText('Recent activity')).toBeInTheDocument()
  })

  it('shows empty state when no workspaces', () => {
    mockUseWorkspaces.mockReturnValue({ data: [], isLoading: false })
    render(<RecentActivity />, { wrapper: createWrapper() })
    expect(screen.getByText('No recent activity yet.')).toBeInTheDocument()
  })
})
