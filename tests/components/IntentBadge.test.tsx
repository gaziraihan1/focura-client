import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IntentBadge, IntentCard, INTENT_CONFIG } from '@/components/Dashboard/TaskDetails/IntentBadge'

vi.mock('lucide-react', () => ({
  Zap: (props: any) => <svg data-testid="zap-icon" {...props} />,
  Lightbulb: (props: any) => <svg data-testid="lightbulb-icon" {...props} />,
  Eye: (props: any) => <svg data-testid="eye-icon" {...props} />,
  BookOpen: (props: any) => <svg data-testid="book-icon" {...props} />,
  MessageSquare: (props: any) => <svg data-testid="message-icon" {...props} />,
}))

describe('IntentBadge', () => {
  it('renders default EXECUTION intent', () => {
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

  it('renders icon for each intent', () => {
    const { unmount } = render(<IntentBadge intent="EXECUTION" />)
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument()
    unmount()

    render(<IntentBadge intent="PLANNING" />)
    expect(screen.getByTestId('lightbulb-icon')).toBeInTheDocument()
  })
})

describe('IntentCard', () => {
  it('renders intent label and description', () => {
    render(<IntentCard intent="EXECUTION" />)
    expect(screen.getByText('Do Work')).toBeInTheDocument()
    expect(screen.getByText('Active implementation and building')).toBeInTheDocument()
  })

  it('renders different intents', () => {
    render(<IntentCard intent="REVIEW" />)
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('Check and validate work')).toBeInTheDocument()
  })
})

describe('INTENT_CONFIG', () => {
  it('has all 5 intent types', () => {
    expect(Object.keys(INTENT_CONFIG)).toHaveLength(5)
    expect(INTENT_CONFIG).toHaveProperty('EXECUTION')
    expect(INTENT_CONFIG).toHaveProperty('PLANNING')
    expect(INTENT_CONFIG).toHaveProperty('REVIEW')
    expect(INTENT_CONFIG).toHaveProperty('LEARNING')
    expect(INTENT_CONFIG).toHaveProperty('COMMUNICATION')
  })
})
