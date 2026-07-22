import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IntentBadge, IntentCard, INTENT_CONFIG } from '@/components/Dashboard/TaskDetails/IntentBadge'

vi.mock('lucide-react', () => ({
  Zap: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="zap-icon" {...props} />,
  Lightbulb: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="lightbulb-icon" {...props} />,
  Eye: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="eye-icon" {...props} />,
  BookOpen: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="book-icon" {...props} />,
  MessageSquare: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="message-icon" {...props} />,
}))

describe('IntentBadge', () => {
  it('renders default EXECUTION intent with label', () => {
    render(<IntentBadge />)
    expect(screen.getByText('Do Work')).toBeInTheDocument()
  })

  it('renders PLANNING intent', () => {
    render(<IntentBadge intent="PLANNING" />)
    expect(screen.getByText('Think & Plan')).toBeInTheDocument()
  })

  it('renders REVIEW intent', () => {
    render(<IntentBadge intent="REVIEW" />)
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  it('renders LEARNING intent', () => {
    render(<IntentBadge intent="LEARNING" />)
    expect(screen.getByText('Learn')).toBeInTheDocument()
  })

  it('renders COMMUNICATION intent', () => {
    render(<IntentBadge intent="COMMUNICATION" />)
    expect(screen.getByText('Communicate')).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    render(<IntentBadge showLabel={false} />)
    expect(screen.queryByText('Do Work')).not.toBeInTheDocument()
  })

  it('renders icon when showLabel is false', () => {
    render(<IntentBadge showLabel={false} />)
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument()
  })

  it('renders with sm size', () => {
    const { container } = render(<IntentBadge size="sm" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('px-2')
  })

  it('renders with md size by default', () => {
    const { container } = render(<IntentBadge />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('px-3')
  })

  it('renders with lg size', () => {
    const { container } = render(<IntentBadge size="lg" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('px-4')
  })

  it('has title attribute when showLabel is false', () => {
    render(<IntentBadge intent="EXECUTION" showLabel={false} />)
    const badge = screen.getByTitle(/Do Work/)
    expect(badge).toBeInTheDocument()
  })
})

describe('IntentCard', () => {
  it('renders EXECUTION intent card with label and description', () => {
    render(<IntentCard intent="EXECUTION" />)
    expect(screen.getByText('Do Work')).toBeInTheDocument()
    expect(screen.getByText('Active implementation and building')).toBeInTheDocument()
  })

  it('renders PLANNING intent card', () => {
    render(<IntentCard intent="PLANNING" />)
    expect(screen.getByText('Think & Plan')).toBeInTheDocument()
    expect(screen.getByText('Strategy and organization')).toBeInTheDocument()
  })

  it('renders REVIEW intent card', () => {
    render(<IntentCard intent="REVIEW" />)
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('Check and validate work')).toBeInTheDocument()
  })

  it('renders LEARNING intent card', () => {
    render(<IntentCard intent="LEARNING" />)
    expect(screen.getByText('Learn')).toBeInTheDocument()
    expect(screen.getByText('Research and education')).toBeInTheDocument()
  })

  it('renders COMMUNICATION intent card', () => {
    render(<IntentCard intent="COMMUNICATION" />)
    expect(screen.getByText('Communicate')).toBeInTheDocument()
    expect(screen.getByText('Meetings and discussions')).toBeInTheDocument()
  })

  it('defaults to EXECUTION when no intent provided', () => {
    render(<IntentCard />)
    expect(screen.getByText('Do Work')).toBeInTheDocument()
  })
})

describe('INTENT_CONFIG', () => {
  it('has configs for all 5 intent types', () => {
    expect(Object.keys(INTENT_CONFIG)).toHaveLength(5)
    expect(INTENT_CONFIG).toHaveProperty('EXECUTION')
    expect(INTENT_CONFIG).toHaveProperty('PLANNING')
    expect(INTENT_CONFIG).toHaveProperty('REVIEW')
    expect(INTENT_CONFIG).toHaveProperty('LEARNING')
    expect(INTENT_CONFIG).toHaveProperty('COMMUNICATION')
  })

  it('each config has required fields', () => {
    Object.values(INTENT_CONFIG).forEach((config) => {
      expect(config).toHaveProperty('label')
      expect(config).toHaveProperty('icon')
      expect(config).toHaveProperty('description')
      expect(config).toHaveProperty('color')
      expect(config).toHaveProperty('bgColor')
      expect(config).toHaveProperty('borderColor')
      expect(config).toHaveProperty('dotColor')
    })
  })
})
