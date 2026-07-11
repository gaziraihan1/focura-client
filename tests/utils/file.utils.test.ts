import { describe, it, expect } from 'vitest'
import {
  formatFileSize,
  getFileIcon,
  getFileCategory,
  getFileCategoryColor,
  formatRelativeTime,
  isImageFile,
  canPreview,
} from '@/utils/file.utils'

describe('formatFileSize', () => {
  it('returns 0 B for 0', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500.00 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.00 MB')
  })

  it('formats gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1.00 GB')
  })
})

describe('getFileIcon', () => {
  it('returns correct icons', () => {
    expect(getFileIcon('image/png')).toBe('🖼️')
    expect(getFileIcon('video/mp4')).toBe('🎥')
    expect(getFileIcon('audio/mp3')).toBe('🎵')
    expect(getFileIcon('application/pdf')).toBe('📄')
    expect(getFileIcon('application/msword')).toBe('📝')
    expect(getFileIcon('application/vnd.ms-excel')).toBe('📊')
    expect(getFileIcon('application/vnd.ms-powerpoint')).toBe('📽️')
    expect(getFileIcon('application/zip')).toBe('📦')
    expect(getFileIcon('application/x-rar')).toBe('📦')
    expect(getFileIcon('text/plain')).toBe('📁')
  })
})

describe('getFileCategory', () => {
  it('returns correct categories', () => {
    expect(getFileCategory('image/png')).toBe('image')
    expect(getFileCategory('video/mp4')).toBe('video')
    expect(getFileCategory('audio/mp3')).toBe('audio')
    expect(getFileCategory('application/pdf')).toBe('pdf')
    expect(getFileCategory('application/msword')).toBe('document')
    // Note: getFileCategory checks for 'presentation' but NOT 'powerpoint'
    // so application/vnd.ms-powerpoint returns 'other' (the icon function does check for powerpoint)
    expect(getFileCategory('application/vnd.ms-excel')).toBe('other')
    expect(getFileCategory('application/vnd.ms-powerpoint')).toBe('other')
    expect(getFileCategory('application/zip')).toBe('archive')
    expect(getFileCategory('application/x-7z-compressed')).toBe('archive')
    expect(getFileCategory('text/plain')).toBe('other')
  })
})

describe('getFileCategoryColor', () => {
  it('returns correct colors', () => {
    expect(getFileCategoryColor('image')).toContain('purple')
    expect(getFileCategoryColor('video')).toContain('red')
    expect(getFileCategoryColor('audio')).toContain('blue')
    expect(getFileCategoryColor('pdf')).toContain('red')
    expect(getFileCategoryColor('document')).toContain('blue')
    expect(getFileCategoryColor('archive')).toContain('amber')
    expect(getFileCategoryColor('other')).toContain('gray')
  })

  it('returns other for unknown category', () => {
    expect(getFileCategoryColor('unknown')).toContain('gray')
  })
})

describe('formatRelativeTime', () => {
  it('returns Just now for very recent', () => {
    expect(formatRelativeTime(new Date())).toBe('Just now')
  })

  it('returns minutes ago', () => {
    const d = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(d)).toBe('5m ago')
  })

  it('returns hours ago', () => {
    const d = new Date(Date.now() - 3 * 3600 * 1000)
    expect(formatRelativeTime(d)).toBe('3h ago')
  })

  it('returns days ago', () => {
    const d = new Date(Date.now() - 3 * 86400 * 1000)
    expect(formatRelativeTime(d)).toBe('3d ago')
  })

  it('returns formatted date for > 30 days', () => {
    const d = new Date(Date.now() - 40 * 86400 * 1000)
    const result = formatRelativeTime(d)
    expect(result).toContain('20')
  })

  it('handles string input', () => {
    expect(formatRelativeTime(new Date().toISOString())).toBe('Just now')
  })
})

describe('isImageFile', () => {
  it('returns true for image mime types', () => {
    expect(isImageFile('image/png')).toBe(true)
    expect(isImageFile('image/jpeg')).toBe(true)
  })

  it('returns false for non-image types', () => {
    expect(isImageFile('video/mp4')).toBe(false)
    expect(isImageFile('text/plain')).toBe(false)
  })
})

describe('canPreview', () => {
  it('returns true for previewable types', () => {
    expect(canPreview('image/png')).toBe(true)
    expect(canPreview('application/pdf')).toBe(true)
    expect(canPreview('video/mp4')).toBe(true)
    expect(canPreview('audio/mp3')).toBe(true)
  })

  it('returns false for non-previewable types', () => {
    expect(canPreview('text/plain')).toBe(false)
    expect(canPreview('application/zip')).toBe(false)
  })
})
