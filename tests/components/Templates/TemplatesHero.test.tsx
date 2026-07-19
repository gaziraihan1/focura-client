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


import TemplatesHero from '@/components/Templates/TemplatesHero'

describe('TemplatesHero', () => {
  const onSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the hero title', () => {
    render(<TemplatesHero onSearch={onSearch} />)
    expect(screen.getByText('Start fast.')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<TemplatesHero onSearch={onSearch} />)
    expect(screen.getByText('Ship with confidence.')).toBeInTheDocument()
  })

  it('renders the badge', () => {
    render(<TemplatesHero onSearch={onSearch} />)
    expect(screen.getByText('Project Templates \u2014 Coming Soon')).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<TemplatesHero onSearch={onSearch} />)
    expect(screen.getByPlaceholderText(/Search templates/)).toBeInTheDocument()
  })

  it('calls onSearch when typing', () => {
    render(<TemplatesHero onSearch={onSearch} />)
    const input = screen.getByPlaceholderText(/Search templates/)
    fireEvent.change(input, { target: { value: 'sprint' } })
    expect(onSearch).toHaveBeenCalledWith('sprint')
  })

  it('renders stat pills', () => {
    render(<TemplatesHero onSearch={onSearch} />)
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('9+')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Click to import')).toBeInTheDocument()
  })
})
