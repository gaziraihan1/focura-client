import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DevGuideHeader } from '@/components/DevGuides/DevGuideHeader'
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

describe('DevGuideHeader', () => {
  it('renders the Focura brand', () => {
    render(<DevGuideHeader current={section} mobileOpen={false} onMobileToggle={vi.fn()} />)
    expect(screen.getByText('Focura')).toBeInTheDocument()
  })

  it('renders the breadcrumb text', () => {
    render(<DevGuideHeader current={section} mobileOpen={false} onMobileToggle={vi.fn()} />)
    expect(screen.getByText('Developer Guide')).toBeInTheDocument()
  })

  it('renders the separator slash', () => {
    render(<DevGuideHeader current={section} mobileOpen={false} onMobileToggle={vi.fn()} />)
    expect(screen.getByText('/')).toBeInTheDocument()
  })

  it('renders current section label on desktop', () => {
    render(<DevGuideHeader current={section} mobileOpen={false} onMobileToggle={vi.fn()} />)
    const labels = screen.getAllByText('Overview')
    expect(labels.length).toBeGreaterThanOrEqual(1)
  })

  it('renders current section icon', () => {
    render(<DevGuideHeader current={section} mobileOpen={false} onMobileToggle={vi.fn()} />)
    expect(screen.getAllByText('◈').length).toBeGreaterThanOrEqual(1)
  })

  it('calls onMobileToggle when mobile button is clicked', () => {
    const toggle = vi.fn()
    render(<DevGuideHeader current={section} mobileOpen={false} onMobileToggle={toggle} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(toggle).toHaveBeenCalledTimes(1)
  })

  it('applies rotate-180 class to chevron when mobileOpen is true', () => {
    render(<DevGuideHeader current={section} mobileOpen={true} onMobileToggle={vi.fn()} />)
    const svg = screen.getAllByRole('button')[0].querySelector('svg')
    expect(svg?.className.baseVal).toContain('rotate-180')
  })

  it('does not apply rotate-180 class to chevron when mobileOpen is false', () => {
    render(<DevGuideHeader current={section} mobileOpen={false} onMobileToggle={vi.fn()} />)
    const svg = screen.getAllByRole('button')[0].querySelector('svg')
    expect(svg?.className.baseVal).not.toContain('rotate-180')
  })

  it('applies color text class from COLOR_MAP to icon', () => {
    render(<DevGuideHeader current={section} mobileOpen={false} onMobileToggle={vi.fn()} />)
    const icons = screen.getAllByText('◈')
    const colored = icons.find(s => s.className.includes('text-blue-600'))
    expect(colored).toBeInTheDocument()
  })

  it('renders with different section colors', () => {
    const emeraldSection: DevSection = {
      ...section,
      color: 'emerald',
      label: 'Setup',
    }
    render(<DevGuideHeader current={emeraldSection} mobileOpen={false} onMobileToggle={vi.fn()} />)
    const icons = screen.getAllByText('◈')
    const colored = icons.find(s => s.className.includes('text-emerald-600'))
    expect(colored).toBeInTheDocument()
  })
})
