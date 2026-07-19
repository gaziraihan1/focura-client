import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))

import { WorkspaceDetailErrorState } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceDetailErrorState'

describe('WorkspaceDetailErrorState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()
  })

  it('renders the error heading', () => {
    render(<WorkspaceDetailErrorState />)
    expect(screen.getByText('Workspace not found')).toBeInTheDocument()
  })

  it('renders the error description', () => {
    render(<WorkspaceDetailErrorState />)
    expect(screen.getByText(/This workspace doesn/)).toBeInTheDocument()
    expect(screen.getByText(/exist or you don/)).toBeInTheDocument()
  })

  it('renders the Back to Workspaces button', () => {
    render(<WorkspaceDetailErrorState />)
    expect(screen.getByText('Back to Workspaces')).toBeInTheDocument()
  })

  it('navigates to workspaces list when button clicked', () => {
    render(<WorkspaceDetailErrorState />)
    fireEvent.click(screen.getByText('Back to Workspaces'))
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces')
  })

  it('renders AlertCircle icon', () => {
    render(<WorkspaceDetailErrorState />)
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('has correct heading level', () => {
    render(<WorkspaceDetailErrorState />)
    const heading = screen.getByText('Workspace not found')
    expect(heading.tagName).toBe('H2')
  })

  it('button has primary styles', () => {
    render(<WorkspaceDetailErrorState />)
    const btn = screen.getByText('Back to Workspaces').closest('button')!
    expect(btn.className).toContain('bg-primary')
    expect(btn.className).toContain('text-primary-foreground')
  })
})
