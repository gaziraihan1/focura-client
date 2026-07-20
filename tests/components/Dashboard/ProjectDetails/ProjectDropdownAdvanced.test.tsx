import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import ProjectDropdown from '@/components/Dashboard/ProjectDetails/ProjectDropdown'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => <a href={href} {...props}>{children}</a>,
}))
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
}))

const mockUseProjects = vi.fn()
const mockUseWorkspaceProjectsPage = vi.fn()
vi.mock('@/hooks/useProjects', () => ({
  useProjects: (...args: (string | boolean | undefined | null)[]) => mockUseProjects(...args),
}))
vi.mock('@/hooks/useProjectsPage', () => ({
  useWorkspaceProjectsPage: (...args: (string | boolean | undefined | null)[]) => mockUseWorkspaceProjectsPage(...args),
}))

describe('ProjectDropdown', () => {
  beforeEach(() => {
    mockUseWorkspaceProjectsPage.mockReturnValue({
      workspace: { id: 'ws-1', name: 'Test WS' },
      currentUserId: 'u-1',
      canCreateProjects: true,
    })
    mockUseProjects.mockReturnValue({
      data: [
        { id: 'p-1', name: 'Project Alpha', slug: 'project-alpha', members: [{ user: { id: 'u-1' } }] },
        { id: 'p-2', name: 'Project Beta', slug: 'project-beta', members: [] },
      ],
    })
  })

  it('renders Projects button', () => {
    render(<ProjectDropdown />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('shows dropdown when clicked', async () => {
    const user = userEvent.setup()
    render(<ProjectDropdown />)
    await user.click(screen.getByText('Projects'))
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    expect(screen.getByText('Project Beta')).toBeInTheDocument()
  })

  it('shows "Your Projects" label', async () => {
    const user = userEvent.setup()
    render(<ProjectDropdown />)
    await user.click(screen.getByText('Projects'))
    expect(screen.getByText('Your Projects')).toBeInTheDocument()
  })
})
