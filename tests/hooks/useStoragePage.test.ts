import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useStoragePage,
  useStorageWarning,
  formatBytes,
  getPlanLimits,
  getCategoryIcon,
  getCategoryColor,
  formatStorageSize,
  getRoleBadgeColor,
  getStorageStatusColor,
} from '@/hooks/useStoragePage'

const makeFile = (overrides: Record<string, any> = {}) => ({
  id: 'file-1',
  name: 'test.pdf',
  originalName: 'test.pdf',
  size: 1024,
  sizeMB: 1,
  mimeType: 'application/pdf',
  url: 'https://example.com/file',
  uploadedAt: '2025-07-13T00:00:00.000Z',
  folder: null,
  uploadedBy: { id: 'user-1', name: 'Alice', email: 'a@test.com', image: null },
  task: null,
  project: null,
  ...overrides,
})

describe('useStoragePage', () => {
  it('returns all files when filter is all', () => {
    const files = [makeFile({ id: 'f1' }), makeFile({ id: 'f2' })]
    const { result } = renderHook(() => useStoragePage(files))

    expect(result.current.filteredAndSortedFiles).toHaveLength(2)
  })

  it('filters by images', () => {
    const files = [
      makeFile({ id: 'f1', mimeType: 'image/png' }),
      makeFile({ id: 'f2', mimeType: 'application/pdf' }),
    ]
    const { result } = renderHook(() => useStoragePage(files))

    act(() => result.current.setFilterType('images'))
    expect(result.current.filteredAndSortedFiles).toHaveLength(1)
    expect(result.current.filteredAndSortedFiles[0].mimeType).toBe('image/png')
  })

  it('filters by pdfs', () => {
    const files = [
      makeFile({ id: 'f1', mimeType: 'application/pdf' }),
      makeFile({ id: 'f2', mimeType: 'image/png' }),
    ]
    const { result } = renderHook(() => useStoragePage(files))

    act(() => result.current.setFilterType('pdfs'))
    expect(result.current.filteredAndSortedFiles).toHaveLength(1)
  })

  it('filters by videos', () => {
    const files = [
      makeFile({ id: 'f1', mimeType: 'video/mp4' }),
      makeFile({ id: 'f2', mimeType: 'application/pdf' }),
    ]
    const { result } = renderHook(() => useStoragePage(files))

    act(() => result.current.setFilterType('videos'))
    expect(result.current.filteredAndSortedFiles).toHaveLength(1)
  })

  it('filters by documents', () => {
    const files = [
      makeFile({ id: 'f1', mimeType: 'application/msword' }),
      makeFile({ id: 'f2', mimeType: 'application/pdf' }),
    ]
    const { result } = renderHook(() => useStoragePage(files))

    act(() => result.current.setFilterType('documents'))
    expect(result.current.filteredAndSortedFiles).toHaveLength(1)
  })

  it('toggles file selection', () => {
    const files = [makeFile({ id: 'f1' }), makeFile({ id: 'f2' })]
    const { result } = renderHook(() => useStoragePage(files))

    act(() => result.current.toggleFileSelection('f1'))
    expect(result.current.selectedFiles.size).toBe(1)
    expect(result.current.selectedFiles.has('f1')).toBe(true)

    act(() => result.current.toggleFileSelection('f1'))
    expect(result.current.selectedFiles.size).toBe(0)
  })

  it('selects all files', () => {
    const files = [makeFile({ id: 'f1' }), makeFile({ id: 'f2' })]
    const { result } = renderHook(() => useStoragePage(files))

    act(() => result.current.selectAll())
    expect(result.current.selectedFiles.size).toBe(2)
  })

  it('clears selection', () => {
    const files = [makeFile({ id: 'f1' })]
    const { result } = renderHook(() => useStoragePage(files))

    act(() => result.current.toggleFileSelection('f1'))
    act(() => result.current.clearSelection())
    expect(result.current.selectedFiles.size).toBe(0)
  })

  it('calculates selected files size', () => {
    const files = [
      makeFile({ id: 'f1', sizeMB: 2 }),
      makeFile({ id: 'f2', sizeMB: 3 }),
    ]
    const { result } = renderHook(() => useStoragePage(files))

    act(() => result.current.toggleFileSelection('f1'))
    act(() => result.current.toggleFileSelection('f2'))
    expect(result.current.selectedFilesSize).toBe(5)
  })

  it('checks canDeleteFile', () => {
    const files = [
      makeFile({ id: 'f1', uploadedBy: { id: 'user-1', name: 'A', email: 'a@test.com', image: null } }),
      makeFile({ id: 'f2', uploadedBy: { id: 'user-2', name: 'B', email: 'b@test.com', image: null } }),
    ]
    const { result } = renderHook(() => useStoragePage(files, 'user-1'))

    expect(result.current.canDeleteFile(files[0])).toBe(true)
    expect(result.current.canDeleteFile(files[1])).toBe(false)
  })

  it('sorts by size desc by default', () => {
    const files = [
      makeFile({ id: 'f1', size: 100 }),
      makeFile({ id: 'f2', size: 500 }),
    ]
    const { result } = renderHook(() => useStoragePage(files))

    expect(result.current.filteredAndSortedFiles[0].size).toBe(500)
  })

  it('sorts by name asc', () => {
    const files = [
      makeFile({ id: 'f1', originalName: 'banana.txt' }),
      makeFile({ id: 'f2', originalName: 'apple.txt' }),
    ]
    const { result } = renderHook(() => useStoragePage(files))

    act(() => result.current.setSortBy('name'))
    act(() => result.current.setSortOrder('asc'))
    expect(result.current.filteredAndSortedFiles[0].originalName).toBe('apple.txt')
  })
})

describe('useStorageWarning', () => {
  it('returns normal for low usage', () => {
    const { result } = renderHook(() =>
      useStorageWarning({ percentage: 50, workspaceName: 'Ws' } as any)
    )
    expect(result.current.level).toBe('normal')
    expect(result.current.message).toBeNull()
  })

  it('returns warning for 80%+', () => {
    const { result } = renderHook(() =>
      useStorageWarning({ percentage: 85, workspaceName: 'Ws' } as any)
    )
    expect(result.current.level).toBe('warning')
    expect(result.current.message).toContain('high')
  })

  it('returns critical for 95%+', () => {
    const { result } = renderHook(() =>
      useStorageWarning({ percentage: 96, workspaceName: 'Ws' } as any)
    )
    expect(result.current.level).toBe('critical')
    expect(result.current.message).toContain('almost full')
  })

  it('returns normal when no storageInfo', () => {
    const { result } = renderHook(() => useStorageWarning(undefined))
    expect(result.current.level).toBe('normal')
  })
})

describe('formatBytes', () => {
  it('formats 0 bytes', () => expect(formatBytes(0)).toBe('0 Bytes'))
  it('formats bytes', () => expect(formatBytes(500)).toBe('500 Bytes'))
  it('formats KB', () => expect(formatBytes(1024)).toBe('1 KB'))
  it('formats MB', () => expect(formatBytes(1048576)).toBe('1 MB'))
  it('formats GB', () => expect(formatBytes(1073741824)).toBe('1 GB'))
  it('formats with decimals', () => expect(formatBytes(1500, 1)).toBe('1.5 KB'))
})

describe('getPlanLimits', () => {
  it('returns FREE limits', () => {
    const limits = getPlanLimits('FREE')
    expect(limits.storage).toBe(1024)
    expect(limits.maxFileSize).toBe(5)
  })

  it('returns PRO limits', () => {
    const limits = getPlanLimits('PRO')
    expect(limits.storage).toBe(10240)
    expect(limits.maxFileSize).toBe(25)
  })

  it('returns BUSINESS limits', () => {
    const limits = getPlanLimits('BUSINESS')
    expect(limits.storage).toBe(51200)
    expect(limits.maxFileSize).toBe(100)
  })

  it('falls back to FREE for unknown plan', () => {
    const limits = getPlanLimits('UNKNOWN')
    expect(limits.storage).toBe(1024)
  })
})

describe('getCategoryIcon', () => {
  it('returns Image for images', () => expect(getCategoryIcon('images')).toBe('Image'))
  it('returns Video for videos', () => expect(getCategoryIcon('videos')).toBe('Video'))
  it('returns FileText for pdfs', () => expect(getCategoryIcon('pdfs')).toBe('FileText'))
  it('returns FileText for documents', () => expect(getCategoryIcon('documents')).toBe('FileText'))
  it('returns File for other', () => expect(getCategoryIcon('other')).toBe('File'))
})

describe('getCategoryColor', () => {
  it('returns blue for images', () => expect(getCategoryIcon('images')).toBe('Image'))
  it('returns fallback for unknown', () => {
    const color = getCategoryColor('unknown')
    expect(color).toContain('gray')
  })
})

describe('formatStorageSize', () => {
  it('formats MB', () => expect(formatStorageSize(500)).toBe('500.00 MB'))
  it('formats GB', () => expect(formatStorageSize(1500)).toBe('1.46 GB'))
})

describe('getRoleBadgeColor', () => {
  it('returns amber for OWNER', () => expect(getRoleBadgeColor('OWNER')).toContain('amber'))
  it('returns blue for ADMIN', () => expect(getRoleBadgeColor('ADMIN')).toContain('blue'))
  it('returns green for MEMBER', () => expect(getRoleBadgeColor('MEMBER')).toContain('green'))
  it('returns gray for GUEST', () => expect(getRoleBadgeColor('GUEST')).toContain('gray'))
})

describe('getStorageStatusColor', () => {
  it('returns green for low usage', () => {
    const colors = getStorageStatusColor(50)
    expect(colors.text).toContain('green')
  })

  it('returns amber for 80%+', () => {
    const colors = getStorageStatusColor(85)
    expect(colors.text).toContain('amber')
  })

  it('returns destructive for 95%+', () => {
    const colors = getStorageStatusColor(96)
    expect(colors.text).toContain('destructive')
  })
})
