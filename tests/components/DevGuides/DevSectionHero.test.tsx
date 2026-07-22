import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DevSectionHero, DevSectionPagination } from '@/components/DevGuides/DevSectionHero'
import type { DevSection } from '@/lib/devGuides'

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}))

const section: DevSection = {
  id: 'overview',
  icon: '◈',
  label: 'Overview',
  color: 'blue',
  title: 'Developer Overview',
  subtitle: 'Stack, architecture goals & repo structure',
}

const sections: DevSection[] = [
  { id: 'overview', icon: '◈', label: 'Overview', color: 'blue', title: 'Overview', subtitle: 'Stack' },
  { id: 'setup', icon: '⚙', label: 'Local Setup', color: 'emerald', title: 'Setup', subtitle: 'Get running' },
  { id: 'frontend', icon: '◉', label: 'Frontend', color: 'violet', title: 'Frontend', subtitle: 'Architecture' },
]

// ─── DevSectionHero ─────────────────────────────────────────────────────────

describe('DevSectionHero', () => {
  it('renders the section title', () => {
    render(<DevSectionHero section={section} />)
    expect(screen.getByText('Developer Overview')).toBeInTheDocument()
  })

  it('renders the section subtitle', () => {
    render(<DevSectionHero section={section} />)
    expect(screen.getByText('Stack, architecture goals & repo structure')).toBeInTheDocument()
  })

  it('renders the section icon', () => {
    render(<DevSectionHero section={section} />)
    expect(screen.getByText('◈')).toBeInTheDocument()
  })

  it('renders badge when provided', () => {
    const withBadge: DevSection = { ...section, badge: 'NEW' }
    render(<DevSectionHero section={withBadge} />)
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('does not render badge when not provided', () => {
    render(<DevSectionHero section={section} />)
    expect(screen.queryByText('NEW')).not.toBeInTheDocument()
  })

  it('applies color classes from COLOR_MAP', () => {
    const { container } = render(<DevSectionHero section={section} />)
    const hero = container.firstChild as HTMLElement
    expect(hero.className).toContain('bg-blue-50')
    expect(hero.className).toContain('border-blue-200')
  })

  it('applies different color for emerald section', () => {
    const emeraldSection: DevSection = { ...section, color: 'emerald' }
    const { container } = render(<DevSectionHero section={emeraldSection} />)
    const hero = container.firstChild as HTMLElement
    expect(hero.className).toContain('bg-emerald-50')
  })

  it('applies text color class to title', () => {
    render(<DevSectionHero section={section} />)
    const title = screen.getByText('Developer Overview')
    expect(title.className).toContain('text-blue-600')
  })

  it('applies pill class to badge', () => {
    const withBadge: DevSection = { ...section, badge: 'BETA', color: 'violet' }
    render(<DevSectionHero section={withBadge} />)
    const badge = screen.getByText('BETA')
    expect(badge.className).toContain('bg-violet-100')
  })
})

// ─── DevSectionPagination ───────────────────────────────────────────────────

describe('DevSectionPagination', () => {
  const onNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Previous and Next buttons when in middle', () => {
    render(<DevSectionPagination sections={sections} activeId="setup" onNavigate={onNavigate} />)
    expect(screen.getByText(/Previous/)).toBeInTheDocument()
    expect(screen.getByText(/Next/)).toBeInTheDocument()
  })

  it('renders section labels for prev and next', () => {
    render(<DevSectionPagination sections={sections} activeId="setup" onNavigate={onNavigate} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Frontend')).toBeInTheDocument()
  })

  it('calls onNavigate with previous section id', () => {
    render(<DevSectionPagination sections={sections} activeId="setup" onNavigate={onNavigate} />)
    fireEvent.click(screen.getByText('Overview'))
    expect(onNavigate).toHaveBeenCalledWith('overview')
  })

  it('calls onNavigate with next section id', () => {
    render(<DevSectionPagination sections={sections} activeId="setup" onNavigate={onNavigate} />)
    fireEvent.click(screen.getByText('Frontend'))
    expect(onNavigate).toHaveBeenCalledWith('frontend')
  })

  it('does not render Previous when on first section', () => {
    render(<DevSectionPagination sections={sections} activeId="overview" onNavigate={onNavigate} />)
    expect(screen.queryByText(/Previous/)).not.toBeInTheDocument()
  })

  it('does not render Next when on last section', () => {
    render(<DevSectionPagination sections={sections} activeId="frontend" onNavigate={onNavigate} />)
    expect(screen.queryByText(/Next/)).not.toBeInTheDocument()
  })

  it('renders nothing for prev/next when only one section', () => {
    const single = [sections[0]]
    render(<DevSectionPagination sections={single} activeId="overview" onNavigate={onNavigate} />)
    expect(screen.queryByText(/Previous/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Next/)).not.toBeInTheDocument()
  })

  it('renders the arrow symbols', () => {
    render(<DevSectionPagination sections={sections} activeId="setup" onNavigate={onNavigate} />)
    expect(screen.getByText(/← Previous/)).toBeInTheDocument()
    expect(screen.getByText(/Next →/)).toBeInTheDocument()
  })
})
