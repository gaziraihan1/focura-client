import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Polyfill IntersectionObserver for jsdom
beforeAll(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error jsdom does not support IntersectionObserver
  globalThis.IntersectionObserver = MockIntersectionObserver
})

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: any) => {
    const { fill, ...rest } = props
    return <img {...rest} data-fill={fill} />
  },
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: any) => <svg data-testid={`${name}-icon`} {...props} />
    Component.displayName = name
    return Component
  }
  return {
    ShieldCheck: icon('ShieldCheck'),
    Scale: icon('Scale'),
    Cookie: icon('Cookie'),
    ReceiptText: icon('ReceiptText'),
    Layers: icon('Layers'),
    Search: icon('Search'),
    Bell: icon('Bell'),
    CheckCircle2: icon('CheckCircle2'),
    Loader2: icon('Loader2'),
    Mail: icon('Mail'),
    Clock: icon('Clock'),
    CreditCard: icon('CreditCard'),
    Calendar: icon('Calendar'),
    FileText: icon('FileText'),
    MessageSquare: icon('MessageSquare'),
    Copy: icon('Copy'),
    User: icon('User'),
    ChevronDown: icon('ChevronDown'),
    ChevronUp: icon('ChevronUp'),
    ExternalLink: icon('ExternalLink'),
    Database: icon('Database'),
    Settings2: icon('Settings2'),
    Share2: icon('Share2'),
    Globe: icon('Globe'),
    Lock: icon('Lock'),
    UserCog: icon('UserCog'),
    Baby: icon('Baby'),
    RefreshCw: icon('RefreshCw'),
    Eye: icon('Eye'),
    Pencil: icon('Pencil'),
    Trash2: icon('Trash2'),
    Download: icon('Download'),
    Ban: icon('Ban'),
    HandMetal: icon('HandMetal'),
    Megaphone: icon('Megaphone'),
    AlertTriangle: icon('AlertTriangle'),
    Info: icon('Info'),
    CheckCircle: icon('CheckCircle'),
    XCircle: icon('XCircle'),
    Scissors: icon('Scissors'),
    BarChart2: icon('BarChart2'),
    AlertCircle: icon('AlertCircle'),
    ToggleRight: icon('ToggleRight'),
    MonitorSmartphone: icon('MonitorSmartphone'),
    ArrowRight: icon('ArrowRight'),
    Zap: icon('Zap'),
    Rocket: icon('Rocket'),
    MousePointerClick: icon('MousePointerClick'),
    Sparkles: icon('Sparkles'),
    GitFork: icon('GitFork'),
    Star: icon('Star'),
    PlayCircle: icon('PlayCircle'),
    Check: icon('Check'),
    Minus: icon('Minus'),
    Users: icon('Users'),
    Workflow: icon('Workflow'),
    Gauge: icon('Gauge'),
    CloudLightning: icon('CloudLightning'),
    ThumbsUp: icon('ThumbsUp'),
    ThumbsDown: icon('ThumbsDown'),
    X: icon('X'),
    Lightbulb: icon('Lightbulb'),
    BookOpen: icon('BookOpen'),
    UserCheck: icon('UserCheck'),
    Pin: icon('Pin'),
  }
})

vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))


import TemplatesCard from '@/components/Templates/TemplatesCard'

describe('TemplatesCard', () => {
  const mockTemplate = {
    id: 'test-1',
    slug: 'test-template',
    title: 'Test Template',
    description: 'A test template for testing purposes',
    longDescription: 'Long description',
    category: 'engineering' as const,
    complexity: 'starter' as const,
    status: 'coming_soon' as const,
    icon: '\u2699\ufe0f',
    color: '#3b82f6',
    tasks: [
      { title: 'Task 1', status: 'TODO' as const, priority: 'HIGH' as const },
      { title: 'Task 2', status: 'TODO' as const, priority: 'MEDIUM' as const },
      { title: 'Task 3', status: 'TODO' as const, priority: 'LOW' as const },
      { title: 'Task 4', status: 'TODO' as const, priority: 'LOW' as const },
      { title: 'Task 5', status: 'TODO' as const, priority: 'LOW' as const },
    ],
    labels: [
      { name: 'Bug', color: '#ef4444' },
      { name: 'Feature', color: '#3b82f6' },
    ],
    sections: ['Backlog', 'In Progress', 'Done'],
    milestones: [{ title: 'Milestone 1', dueWeek: 1 }],
    views: ['KANBAN', 'LIST'],
    usageCount: 0,
    estimatedSetupMinutes: 5,
    tags: ['test'],
    author: { name: 'Test', role: 'Official' },
  }

  const onNotify = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders template title', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    expect(screen.getByText('Test Template')).toBeInTheDocument()
  })

  it('renders template description', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    expect(screen.getByText('A test template for testing purposes')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    expect(screen.getByText('5 tasks')).toBeInTheDocument()
  })

  it('renders setup time', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    expect(screen.getByText('5 min setup')).toBeInTheDocument()
  })

  it('renders complexity badge', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    expect(screen.getByText('Starter')).toBeInTheDocument()
  })

  it('renders coming soon status', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })

  it('expands and shows preview contents', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    fireEvent.click(screen.getByText('Preview contents'))
    expect(screen.getByText('Hide preview')).toBeInTheDocument()
    expect(screen.getByText('Sections (3)')).toBeInTheDocument()
    expect(screen.getByText('Sample Tasks')).toBeInTheDocument()
  })

  it('collapses after expanding', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    fireEvent.click(screen.getByText('Preview contents'))
    fireEvent.click(screen.getByText('Hide preview'))
    expect(screen.getByText('Preview contents')).toBeInTheDocument()
  })

  it('calls onNotify and shows Notified! when notify button clicked', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    fireEvent.click(screen.getByText('Notify me'))
    expect(onNotify).toHaveBeenCalledWith(mockTemplate)
    expect(screen.getByText('Notified!')).toBeInTheDocument()
  })

  it('renders view labels', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    expect(screen.getByText('Kanban')).toBeInTheDocument()
    expect(screen.getByText('List')).toBeInTheDocument()
  })

  it('shows "+N more tasks\u2026" when > 4 tasks', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    fireEvent.click(screen.getByText('Preview contents'))
    expect(screen.getByText('+1 more tasks\u2026')).toBeInTheDocument()
  })

  it('renders labels section when expanded', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    fireEvent.click(screen.getByText('Preview contents'))
    expect(screen.getByText('Labels (2)')).toBeInTheDocument()
    expect(screen.getByText('Bug')).toBeInTheDocument()
    expect(screen.getByText('Feature')).toBeInTheDocument()
  })

  it('renders milestones when expanded', () => {
    render(<TemplatesCard template={mockTemplate} onNotify={onNotify} />)
    fireEvent.click(screen.getByText('Preview contents'))
    expect(screen.getByText('Milestones')).toBeInTheDocument()
    expect(screen.getByText('Milestone 1')).toBeInTheDocument()
  })
})
