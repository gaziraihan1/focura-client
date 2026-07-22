import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DevGuideSidebar } from '@/components/DevGuides/DevGuideSidebar'
import type { DevSection } from '@/lib/devGuides'

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}))

const sections: DevSection[] = [
  { id: 'overview', icon: '◈', label: 'Overview', color: 'blue', title: 'Overview', subtitle: 'Stack' },
  { id: 'setup', icon: '⚙', label: 'Local Setup', color: 'emerald', title: 'Setup', subtitle: 'Get running' },
  { id: 'frontend', icon: '◉', label: 'Frontend', color: 'violet', title: 'Frontend', subtitle: 'Architecture' },
]

describe('DevGuideSidebar', () => {
  const onNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all section labels', () => {
    render(<DevGuideSidebar sections={sections} activeId="overview" mobileOpen={false} onNavigate={onNavigate} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Local Setup')).toBeInTheDocument()
    expect(screen.getByText('Frontend')).toBeInTheDocument()
  })

  it('renders the Topics header', () => {
    render(<DevGuideSidebar sections={sections} activeId="overview" mobileOpen={false} onNavigate={onNavigate} />)
    expect(screen.getByText('Topics')).toBeInTheDocument()
  })

  it('renders section icons', () => {
    render(<DevGuideSidebar sections={sections} activeId="overview" mobileOpen={false} onNavigate={onNavigate} />)
    expect(screen.getAllByText('◈').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('⚙').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('◉').length).toBeGreaterThanOrEqual(1)
  })

  it('calls onNavigate with correct id when a section is clicked', () => {
    render(<DevGuideSidebar sections={sections} activeId="overview" mobileOpen={false} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByText('Local Setup'))
    expect(onNavigate).toHaveBeenCalledWith('setup')
  })

  it('calls onNavigate for each section', () => {
    render(<DevGuideSidebar sections={sections} activeId="overview" mobileOpen={false} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByText('Frontend'))
    expect(onNavigate).toHaveBeenCalledWith('frontend')
  })

  it('applies active styling to the active section', () => {
    render(<DevGuideSidebar sections={sections} activeId="setup" mobileOpen={false} onNavigate={onNavigate} />)
    const buttons = screen.getAllByRole('button')
    const activeBtn = buttons.find(b => b.textContent?.includes('Local Setup'))
    expect(activeBtn?.className).toContain('font-medium')
  })

  it('does not apply active styling to inactive sections', () => {
    render(<DevGuideSidebar sections={sections} activeId="setup" mobileOpen={false} onNavigate={onNavigate} />)
    const buttons = screen.getAllByRole('button')
    const inactiveBtn = buttons.find(b => b.textContent?.includes('Overview'))
    expect(inactiveBtn?.className).not.toContain('font-medium')
  })

  it('shows mobile overlay when mobileOpen is true', () => {
    render(<DevGuideSidebar sections={sections} activeId="overview" mobileOpen={true} onNavigate={onNavigate} />)
    const labels = screen.getAllByText('Overview')
    expect(labels.length).toBeGreaterThanOrEqual(2)
  })

  it('does not show mobile overlay when mobileOpen is false', () => {
    render(<DevGuideSidebar sections={sections} activeId="overview" mobileOpen={false} onNavigate={onNavigate} />)
    const labels = screen.getAllByText('Overview')
    expect(labels.length).toBe(1)
  })

  it('calls onNavigate from mobile nav item', () => {
    render(<DevGuideSidebar sections={sections} activeId="overview" mobileOpen={true} onNavigate={onNavigate} />)
    const mobileButtons = screen.getAllByRole('button')
    const mobileSetup = mobileButtons.find(b => b.textContent?.includes('Local Setup') && b.className.includes('rounded-xl'))
    fireEvent.click(mobileSetup!)
    expect(onNavigate).toHaveBeenCalledWith('setup')
  })

  it('applies active styling to mobile active item', () => {
    render(<DevGuideSidebar sections={sections} activeId="setup" mobileOpen={true} onNavigate={onNavigate} />)
    const mobileButtons = screen.getAllByRole('button')
    const activeMobile = mobileButtons.find(b =>
      b.textContent?.includes('Local Setup') && b.className.includes('rounded-xl')
    )
    expect(activeMobile?.className).toContain('bg-emerald-50')
  })

  it('applies color classes based on section color', () => {
    render(<DevGuideSidebar sections={sections} activeId="overview" mobileOpen={false} onNavigate={onNavigate} />)
    const buttons = screen.getAllByRole('button')
    const activeBtn = buttons.find(b => b.textContent?.includes('Overview'))
    expect(activeBtn?.className).toContain('text-blue-600')
  })
})
