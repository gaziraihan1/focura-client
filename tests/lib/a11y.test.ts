import { describe, it, expect, vi } from 'vitest'
import { announce, announceError } from '@/lib/a11y'

describe('announce', () => {
  it('sets text content on the announcer element', () => {
    const announcer = document.createElement('div')
    announcer.id = 'toast-announcer'
    document.body.appendChild(announcer)

    announce('Task created successfully')

    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        expect(announcer.textContent).toBe('Task created successfully')
        document.body.removeChild(announcer)
        resolve(undefined)
      })
    })
  })

  it('does nothing when announcer element is not found', () => {
    // Should not throw
    expect(() => announce('Test message')).not.toThrow()
  })
})

describe('announceError', () => {
  it('calls announce without throwing', () => {
    const announcer = document.createElement('div')
    announcer.id = 'toast-announcer-assertive'
    document.body.appendChild(announcer)

    expect(() => announceError('Error occurred')).not.toThrow()

    document.body.removeChild(announcer)
  })

  it('does nothing when assertive announcer is not found', () => {
    expect(() => announceError('Error occurred')).not.toThrow()
  })
})
