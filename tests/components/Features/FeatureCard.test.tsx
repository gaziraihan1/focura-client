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

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 days ago',
}))

vi.mock('@/hooks/useFeatures', () => ({
  useCastVote: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateFeatureStatus: () => ({ mutate: vi.fn(), isPending: false }),
  useCreateFeatureRequest: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: any) => <div data-testid="avatar">{name}</div>,
}))


import { FeatureCard } from '@/components/Features/AllFeatures/FeatureCard'

describe('FeatureCard', () => {
  const baseFeature = {
    id: 'f1',
    title: 'Test Feature',
    description: 'A short description for testing the feature card component.',
    status: 'APPROVED' as const,
    adminNote: 'We like this idea.',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: { id: 'u1', name: 'John Doe', image: null },
    _count: { upvotes: 10, downvotes: 3 },
    userVote: null,
  }

  const onDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the feature title', () => {
    render(<FeatureCard feature={baseFeature} isAdmin={false} isDeleting={false} onDelete={onDelete} index={0} />)
    expect(screen.getByText('Test Feature')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<FeatureCard feature={baseFeature} isAdmin={false} isDeleting={false} onDelete={onDelete} index={0} />)
    expect(screen.getByText(/A short description/)).toBeInTheDocument()
  })

  it('renders admin note when present', () => {
    render(<FeatureCard feature={baseFeature} isAdmin={false} isDeleting={false} onDelete={onDelete} index={0} />)
    expect(screen.getByText('Admin note:')).toBeInTheDocument()
    expect(screen.getByText('We like this idea.')).toBeInTheDocument()
  })

  it('renders creator name and avatar', () => {
    render(<FeatureCard feature={baseFeature} isAdmin={false} isDeleting={false} onDelete={onDelete} index={0} />)
    const johnDoeElements = screen.getAllByText('John Doe')
    expect(johnDoeElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('2 days ago')).toBeInTheDocument()
  })

  it('renders delete button when admin', () => {
    render(<FeatureCard feature={baseFeature} isAdmin={true} isDeleting={false} onDelete={onDelete} index={0} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('shows "Awaiting review" for PENDING status', () => {
    render(
      <FeatureCard
        feature={{ ...baseFeature, status: 'PENDING' }}
        isAdmin={false}
        isDeleting={false}
        onDelete={onDelete}
        index={0}
      />
    )
    expect(screen.getByText('Awaiting review')).toBeInTheDocument()
  })

  it('shows "Read more" for long descriptions', () => {
    const longFeature = {
      ...baseFeature,
      description: 'A'.repeat(200),
    }
    render(<FeatureCard feature={longFeature} isAdmin={false} isDeleting={false} onDelete={onDelete} index={0} />)
    expect(screen.getByText('Read more')).toBeInTheDocument()
  })

  it('expands description on "Read more" click', () => {
    const longFeature = {
      ...baseFeature,
      description: 'A'.repeat(200),
    }
    render(<FeatureCard feature={longFeature} isAdmin={false} isDeleting={false} onDelete={onDelete} index={0} />)
    fireEvent.click(screen.getByText('Read more'))
    expect(screen.getByText('Show less')).toBeInTheDocument()
  })
})
