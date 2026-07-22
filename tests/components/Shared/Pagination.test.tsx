import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/components/Shared/Pagination'

describe('Pagination', () => {
  const onPageChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('returns null when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={onPageChange} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders page buttons for small page count', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Prev')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('highlights current page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    )

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })

  it('calls onPageChange when clicking a page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    )

    fireEvent.click(screen.getByText('3'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('navigates to previous page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    )

    fireEvent.click(screen.getByText('Prev'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('navigates to next page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    )

    fireEvent.click(screen.getByText('Next'))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('disables prev button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    )

    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />
    )

    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('shows items info when itemsPerPage and totalItems are provided', () => {
    const { container } = render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    )

    // Check the paragraph contains the info text
    const infoParagraph = container.querySelector('p')
    expect(infoParagraph).toBeInTheDocument()
    expect(infoParagraph?.textContent).toContain('Showing')
    expect(infoParagraph?.textContent).toContain('11')
    expect(infoParagraph?.textContent).toContain('20')
    expect(infoParagraph?.textContent).toContain('50')
  })

  it('shows ellipsis for large page counts', () => {
    render(
      <Pagination currentPage={10} totalPages={20} onPageChange={onPageChange} />
    )

    const ellipsisButtons = screen.getAllByText('...')
    expect(ellipsisButtons.length).toBeGreaterThanOrEqual(1)
  })
})
