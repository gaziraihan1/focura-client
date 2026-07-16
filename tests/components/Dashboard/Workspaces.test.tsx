import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import { RoleBadge } from '@/components/Dashboard/Workspaces/TeamPage/RoleBadge'
import { EmptyState } from '@/components/Dashboard/Workspaces/TeamPage/EmptyState'
import { StatsCards } from '@/components/Dashboard/Workspaces/TeamPage/StatsCard'
import Tabs from '@/components/Dashboard/Workspaces/TeamPage/Tabs'
import WorkspaceEmptyState from '@/components/Dashboard/Workspaces/EmptyState'
import { WorkspaceHeader } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceHeader'
import { WorkspaceStats } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceStats'
import WorkspaceInformation from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceInformation'
import WorkspaceStorageInfo from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceStorageInfo'
import { WorkspaceTabNavigation } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceTabNavigation'
import { RoleDropdown } from '@/components/Dashboard/Workspaces/TeamPage/RoleDropdown'
import { AnnouncementEmptyState } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementEmptyState'
import { AnnouncementList } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementList'
import { Section } from '@/components/Dashboard/Workspaces/project/Settings/Section'
import { PriorityBadge } from '@/components/Dashboard/Workspaces/project/Tasks/PriorityBadge'
import { Assignees } from '@/components/Dashboard/Workspaces/project/Tasks/Assignees'

const mockMember = {
  id: 'member-1',
  userId: 'user-1',
  displayName: 'John Doe',
  role: 'MEMBER',
  joinedAt: '2026-01-15T00:00:00Z',
  user: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@test.com',
    image: null,
  },
}

const mockStats = {
  totalMembers: 10,
  totalProjects: 5,
  adminCount: 2,
  managerCount: 3,
}

const mockWorkspaceStats = {
  totalProjects: 5,
  completedTasks: 25,
  completionRate: 75,
  overdueTasks: 3,
  totalMembers: 10,
}

describe('Workspaces/TeamPage/RoleBadge', () => {
  it('renders OWNER role', () => {
    render(<RoleBadge role="OWNER" />, { wrapper: createWrapper() })
    expect(screen.getByText('Owner')).toBeInTheDocument()
  })

  it('renders ADMIN role', () => {
    render(<RoleBadge role="ADMIN" />, { wrapper: createWrapper() })
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders MEMBER role', () => {
    render(<RoleBadge role="MEMBER" />, { wrapper: createWrapper() })
    expect(screen.getByText('Member')).toBeInTheDocument()
  })

  it('renders GUEST role', () => {
    render(<RoleBadge role="GUEST" />, { wrapper: createWrapper() })
    expect(screen.getByText('Guest')).toBeInTheDocument()
  })

  it('renders MANAGER role', () => {
    render(<RoleBadge role="MANAGER" />, { wrapper: createWrapper() })
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('renders COLLABORATOR role', () => {
    render(<RoleBadge role="COLLABORATOR" />, { wrapper: createWrapper() })
    expect(screen.getByText('Collaborator')).toBeInTheDocument()
  })

  it('renders VIEWER role', () => {
    render(<RoleBadge role="VIEWER" />, { wrapper: createWrapper() })
    expect(screen.getByText('Viewer')).toBeInTheDocument()
  })

  it('renders compact badge', () => {
    render(<RoleBadge role="ADMIN" compact={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})

describe('Workspaces/TeamPage/EmptyState', () => {
  it('renders empty state with icon', () => {
    const MockIcon = () => <span>Icon</span>
    render(<EmptyState icon={MockIcon} title="No members" />, { wrapper: createWrapper() })
    expect(screen.getByText('No members')).toBeInTheDocument()
    expect(screen.getByText('Icon')).toBeInTheDocument()
  })

  it('renders empty state with description', () => {
    const MockIcon = () => <span>Icon</span>
    render(
      <EmptyState icon={MockIcon} title="No members" description="Add members to get started" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('No members')).toBeInTheDocument()
    expect(screen.getByText('Add members to get started')).toBeInTheDocument()
  })

  it('renders empty state without description', () => {
    const MockIcon = () => <span>Icon</span>
    render(<EmptyState icon={MockIcon} title="No members" />, { wrapper: createWrapper() })
    expect(screen.queryByText('Add members to get started')).not.toBeInTheDocument()
  })
})

describe('Workspaces/TeamPage/StatsCards', () => {
  it('renders all stat cards', () => {
    render(<StatsCards stats={mockStats} />, { wrapper: createWrapper() })
    expect(screen.getByText('Total Members')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Admins')).toBeInTheDocument()
    expect(screen.getByText('Project Managers')).toBeInTheDocument()
  })

  it('renders stat values', () => {
    render(<StatsCards stats={mockStats} />, { wrapper: createWrapper() })
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders with zero stats', () => {
    const zeroStats = {
      totalMembers: 0,
      totalProjects: 0,
      adminCount: 0,
      managerCount: 0,
    }
    render(<StatsCards stats={zeroStats} />, { wrapper: createWrapper() })
    expect(screen.getByText('Total Members')).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
  })
})

describe('Workspaces/TeamPage/Tabs', () => {
  const mockTabs = [
    { id: 'members' as const, label: 'Members' },
    { id: 'projects' as const, label: 'Projects' },
  ]

  it('renders tabs', () => {
    render(
      <Tabs
        tabs={mockTabs}
        activeTab="members"
        onActiveTab={vi.fn()}
        members={[mockMember] as any}
        projects={[]}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('renders member count', () => {
    render(
      <Tabs
        tabs={mockTabs}
        activeTab="members"
        onActiveTab={vi.fn()}
        members={[mockMember] as any}
        projects={[]}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls onActiveTab when tab is clicked', async () => {
    const onActiveTab = vi.fn()
    render(
      <Tabs
        tabs={mockTabs}
        activeTab="members"
        onActiveTab={onActiveTab}
        members={[]}
        projects={[]}
      />,
      { wrapper: createWrapper() }
    )
    const projectsTab = screen.getByText('Projects')
    await projectsTab.click()
    expect(onActiveTab).toHaveBeenCalledWith('projects')
  })

  it('highlights active tab', () => {
    render(
      <Tabs
        tabs={mockTabs}
        activeTab="members"
        onActiveTab={vi.fn()}
        members={[]}
        projects={[]}
      />,
      { wrapper: createWrapper() }
    )
    const membersTab = screen.getByText('Members')
    expect(membersTab).toHaveClass('border-foreground')
  })
})

describe('Workspaces/EmptyState', () => {
  it('renders workspace not found', () => {
    render(<WorkspaceEmptyState />, { wrapper: createWrapper() })
    expect(screen.getByText('Workspace not found')).toBeInTheDocument()
  })

  it('renders back to workspaces link', () => {
    render(<WorkspaceEmptyState />, { wrapper: createWrapper() })
    expect(screen.getByText('Back to Workspaces')).toBeInTheDocument()
  })

  it('has correct link href', () => {
    render(<WorkspaceEmptyState />, { wrapper: createWrapper() })
    const link = screen.getByText('Back to Workspaces')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces')
  })
})

describe('Workspaces/WorkspacePage/WorkspaceHeader', () => {
  const defaultProps = {
    workspaceName: 'Test Workspace',
    workspaceSlug: 'test-workspace',
    workspacePlan: 'PRO',
    canCreateProjects: true,
    isAdmin: true,
    isOwner: true,
  }

  it('renders workspace name', () => {
    render(<WorkspaceHeader {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Workspace')).toBeInTheDocument()
  })

  it('renders workspace slug', () => {
    render(<WorkspaceHeader {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('/test-workspace')).toBeInTheDocument()
  })

  it('renders plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('renders free plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="FREE" />, { wrapper: createWrapper() })
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renders business plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="BUSINESS" />, { wrapper: createWrapper() })
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('renders enterprise plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="ENTERPRISE" />, { wrapper: createWrapper() })
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('renders new project button when canCreateProjects is true', () => {
    render(<WorkspaceHeader {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getAllByText('New Project').length).toBeGreaterThan(0)
  })

  it('does not render new project button when canCreateProjects is false', () => {
    render(<WorkspaceHeader {...defaultProps} canCreateProjects={false} />, { wrapper: createWrapper() })
    expect(screen.queryByText('New Project')).not.toBeInTheDocument()
  })

  it('renders settings button when isAdmin is true', () => {
    render(<WorkspaceHeader {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('does not render settings button when not admin', () => {
    render(<WorkspaceHeader {...defaultProps} isAdmin={false} isOwner={false} />, { wrapper: createWrapper() })
    expect(screen.queryByLabelText('Settings')).not.toBeInTheDocument()
  })

  it('renders workspace description', () => {
    render(<WorkspaceHeader {...defaultProps} workspaceDescription="A test workspace" />, { wrapper: createWrapper() })
    expect(screen.getByText('A test workspace')).toBeInTheDocument()
  })

  it('renders workspace logo', () => {
    render(<WorkspaceHeader {...defaultProps} workspaceLogo="T" />, { wrapper: createWrapper() })
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders workspace color', () => {
    render(<WorkspaceHeader {...defaultProps} workspaceColor="#ff0000" />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Workspace')).toBeInTheDocument()
  })
})

describe('Workspaces/WorkspacePage/WorkspaceStats', () => {
  it('renders all stat cards', () => {
    render(<WorkspaceStats stats={mockWorkspaceStats} maxMembers={20} />, { wrapper: createWrapper() })
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
  })

  it('renders stat values', () => {
    render(<WorkspaceStats stats={mockWorkspaceStats} maxMembers={20} />, { wrapper: createWrapper() })
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders completion rate', () => {
    render(<WorkspaceStats stats={mockWorkspaceStats} maxMembers={20} />, { wrapper: createWrapper() })
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders max members', () => {
    render(<WorkspaceStats stats={mockWorkspaceStats} maxMembers={20} />, { wrapper: createWrapper() })
    expect(screen.getByText('20 max')).toBeInTheDocument()
  })
})

describe('Workspaces/WorkspacePage/WorkspaceInformation', () => {
  it('renders owner name', () => {
    render(
      <WorkspaceInformation
        name="John Doe"
        createdAt="2026-01-15T00:00:00Z"
        isPublic={true}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders email when name is null', () => {
    render(
      <WorkspaceInformation
        name={null}
        email="john@test.com"
        createdAt="2026-01-15T00:00:00Z"
        isPublic={true}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
  })

  it('renders created date', () => {
    render(
      <WorkspaceInformation
        name="John Doe"
        createdAt="2026-01-15T00:00:00Z"
        isPublic={true}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Jan 15, 2026')).toBeInTheDocument()
  })

  it('renders public visibility', () => {
    render(
      <WorkspaceInformation
        name="John Doe"
        createdAt="2026-01-15T00:00:00Z"
        isPublic={true}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('renders private visibility', () => {
    render(
      <WorkspaceInformation
        name="John Doe"
        createdAt="2026-01-15T00:00:00Z"
        isPublic={false}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Private')).toBeInTheDocument()
  })
})

describe('Workspaces/WorkspacePage/WorkspaceStorageInfo', () => {
  it('renders storage info', () => {
    render(<WorkspaceStorageInfo maxStorage={1000} />, { wrapper: createWrapper() })
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByText('0 MB / 1000 MB')).toBeInTheDocument()
  })
})

describe('Workspaces/WorkspacePage/WorkspaceTabNavigation', () => {
  it('renders all tabs', () => {
    render(<WorkspaceTabNavigation activeTab="overview" onTabChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
  })

  it('calls onTabChange when tab is clicked', async () => {
    const onTabChange = vi.fn()
    render(<WorkspaceTabNavigation activeTab="overview" onTabChange={onTabChange} />, { wrapper: createWrapper() })
    const projectsTab = screen.getByText('Projects')
    await projectsTab.click()
    expect(onTabChange).toHaveBeenCalledWith('projects')
  })

  it('highlights active tab', () => {
    render(<WorkspaceTabNavigation activeTab="overview" onTabChange={vi.fn()} />, { wrapper: createWrapper() })
    const overviewTab = screen.getByText('Overview')
    expect(overviewTab).toHaveClass('border-primary')
  })
})

describe('Workspaces/TeamPage/RoleDropdown', () => {
  it('renders role dropdown', () => {
    render(
      <RoleDropdown
        variant="workspace"
        currentRole="MEMBER"
        disabled={false}
        disabledReason=""
        onChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Member')).toBeInTheDocument()
  })

  it('renders disabled state', () => {
    render(
      <RoleDropdown
        variant="workspace"
        currentRole="MEMBER"
        disabled={true}
        disabledReason="Cannot change role"
        onChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Member')).toBeInTheDocument()
  })
})

describe('Workspaces/Announcement/AnnouncementEmptyState', () => {
  it('renders announcement empty state', () => {
    render(<AnnouncementEmptyState />, { wrapper: createWrapper() })
    expect(screen.getByText('No announcements yet')).toBeInTheDocument()
  })
})

describe('Workspaces/Announcement/AnnouncementList', () => {
  it('renders announcement list', () => {
    render(
      <AnnouncementList
        announcements={[]}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('No announcements yet')).toBeInTheDocument()
  })
})

describe('Workspaces/project/Settings/Section', () => {
  it('renders section', () => {
    render(
      <Section title="General Settings" description="Manage your workspace settings">
        <div>Content</div>
      </Section>,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('General Settings')).toBeInTheDocument()
    expect(screen.getByText('Manage your workspace settings')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

describe('Workspaces/project/Tasks/PriorityBadge', () => {
  it('renders urgent priority', () => {
    render(<PriorityBadge priority="URGENT" />, { wrapper: createWrapper() })
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('renders high priority', () => {
    render(<PriorityBadge priority="HIGH" />, { wrapper: createWrapper() })
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders medium priority', () => {
    render(<PriorityBadge priority="MEDIUM" />, { wrapper: createWrapper() })
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('renders low priority', () => {
    render(<PriorityBadge priority="LOW" />, { wrapper: createWrapper() })
    expect(screen.getByText('Low')).toBeInTheDocument()
  })
})

describe('Workspaces/project/Tasks/Assignees', () => {
  it('renders assignees', () => {
    const assignees = [
      { id: 'user-1', name: 'John Doe', user: { id: 'user-1', name: 'John Doe', image: null } },
    ]
    render(<Assignees assignees={assignees} />, { wrapper: createWrapper() })
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renders multiple assignees', () => {
    const assignees = [
      { id: 'user-1', name: 'John Doe', user: { id: 'user-1', name: 'John Doe', image: null } },
      { id: 'user-2', name: 'Jane Smith', user: { id: 'user-2', name: 'Jane Smith', image: null } },
    ]
    render(<Assignees assignees={assignees} />, { wrapper: createWrapper() })
    expect(screen.getAllByText(/J/).length).toBeGreaterThanOrEqual(2)
  })

  it('renders empty assignees', () => {
    render(<Assignees assignees={[]} />, { wrapper: createWrapper() })
    expect(screen.queryByText('J')).not.toBeInTheDocument()
  })
})
