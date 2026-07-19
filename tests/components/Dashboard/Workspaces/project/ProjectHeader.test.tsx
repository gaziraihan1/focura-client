import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectHeader } from '@/components/Dashboard/Workspaces/project/ProjectHeader'

vi.mock('@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/page', () => ({
  formatDate: (d: string) => 'Jan 1, 2025',
}))

vi.mock('@/components/Dashboard/Workspaces/project/MemberAvatars', () => ({
  MemberAvatars: ({ members }: any) => <div data-testid="member-avatars" />,
}))

vi.mock('@/components/Dashboard/Workspaces/project/ProgressRing', () => ({
  ProgressRing: ({ pct }: any) => <svg data-testid="progress-ring" data-pct={pct} />,
}))

vi.mock('lucide-react', () => ({
  Activity: (props: any) => <svg data-testid="activity" {...props} />,
  Calendar: (props: any) => <svg data-testid="calendar" {...props} />,
  Target: (props: any) => <svg data-testid="target" {...props} />,
}))

const mockProject = {
  id: 'proj-1',
  name: 'Test Project',
  slug: 'test-proj',
  description: 'A test project',
  color: '#667eea',
  status: 'ACTIVE',
  priority: 'MEDIUM',
  createdAt: '2025-01-01',
  members: [],
  _count: { tasks: 0 },
  isAdmin: true,
}

describe('ProjectHeader', () => {
  it('renders project name', () => {
    render(
      <ProjectHeader
        project={mockProject as any}
        accentColor="#667eea"
        completionPct={75}
        isOverdue={false}
        dueLabel="Due Jan 30"
        totalMembers={3}
      />
    )
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders project description', () => {
    render(
      <ProjectHeader
        project={mockProject as any}
        accentColor="#667eea"
        completionPct={75}
        isOverdue={false}
        dueLabel="Due Jan 30"
        totalMembers={3}
      />
    )
    expect(screen.getByText('A test project')).toBeInTheDocument()
  })

  it('renders the completion percentage', () => {
    render(
      <ProjectHeader
        project={mockProject as any}
        accentColor="#667eea"
        completionPct={75}
        isOverdue={false}
        dueLabel="Due Jan 30"
        totalMembers={3}
      />
    )
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders member count', () => {
    render(
      <ProjectHeader
        project={mockProject as any}
        accentColor="#667eea"
        completionPct={75}
        isOverdue={false}
        dueLabel="Due Jan 30"
        totalMembers={3}
      />
    )
    expect(screen.getByText('3 members')).toBeInTheDocument()
  })
})
