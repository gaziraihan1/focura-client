import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AddMemberModal from '@/components/Dashboard/ProjectDetails/AddMemberModal'

vi.mock('lucide-react', () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader" {...props} />,
}))

vi.mock('@/hooks/useProjects', () => ({
  useAddProjectMember: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

const workspaceMembers = [
  {
    id: 'm1',
    userId: 'u1',
    user: { id: 'u1', name: 'Alice', email: 'alice@test.com', image: '' },
  },
  {
    id: 'm2',
    userId: 'u2',
    user: { id: 'u2', name: 'Bob', email: 'bob@test.com', image: '' },
  },
]

describe('AddMemberModal', () => {
  it('renders the Add Member heading', () => {
    render(
      <AddMemberModal
        projectId="proj-1"
        workspaceMembers={workspaceMembers}
        existingMemberIds={[]}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByRole('heading', { name: 'Add Member' })).toBeInTheDocument()
  })

  it('renders available members in select', () => {
    render(
      <AddMemberModal
        projectId="proj-1"
        workspaceMembers={workspaceMembers}
        existingMemberIds={[]}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByText(/Alice/)).toBeInTheDocument()
    expect(screen.getByText(/Bob/)).toBeInTheDocument()
  })

  it('shows message when all members already added', () => {
    render(
      <AddMemberModal
        projectId="proj-1"
        workspaceMembers={workspaceMembers}
        existingMemberIds={['u1', 'u2']}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByText('All workspace members are already in this project')).toBeInTheDocument()
  })

  it('renders the Cancel button', () => {
    render(
      <AddMemberModal
        projectId="proj-1"
        workspaceMembers={workspaceMembers}
        existingMemberIds={[]}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })
})
