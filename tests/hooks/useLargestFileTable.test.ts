import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import type { LargestFile } from '@/hooks/useStorage'


import { useLargestFilesTable } from '@/hooks/useLargestFileTable'

function makeFile(overrides: Partial<LargestFile> = {}): LargestFile {
  return {
    id: 'file-1',
    name: 'test.pdf',
    originalName: 'test.pdf',
    size: 10485760,
    sizeMB: 10,
    mimeType: 'application/pdf',
    url: 'https://cdn.focura.com/file-1.pdf',
    uploadedAt: new Date('2024-01-01'),
    uploadedBy: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
    task: null,
    project: null,
    ...overrides,
  }
}

describe('useLargestFilesTable', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('returns files filtered and sorted from useStoragePage', () => {
    const files = [makeFile({ id: 'f1', name: 'a.pdf', sizeMB: 5 }), makeFile({ id: 'f2', name: 'b.pdf', sizeMB: 10 })]

    const { result } = renderHook(
      () => useLargestFilesTable(files, 'ws-1', true),
      { wrapper: createWrapper() }
    )

    expect(result.current.filteredAndSortedFiles).toHaveLength(2)
    expect(result.current.selectedFiles).toBeInstanceOf(Set)
    expect(result.current.selectedFiles.size).toBe(0)
    expect(result.current.deletableCount).toBe(0)
  })

  it('computes deletableCount for admin', () => {
    const files = [makeFile({ id: 'f1' }), makeFile({ id: 'f2' })]

    const { result } = renderHook(
      () => useLargestFilesTable(files, 'ws-1', true),
      { wrapper: createWrapper() }
    )

    act(() => result.current.selectAll())

    expect(result.current.selectedFiles.size).toBe(2)
    expect(result.current.deletableCount).toBe(2)
  })

  it('toggles file selection', () => {
    const files = [makeFile({ id: 'f1' }), makeFile({ id: 'f2' })]

    const { result } = renderHook(
      () => useLargestFilesTable(files, 'ws-1', false),
      { wrapper: createWrapper() }
    )

    act(() => result.current.toggleFileSelection('f1'))
    expect(result.current.selectedFiles.has('f1')).toBe(true)

    act(() => result.current.toggleFileSelection('f1'))
    expect(result.current.selectedFiles.has('f1')).toBe(false)
  })

  it('selects and clears all files', () => {
    const files = [makeFile({ id: 'f1' }), makeFile({ id: 'f2' }), makeFile({ id: 'f3' })]

    const { result } = renderHook(
      () => useLargestFilesTable(files, 'ws-1', true),
      { wrapper: createWrapper() }
    )

    act(() => result.current.selectAll())
    expect(result.current.selectedFiles.size).toBe(3)

    act(() => result.current.clearSelection())
    expect(result.current.selectedFiles.size).toBe(0)
  })

  it('sets filter type', () => {
    const files = [makeFile({ mimeType: 'image/png' }), makeFile({ mimeType: 'application/pdf' })]

    const { result } = renderHook(
      () => useLargestFilesTable(files, 'ws-1', false),
      { wrapper: createWrapper() }
    )

    expect(result.current.filterType).toBe('all')

    act(() => result.current.setFilterType('images'))
    expect(result.current.filterType).toBe('images')
  })

  it('handles bulk delete for admin', async () => {
    const files = [makeFile({ id: 'f1' }), makeFile({ id: 'f2' })]

    const { result } = renderHook(
      () => useLargestFilesTable(files, 'ws-1', true),
      { wrapper: createWrapper() }
    )

    act(() => result.current.selectAll())
    expect(result.current.selectedFiles.size).toBe(2)

    await act(async () => {
      await result.current.handleBulkDelete()
    })

    expect(result.current.selectedFiles.size).toBe(0)
  })

  it('does not delete when confirm is cancelled', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    const files = [makeFile({ id: 'f1' })]

    const { result } = renderHook(
      () => useLargestFilesTable(files, 'ws-1', true),
      { wrapper: createWrapper() }
    )

    act(() => result.current.toggleFileSelection('f1'))

    await act(async () => {
      await result.current.handleBulkDelete()
    })

    expect(result.current.selectedFiles.size).toBe(1)
  })

  it('handles single file delete', async () => {
    const files = [makeFile({ id: 'f1' })]

    const { result } = renderHook(
      () => useLargestFilesTable(files, 'ws-1', true),
      { wrapper: createWrapper() }
    )

    act(() => result.current.toggleFileSelection('f1'))

    await act(async () => {
      await result.current.handleDeleteFile(files[0])
    })

    expect(result.current.deletingFileId).toBeNull()
  })

  it('skips delete when user is not admin and cannot delete file', async () => {
    const files = [makeFile({ id: 'f1', uploadedBy: { id: 'other-user', name: 'Other', email: 'other@test.com' } })]

    const { result } = renderHook(
      () => useLargestFilesTable(files, 'ws-1', false),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.handleDeleteFile(files[0])
    })

    expect(result.current.deletingFileId).toBeNull()
  })
})
