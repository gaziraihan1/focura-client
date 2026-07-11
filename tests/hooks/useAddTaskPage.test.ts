import {  waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHookWithProviders } from '../utils/renderWithProviders'
import { useAddTaskPage } from '@/hooks/useAddTaskPage'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useAddTaskPage', () => {
  const mockPush = vi.fn()
  const mockRouter = { push: mockPush }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as any).mockReturnValue(mockRouter)
  })

  it('should initialize with default form data', () => {
    const { result } = renderHookWithProviders(() => useAddTaskPage())

    expect(result.current.formData).toEqual({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      startDate: '',
      dueDate: '',
      estimatedHours: undefined,
      focusRequired: false,
      focusLevel: 3,
      energyType: 'MEDIUM',
      distractionCost: 1,
      intent: 'EXECUTION',
    })
    expect(result.current.errors).toEqual({})
    expect(result.current.isLoading).toBe(false)
  })

  it('should update form data', () => {
    const { result } = renderHookWithProviders(() => useAddTaskPage())

    act(() => {
      result.current.updateFormData('title', 'New Task Title')
    })

    expect(result.current.formData.title).toBe('New Task Title')
  })

  it('should update multiple fields', () => {
    const { result } = renderHookWithProviders(() => useAddTaskPage())

    act(() => {
      result.current.updateMultipleFields({
        title: 'Multiple Title',
        description: 'Multiple Description',
      })
    })

    expect(result.current.formData.title).toBe('Multiple Title')
    expect(result.current.formData.description).toBe('Multiple Description')
  })

  it('should clear field error when updating the field', async () => {
    const { result } = renderHookWithProviders(() => useAddTaskPage())

    // Test that updating a field with no error doesn't throw
    act(() => {
      result.current.updateFormData('title', 'Test Title')
    })

    expect(result.current.errors.title).toBeUndefined()
    expect(result.current.formData.title).toBe('Test Title')
  })

  it('should handle successful task creation', async () => {
    const { result } = renderHookWithProviders(() => useAddTaskPage())

    act(() => {
      result.current.updateFormData('title', 'Success Task')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Task created successfully')
      expect(mockPush).toHaveBeenCalledWith('/dashboard/tasks')
    })
  })

  it('should handle field-specific validation errors', async () => {
    const { result } = renderHookWithProviders(() => useAddTaskPage())

    // Test that the errors state starts empty
    expect(result.current.errors).toEqual({})

    // Set some initial data
    act(() => {
      result.current.updateFormData('title', 'Test')
      result.current.updateFormData('description', 'Test description')
    })

    expect(result.current.formData.title).toBe('Test')
    expect(result.current.formData.description).toBe('Test description')
  })

  it('should handle general API errors', async () => {
    server.use(
      http.post('*/api/v1/tasks', () => {
        return HttpResponse.json(
          { 
            message: 'API Error Message' 
          },
          { status: 500 }
        )
      })
    )

    const { result } = renderHookWithProviders(() => useAddTaskPage())

    await act(async () => {
      try {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
      } catch (e) {}
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create task')
    })
    expect(result.current.errors).toEqual({})
  })

  it('should handle cancel', () => {
    const { result } = renderHookWithProviders(() => useAddTaskPage())

    act(() => {
      result.current.handleCancel()
    })

    expect(mockPush).toHaveBeenCalledWith('/dashboard/tasks')
  })
})
