import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useActivityFilters } from '@/hooks/useActivityFilters'
import { ActivityFilterValues } from '@/types/activityFilter.types'

describe('useActivityFilters', () => {
  let mockOnFiltersChange: Record<string, unknown>
  const defaultFilters: ActivityFilterValues = {}

  beforeEach(() => {
    mockOnFiltersChange = vi.fn()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: defaultFilters,
      onFiltersChange: mockOnFiltersChange
    }))

    expect(result.current.showCustomDateRange).toBe(false)
    expect(result.current.activeFiltersCount).toBe(0)
  })

  it('should handle action change', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: defaultFilters,
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleActionChange('CREATE')
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      action: 'CREATE'
    })
  })

  it('should handle action change to "all"', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: { action: 'CREATE' },
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleActionChange('all')
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      action: undefined
    })
  })

  it('should handle entity type change', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: defaultFilters,
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleEntityTypeChange('TASK')
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      entityType: 'TASK'
    })
  })

  it('should handle entity type change to "all"', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: { entityType: 'TASK' },
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleEntityTypeChange('all')
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      entityType: undefined
    })
  })

  it('should handle date preset change (today)', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: defaultFilters,
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleDatePresetChange('today')
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      startDate: expect.any(String),
      endDate: expect.any(String)
    }))
  })

  it('should handle date preset change to "custom"', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: defaultFilters,
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleDatePresetChange('custom')
    })

    expect(result.current.showCustomDateRange).toBe(true)
    expect(mockOnFiltersChange).not.toHaveBeenCalled()
  })

  it('should handle clear filters', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: { action: 'CREATE', entityType: 'TASK' },
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleClearFilters()
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({})
    expect(result.current.showCustomDateRange).toBe(false)
  })

  it('should handle clear action', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: { action: 'CREATE', entityType: 'TASK' },
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleClearAction()
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      entityType: 'TASK',
      action: undefined
    })
  })

  it('should handle clear entity type', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: { action: 'CREATE', entityType: 'TASK' },
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleClearEntityType()
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      action: 'CREATE',
      entityType: undefined
    })
  })

  it('should handle clear date range', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: { startDate: '2023-01-01', endDate: '2023-01-02' },
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleClearDateRange()
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined
    })
  })

  it('should handle start date change', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: defaultFilters,
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleStartDateChange('2023-01-01')
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      startDate: expect.any(String)
    })
  })

  it('should handle end date change', () => {
    const { result } = renderHook(() => useActivityFilters({
      filters: defaultFilters,
      onFiltersChange: mockOnFiltersChange
    }))

    act(() => {
      result.current.handleEndDateChange('2023-01-02')
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      endDate: expect.any(String)
    })
  })

  it('should calculate active filters count correctly', () => {
    const { result, rerender } = renderHook(({ filters }) => useActivityFilters({
      filters,
      onFiltersChange: mockOnFiltersChange
    }), {
      initialProps: { filters: defaultFilters }
    })

    expect(result.current.activeFiltersCount).toBe(0)

    rerender({ filters: { action: 'CREATE' } })
    expect(result.current.activeFiltersCount).toBe(1)

    rerender({ filters: { action: 'CREATE', entityType: 'TASK' } })
    expect(result.current.activeFiltersCount).toBe(2)

    rerender({ filters: { action: 'CREATE', startDate: '2023-01-01' } })
    expect(result.current.activeFiltersCount).toBe(2)
  })
})
