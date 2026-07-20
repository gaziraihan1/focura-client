import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { WorkspacesHeader } from '@/components/Dashboard/Workspaces/Workspaces/WorkspacesHeader'
import { WorkspaceSearch } from '@/components/Dashboard/Workspaces/Workspaces/WorkspaceSearch'
import { WorkspacesContent } from '@/components/Dashboard/Workspaces/Workspaces/WorkspacesContent'

vi.mock('framer-motion', () => ({
  motion: { div: (p: any) => <div {...p} /> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))
vi.mock('@/hooks/useWorkspacePage', () => ({
  useWorkspacesPage: () => ({
    getPlanBadge: () => ({ label: 'Free', color: 'bg-gray-100 text-gray-700' }),
    navigateToSettings: vi.fn(),
  }),
}))

const mockWorkspace = {
  id: 'ws-1',
  name: 'Test Workspace',
  slug: 'test-workspace',
  description: 'A test workspace',
  color: '#3b82f6',
  logo: null,
  plan: 'FREE',
  ownerId: 'user-1',
  _count: { projects: 5, members: 10 },
}

describe('WorkspacesHeader', () => {
  it('renders "Workspaces" heading', () => {
    render(<WorkspacesHeader onCreate={vi.fn()} />)
    expect(screen.getByText('Workspaces')).toBeInTheDocument()
  })

  it('shows Create Workspace button', () => {
    render(<WorkspacesHeader onCreate={vi.fn()} />)
    expect(screen.getByRole('button', { name: /create workspace/i })).toBeInTheDocument()
  })

  it('calls onCreate when button clicked', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(<WorkspacesHeader onCreate={onCreate} />)
    await user.click(screen.getByRole('button', { name: /create workspace/i }))
    expect(onCreate).toHaveBeenCalledTimes(1)
  })
})

describe('WorkspaceSearch', () => {
  it('renders search input', () => {
    render(<WorkspaceSearch value="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search workspaces...')).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<WorkspaceSearch value="test" onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('test')).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<WorkspaceSearch value="" onChange={onChange} />)
    await user.type(screen.getByPlaceholderText('Search workspaces...'), 'a')
    expect(onChange).toHaveBeenCalled()
  })
})

describe('WorkspacesContent', () => {
  it('shows loading state', () => {
    render(<WorkspacesContent isLoading={true} isError={false} searchQuery="" filteredWorkspaces={[]} />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(<WorkspacesContent isLoading={false} isError={true} searchQuery="" filteredWorkspaces={[]} />)
    expect(screen.getByText('Failed to load workspaces')).toBeInTheDocument()
  })

  it('shows empty state when no workspaces', () => {
    render(<WorkspacesContent isLoading={false} isError={false} searchQuery="" filteredWorkspaces={[]} />)
    expect(screen.getByText('No workspaces yet')).toBeInTheDocument()
  })

  it('shows "No workspaces found" when search has no results', () => {
    render(<WorkspacesContent isLoading={false} isError={false} searchQuery="nonexistent" filteredWorkspaces={[]} />)
    expect(screen.getByText('No workspaces found')).toBeInTheDocument()
  })
})
