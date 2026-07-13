import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCommentPage } from '@/hooks/useCommentPage'

// Mock the getCaretCoordinates utility
vi.mock('@/utils/comments.utils', () => ({
  getCaretCoordinates: vi.fn(() => ({ top: 100, left: 50 })),
}))

const mockUsers = [
  { id: 'user-1', name: 'Alice', image: null },
  { id: 'user-2', name: 'Bob', image: null },
  { id: 'user-3', name: 'Charlie', image: null },
]

const createMockRef = () => ({
  current: {
    selectionStart: 0,
    selectionEnd: 0,
    focus: vi.fn(),
  },
})

describe('useCommentPage', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with no mention query', () => {
    const ref = createMockRef()
    const { result } = renderHook(() =>
      useCommentPage('', mockOnChange, mockUsers, ref as any)
    )

    expect(result.current.mentionQuery).toBeNull()
    expect(result.current.filteredUsers).toEqual([])
    expect(result.current.activeIndex).toBe(0)
    expect(result.current.dropdownPos).toBeNull()
  })

  it('detects @mention and filters users', () => {
    const ref = createMockRef()
    const { result } = renderHook(() =>
      useCommentPage('', mockOnChange, mockUsers, ref as any)
    )

    // Simulate typing @Al
    act(() => {
      const event = {
        target: { value: '@Al', selectionStart: 3 },
      } as any
      result.current.handleChange(event)
    })

    expect(result.current.mentionQuery).toBe('Al')
    expect(result.current.filteredUsers).toHaveLength(1)
    expect(result.current.filteredUsers[0].name).toBe('Alice')
  })

  it('clears mention when not typing @', () => {
    const ref = createMockRef()
    const { result } = renderHook(() =>
      useCommentPage('', mockOnChange, mockUsers, ref as any)
    )

    act(() => {
      const event = {
        target: { value: 'hello', selectionStart: 5 },
      } as any
      result.current.handleChange(event)
    })

    expect(result.current.mentionQuery).toBeNull()
  })

  it('sets dropdown position when @ detected', () => {
    const ref = createMockRef()
    const { result } = renderHook(() =>
      useCommentPage('', mockOnChange, mockUsers, ref as any)
    )

    act(() => {
      const event = {
        target: { value: '@B', selectionStart: 2 },
      } as any
      result.current.handleChange(event)
    })

    expect(result.current.dropdownPos).not.toBeNull()
    expect(result.current.dropdownPos?.top).toBe(124)
  })

  it('inserts mention and calls onChange', () => {
    const ref = createMockRef()
    const { result } = renderHook(() =>
      useCommentPage('Hello ', mockOnChange, mockUsers, ref as any)
    )

    // Start typing @
    act(() => {
      const event = {
        target: { value: 'Hello @B', selectionStart: 8 },
      } as any
      result.current.handleChange(event)
    })

    // Insert mention
    act(() => {
      result.current.insertMention(mockUsers[1])
    })

    expect(mockOnChange).toHaveBeenCalled()
    expect(result.current.mentionQuery).toBeNull()
  })

  it('navigates with ArrowDown', () => {
    const ref = createMockRef()
    const { result } = renderHook(() =>
      useCommentPage('', mockOnChange, mockUsers, ref as any)
    )

    // Start mention
    act(() => {
      const event = {
        target: { value: '@', selectionStart: 1 },
      } as any
      result.current.handleChange(event)
    })

    expect(result.current.activeIndex).toBe(0)

    // ArrowDown
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as any)
    })

    expect(result.current.activeIndex).toBe(1)
  })

  it('navigates with ArrowUp', () => {
    const ref = createMockRef()
    const { result } = renderHook(() =>
      useCommentPage('', mockOnChange, mockUsers, ref as any)
    )

    act(() => {
      const event = {
        target: { value: '@', selectionStart: 1 },
      } as any
      result.current.handleChange(event)
    })

    // ArrowDown first
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as any)
    })

    // ArrowUp
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as any)
    })

    expect(result.current.activeIndex).toBe(0)
  })

  it('closes mention on Escape', () => {
    const ref = createMockRef()
    const { result } = renderHook(() =>
      useCommentPage('', mockOnChange, mockUsers, ref as any)
    )

    act(() => {
      const event = {
        target: { value: '@B', selectionStart: 2 },
      } as any
      result.current.handleChange(event)
    })

    act(() => {
      result.current.handleKeyDown({
        key: 'Escape',
        preventDefault: vi.fn(),
      } as any)
    })

    expect(result.current.mentionQuery).toBeNull()
  })

  it('calls onSubmit on Ctrl+Enter', () => {
    const ref = createMockRef()
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useCommentPage('Hello', mockOnChange, mockUsers, ref as any)
    )

    act(() => {
      result.current.handleKeyDown(
        {
          key: 'Enter',
          ctrlKey: true,
          preventDefault: vi.fn(),
        } as any,
        onSubmit
      )
    })

    expect(onSubmit).toHaveBeenCalled()
  })
})
