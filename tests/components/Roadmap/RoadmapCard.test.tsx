import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RoadmapCard from '@/components/Roadmap/RoadmapCard'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  useInView: () => true,
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

vi.mock('lucide-react', () => ({
  ArrowRight: (props: any) => <svg data-testid="arrow-right" {...props} />,
}))

const mockItem = {
  id: '1',
  title: 'Dark Mode',
  description: 'System-wide dark mode support',
  detail: 'Full dark mode with custom themes',
  status: 'completed' as const,
  category: 'core' as const,
  quarter: 'Q1 2025',
  icon: '🌙',
  highlights: ['Theme toggle', 'System preference', 'Custom palettes'],
}

describe('RoadmapCard', () => {
  const defaultProps = {
    item: mockItem,
    side: 'left' as const,
    onClick: vi.fn(),
  }

  it('renders the item title', () => {
    render(<RoadmapCard {...defaultProps} />)
    expect(screen.getByText('Dark Mode')).toBeInTheDocument()
  })

  it('renders the item description', () => {
    render(<RoadmapCard {...defaultProps} />)
    expect(screen.getByText('System-wide dark mode support')).toBeInTheDocument()
  })

  it('renders the status label', () => {
    render(<RoadmapCard {...defaultProps} />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders the quarter', () => {
    render(<RoadmapCard {...defaultProps} />)
    expect(screen.getByText('Q1 2025')).toBeInTheDocument()
  })
})
