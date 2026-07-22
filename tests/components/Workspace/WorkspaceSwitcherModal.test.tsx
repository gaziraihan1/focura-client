import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkspaceSwitcherModal } from '@/components/Dashboard/Workspaces/WorkspaceSwitcherModal'

vi.mock('lucide-react', () => ({
  Command: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Plus: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

const mockWorkspaces = [
  { id: '1', name: 'Workspace A', slug: 'ws-a', workspaceSlug: undefined, color: '#3b82f6', logo: null, _count: { members: 5, projects: 3 } },
  { id: '2', name: 'Workspace B', slug: 'ws-b', workspaceSlug: undefined, color: '#ef4444', logo: null, _count: { members: 2, projects: 1 } },
]

describe('WorkspaceSwitcherModal', () => {
  const defaultProps = {
    isOpen: true,
    allWorkspaces: mockWorkspaces,
    currentSlug: 'ws-a',
    onClose: vi.fn(),
    onWorkspaceSwitch: vi.fn(),
    onCreateWorkspace: vi.fn(),
  }

  it('returns null when not open', () => {
    const { container } = render(<WorkspaceSwitcherModal {...defaultProps} isOpen={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders when open', () => {
    render(<WorkspaceSwitcherModal {...defaultProps} />)
    expect(screen.getByText('Quick switch workspace')).toBeInTheDocument()
  })

  it('renders workspace list', () => {
    render(<WorkspaceSwitcherModal {...defaultProps} />)
    expect(screen.getByText('Workspace A')).toBeInTheDocument()
    expect(screen.getByText('Workspace B')).toBeInTheDocument()
  })

  it('renders workspace stats', () => {
    render(<WorkspaceSwitcherModal {...defaultProps} />)
    expect(screen.getByText('5 members · 3 projects')).toBeInTheDocument()
    expect(screen.getByText('2 members · 1 projects')).toBeInTheDocument()
  })

  it('renders create new workspace button', () => {
    render(<WorkspaceSwitcherModal {...defaultProps} />)
    expect(screen.getByText('Create new workspace')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<WorkspaceSwitcherModal {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search workspaces...')).toBeInTheDocument()
  })

  it('calls onWorkspaceSwitch when workspace is clicked', () => {
    render(<WorkspaceSwitcherModal {...defaultProps} />)
    screen.getByText('Workspace A').closest('button')!.click()
    expect(defaultProps.onWorkspaceSwitch).toHaveBeenCalledWith('ws-a')
  })

  it('calls onCreateWorkspace when create button is clicked', () => {
    render(<WorkspaceSwitcherModal {...defaultProps} />)
    screen.getByText('Create new workspace').closest('button')!.click()
    expect(defaultProps.onCreateWorkspace).toHaveBeenCalled()
  })

  it('highlights current workspace', () => {
    render(<WorkspaceSwitcherModal {...defaultProps} />)
    const currentWs = screen.getByText('Workspace A').closest('button')!
    expect(currentWs.className).toContain('bg-accent')
  })
})
