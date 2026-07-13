import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { usePagination } from '@/hooks/usePagination'

describe('usePagination', () => {
  const items = Array.from({ length: 50 }, (_, i) => `item-${i}`)

  it('returns first page by default', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(5)
    expect(result.current.totalItems).toBe(50)
    expect(result.current.paginatedItems).toHaveLength(10)
    expect(result.current.paginatedItems[0]).toBe('item-0')
    expect(result.current.startIndex).toBe(0)
    expect(result.current.endIndex).toBe(10)
    expect(result.current.canGoNext).toBe(true)
    expect(result.current.canGoPrevious).toBe(false)
  })

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    act(() => result.current.nextPage())

    expect(result.current.currentPage).toBe(2)
    expect(result.current.paginatedItems[0]).toBe('item-10')
    expect(result.current.canGoPrevious).toBe(true)
  })

  it('navigates to previous page', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    act(() => result.current.nextPage())
    act(() => result.current.previousPage())

    expect(result.current.currentPage).toBe(1)
  })

  it('does not go before page 1', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    act(() => result.current.previousPage())

    expect(result.current.currentPage).toBe(1)
    expect(result.current.canGoPrevious).toBe(false)
  })

  it('does not go past last page', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    act(() => result.current.goToLastPage())
    act(() => result.current.nextPage())

    expect(result.current.currentPage).toBe(5)
    expect(result.current.canGoNext).toBe(false)
  })

  it('goes to first page', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    act(() => result.current.goToLastPage())
    act(() => result.current.goToFirstPage())

    expect(result.current.currentPage).toBe(1)
  })

  it('goes to last page', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    act(() => result.current.goToLastPage())

    expect(result.current.currentPage).toBe(5)
    expect(result.current.paginatedItems).toHaveLength(10)
    expect(result.current.paginatedItems[0]).toBe('item-40')
  })

  it('resets to page 1', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    act(() => result.current.goToLastPage())
    act(() => result.current.resetPage())

    expect(result.current.currentPage).toBe(1)
  })

  it('sets page directly', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    act(() => result.current.setCurrentPage(3))

    expect(result.current.currentPage).toBe(3)
    expect(result.current.paginatedItems[0]).toBe('item-20')
  })

  it('handles empty items', () => {
    const { result } = renderHook(() => usePagination({ items: [], itemsPerPage: 10 }))

    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPages).toBe(0)
    expect(result.current.paginatedItems).toHaveLength(0)
    expect(result.current.canGoNext).toBe(false)
    expect(result.current.canGoPrevious).toBe(false)
  })

  it('handles items fewer than one page', () => {
    const { result } = renderHook(() => usePagination({ items: items.slice(0, 3), itemsPerPage: 10 }))

    expect(result.current.totalPages).toBe(1)
    expect(result.current.paginatedItems).toHaveLength(3)
    expect(result.current.canGoNext).toBe(false)
  })

  it('defaults itemsPerPage to 15', () => {
    const { result } = renderHook(() => usePagination({ items }))

    expect(result.current.totalPages).toBe(4) // 50 / 15 = 3.33 → 4
    expect(result.current.paginatedItems).toHaveLength(15)
  })

  it('last page has correct number of items', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }))

    act(() => result.current.goToLastPage())

    expect(result.current.paginatedItems).toHaveLength(10)
    expect(result.current.endIndex).toBe(50)
  })
})
