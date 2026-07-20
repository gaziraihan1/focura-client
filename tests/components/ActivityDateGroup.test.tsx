import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActivityDateGroup } from '@/components/Dashboard/ActivityLogs/ActivityDateGroup'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 hours ago',
}))

vi.mock('lucide-react', () => ({
  Plus: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Pencil: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Trash2: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  CheckCircle2: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Users: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  MessageSquare: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  ArrowRightLeft: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Circle: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  FileText: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  FolderKanban: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

const mockActivity = {
  id: '1',
  action: 'CREATED',
  entityType: 'TASK',
  entityId: 'task-1',
  createdAt: new Date().toISOString(),
  user: { id: 'u1', name: 'John', image: null },
  workspace: { id: 'ws1', name: 'My Workspace' },
  task: { id: 'task-1', title: 'Test Task', project: null },
  metadata: null,
}

describe('ActivityDateGroup', () => {
  it('renders the date label', () => {
    render(
      <ActivityDateGroup
        date="Today"
        activities={[mockActivity as any as Record<string, unknown>]}
      />
    )
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('renders activity count', () => {
    render(
      <ActivityDateGroup
        date="Today"
        activities={[mockActivity as any as Record<string, unknown>]}
      />
    )
    expect(screen.getByText('1 activity')).toBeInTheDocument()
  })

  it('renders plural for multiple activities', () => {
    render(
      <ActivityDateGroup
        date="Today"
        activities={[mockActivity, { ...mockActivity, id: '2' }] as any[]}
      />
    )
    expect(screen.getByText('2 activities')).toBeInTheDocument()
  })

  it('renders activity items', () => {
    render(
      <ActivityDateGroup
        date="Today"
        activities={[mockActivity as any as Record<string, unknown>]}
      />
    )
    expect(screen.getByText('John')).toBeInTheDocument()
  })
})
