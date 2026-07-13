import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IntentBadge } from '@/components/Dashboard/TaskDetails/IntentBadge'

vi.mock('lucide-react', () => ({
  Lightbulb: (props: any) => <svg data-testid="lightbulb-icon" {...props} />,
  Zap: (props: any) => <svg data-testid="zap-icon" {...props} />,
  Eye: (props: any) => <svg data-testid="eye-icon" {...props} />,
  BookOpen: (props: any) => <svg data-testid="bookopen-icon" {...props} />,
  MessageSquare: (props: any) => <svg data-testid="messagesquare-icon" {...props} />,
}))

describe('IntentBadge', () => {
  it('renders EXECUTION intent with correct label', () => {
    render(<IntentBadge intent="EXECUTION" />)
    expect(screen.getByText('Do Work')).toBeInTheDocument()
  })

  it('renders PLANNING intent with correct label', () => {
    render(<IntentBadge intent="PLANNING" />)
    expect(screen.getByText('Think & Plan')).toBeInTheDocument()
  })

  it('renders REVIEW intent with correct label', () => {
    render(<IntentBadge intent="REVIEW" />)
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  it('renders LEARNING intent with correct label', () => {
    render(<IntentBadge intent="LEARNING" />)
    expect(screen.getByText('Learn')).toBeInTheDocument()
  })

  it('renders COMMUNICATION intent with correct label', () => {
    render(<IntentBadge intent="COMMUNICATION" />)
    expect(screen.getByText('Communicate')).toBeInTheDocument()
  })

  it('defaults to EXECUTION when no intent provided', () => {
    render(<IntentBadge />)
    expect(screen.getByText('Do Work')).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    render(<IntentBadge intent="EXECUTION" showLabel={false} />)
    expect(screen.queryByText('Do Work')).not.toBeInTheDocument()
  })
})
