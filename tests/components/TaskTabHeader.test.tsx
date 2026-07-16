import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskTabHeader from '@/components/Dashboard/TaskDetails/TaskTab/TaskTabHeader'

vi.mock('lucide-react', () => ({
  Activity: (props: any) => <svg data-testid="activity-icon" {...props} />,
  MessageSquare: (props: any) => <svg data-testid="message-icon" {...props} />,
  Paperclip: (props: any) => <svg data-testid="paperclip-icon" {...props} />,
}))

describe('TaskTabHeader', () => {
  const defaultProps = {
    activeTab: 'comments' as const,
    setActiveTab: vi.fn(),
    counts: { comments: 3, activity: 5, attachments: 2 },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all three tab buttons', () => {
    render(<TaskTabHeader {...defaultProps} />)
    expect(screen.getAllByText('Comments').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Activity').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Attachments').length).toBeGreaterThan(0)
  })

  it('calls setActiveTab when Comments tab is clicked', () => {
    render(<TaskTabHeader {...defaultProps} />)
    fireEvent.click(screen.getAllByText('Comments')[0].closest('button')!)
    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('comments')
  })

  it('calls setActiveTab when Activity tab is clicked', () => {
    render(<TaskTabHeader {...defaultProps} />)
    fireEvent.click(screen.getAllByText('Activity')[0].closest('button')!)
    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('activity')
  })

  it('calls setActiveTab when Attachments tab is clicked', () => {
    render(<TaskTabHeader {...defaultProps} />)
    fireEvent.click(screen.getAllByText('Attachments')[0].closest('button')!)
    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('attachments')
  })

  it('shows comment count badge', () => {
    render(<TaskTabHeader {...defaultProps} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows activity count badge', () => {
    render(<TaskTabHeader {...defaultProps} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows attachments count badge', () => {
    render(<TaskTabHeader {...defaultProps} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('hides count badge when count is 0', () => {
    const props = {
      ...defaultProps,
      counts: { comments: 0, activity: 0, attachments: 0 },
    }
    render(<TaskTabHeader {...props} />)
    const badges = screen.queryAllByText('0')
    expect(badges.length).toBe(0)
  })

  it('highlights active tab', () => {
    render(<TaskTabHeader {...defaultProps} />)
    const commentsButton = screen.getAllByText('Comments')[0].closest('button')
    expect(commentsButton?.className).toContain('text-primary')
    expect(commentsButton?.className).toContain('border-primary')
  })

  it('renders tab icons', () => {
    render(<TaskTabHeader {...defaultProps} />)
    expect(screen.getByTestId('message-icon')).toBeInTheDocument()
    expect(screen.getByTestId('activity-icon')).toBeInTheDocument()
    expect(screen.getByTestId('paperclip-icon')).toBeInTheDocument()
  })
})
