import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from '@/components/Shared/Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when totalPages <= 1', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders page buttons', () => {
    render(<Pagination {...defaultProps} />)
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument()
  })

  it('renders info text with itemsPerPage and totalItems', () => {
    render(
      <Pagination {...defaultProps} itemsPerPage={10} totalItems={50} />
    )
    expect(screen.getByText(/Showing/)).toBeInTheDocument()
    expect(screen.getByText(/50/)).toBeInTheDocument()
  })

  it('calls onPageChange when next button clicked', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />)
    
    await user.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange when prev button clicked', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />)
    
    await user.click(screen.getByLabelText('Previous page'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables prev on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('disables next on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={5} />)
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('highlights current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    const currentPage = screen.getByLabelText('Page 3')
    expect(currentPage).toHaveAttribute('aria-current', 'page')
  })

  it('shows ellipsis for many pages', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={15} />)
    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('calls onPageChange when page number clicked', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />)
    
    await user.click(screen.getByLabelText('Page 3'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})
