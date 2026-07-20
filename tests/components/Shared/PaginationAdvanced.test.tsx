import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { Pagination } from '@/components/Shared/Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  }

  it('returns null when totalPages <= 1', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders prev/next buttons', () => {
    render(<Pagination {...defaultProps} />)
    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument()
  })

  it('disables prev on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled()
  })

  it('disables next on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />)
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled()
  })

  it('calls onPageChange when clicking a page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: /page 3/i }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange when clicking next', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: /next page/i }))
    expect(onPageChange).toHaveBeenCalledWith(6)
  })

  it('calls onPageChange when clicking prev', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: /previous page/i }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('shows items per page info when provided', () => {
    const { container } = render(<Pagination {...defaultProps} currentPage={2} itemsPerPage={10} totalItems={50} />)
    expect(container.textContent).toContain('Showing')
  })

  it('shows ellipsis when many pages', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />)
    expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(1)
  })

  it('calls onPageChange when ellipsis clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} currentPage={5} totalPages={10} onPageChange={onPageChange} />)
    const ellipsis = screen.getByRole('button', { name: /jump to later pages/i })
    await user.click(ellipsis)
    expect(onPageChange).toHaveBeenCalled()
  })
})
