import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SubtaskForm } from '@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskForm'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('lucide-react', () => ({
  Check: (props: any) => <svg data-testid="check-icon" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader-icon" {...props} />,
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

const defaultProps = {
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
  isLoading: false,
}

describe('SubtaskForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the input field', () => {
    render(<SubtaskForm {...defaultProps} />)
    expect(screen.getByPlaceholderText('Subtask title…')).toBeInTheDocument()
  })

  it('renders priority buttons', () => {
    render(<SubtaskForm {...defaultProps} />)
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders the Add subtask button', () => {
    render(<SubtaskForm {...defaultProps} />)
    expect(screen.getByText('Add subtask')).toBeInTheDocument()
  })

  it('calls onCancel when Cancel is clicked', () => {
    render(<SubtaskForm {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })
})
