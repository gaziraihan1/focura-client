import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ShortcutsCard } from '@/components/Dashboard/ShortcutsCard'

describe('ShortcutsCard', () => {
  it('renders children', () => {
    render(<ShortcutsCard inner={<div>Test content</div>} />)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('dispatches keyboard event on click', async () => {
    const dispatchSpy = vi.spyOn(document, 'dispatchEvent')
    const user = userEvent.setup()
    render(<ShortcutsCard inner={<div>Click me</div>} />)
    
    await user.click(screen.getByText('Click me'))
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
      })
    )
    dispatchSpy.mockRestore()
  })
})
