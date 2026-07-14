import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SectionPagination } from '@/components/Guides/SectionPagination'

describe('SectionPagination', () => {
  const sections = [
    { id: 'intro', label: 'Introduction', icon: '📖', color: 'blue' as const },
    { id: 'setup', label: 'Setup', icon: '⚙️', color: 'green' as const },
    { id: 'usage', label: 'Usage', icon: '🚀', color: 'purple' as const },
  ]

  it('renders previous and next buttons', () => {
    const onNavigate = vi.fn()
    render(<SectionPagination sections={sections} activeId="setup" onNavigate={onNavigate} />)
    expect(screen.getByText('← Previous')).toBeInTheDocument()
    expect(screen.getByText('Next →')).toBeInTheDocument()
  })

  it('renders section labels', () => {
    const onNavigate = vi.fn()
    render(<SectionPagination sections={sections} activeId="setup" onNavigate={onNavigate} />)
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Usage')).toBeInTheDocument()
  })

  it('calls onNavigate with prev section id when previous is clicked', () => {
    const onNavigate = vi.fn()
    render(<SectionPagination sections={sections} activeId="setup" onNavigate={onNavigate} />)
    fireEvent.click(screen.getByText('Introduction'))
    expect(onNavigate).toHaveBeenCalledWith('intro')
  })

  it('calls onNavigate with next section id when next is clicked', () => {
    const onNavigate = vi.fn()
    render(<SectionPagination sections={sections} activeId="setup" onNavigate={onNavigate} />)
    fireEvent.click(screen.getByText('Usage'))
    expect(onNavigate).toHaveBeenCalledWith('usage')
  })

  it('does not render previous when at first section', () => {
    const onNavigate = vi.fn()
    render(<SectionPagination sections={sections} activeId="intro" onNavigate={onNavigate} />)
    expect(screen.queryByText('← Previous')).not.toBeInTheDocument()
    expect(screen.getByText('Next →')).toBeInTheDocument()
  })

  it('does not render next when at last section', () => {
    const onNavigate = vi.fn()
    render(<SectionPagination sections={sections} activeId="usage" onNavigate={onNavigate} />)
    expect(screen.getByText('← Previous')).toBeInTheDocument()
    expect(screen.queryByText('Next →')).not.toBeInTheDocument()
  })
})
