import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShortcutsCard } from '@/components/Dashboard/ShortcutsCard'

describe('ShortcutsCard', () => {
  it('renders children content', () => {
    render(
      <ShortcutsCard inner={<div>Test content</div>} />
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('dispatches keyboard event on click', async () => {
    const dispatchEventSpy = vi.spyOn(document, 'dispatchEvent')
    const user = userEvent.setup()

    render(
      <ShortcutsCard inner={<div>Click me</div>} />
    )

    await user.click(screen.getByText('Click me'))

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
        key: 'k',
        metaKey: true,
        ctrlKey: true,
        bubbles: true,
      })
    )

    dispatchEventSpy.mockRestore()
  })

  it('renders with block display class', () => {
    const { container } = render(
      <ShortcutsCard inner={<div>Test</div>} />
    )

    expect(container.firstChild).toHaveClass('block')
  })
})
