import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileColumnNavigator } from '@/components/Dashboard/KanbanView/KanbanBoard/MobileColumnNavigator'

vi.mock('lucide-react', () => ({
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron-left" {...props} />,
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron-right" {...props} />,
}))

describe('MobileColumnNavigator', () => {
  const onPrevious = vi.fn()
  const onNext = vi.fn()

  beforeEach(() => vi.clearAllMocks())

  it('renders the column title', () => {
    render(<MobileColumnNavigator currentColumnIndex={1} onPrevious={onPrevious} onNext={onNext} />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('calls onPrevious when left button is clicked', () => {
    render(<MobileColumnNavigator currentColumnIndex={1} onPrevious={onPrevious} onNext={onNext} />)
    fireEvent.click(screen.getByTestId('chevron-left').closest('button')!)
    expect(onPrevious).toHaveBeenCalled()
  })

  it('calls onNext when right button is clicked', () => {
    render(<MobileColumnNavigator currentColumnIndex={1} onPrevious={onPrevious} onNext={onNext} />)
    fireEvent.click(screen.getByTestId('chevron-right').closest('button')!)
    expect(onNext).toHaveBeenCalled()
  })
})
