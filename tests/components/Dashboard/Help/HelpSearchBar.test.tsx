import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { HelpSearchBar } from '@/components/Dashboard/help/HelpSearchBar'

describe('HelpSearchBar', () => {
  const defaultProps = {
    query: '',
    onChange: vi.fn(),
    onClear: vi.fn(),
  }

  it('renders search input', () => {
    render(<HelpSearchBar {...defaultProps} />)
    expect(screen.getByPlaceholderText(/search guides/i)).toBeInTheDocument()
  })

  it('displays current query value', () => {
    render(<HelpSearchBar {...defaultProps} query="hello" />)
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<HelpSearchBar {...defaultProps} onChange={onChange} />)
    await user.type(screen.getByPlaceholderText(/search guides/i), 'a')
    expect(onChange).toHaveBeenCalled()
  })

  it('shows clear button when query is set', () => {
    render(<HelpSearchBar {...defaultProps} query="test" />)
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('shows keyboard shortcut when query is empty', () => {
    render(<HelpSearchBar {...defaultProps} />)
    expect(screen.getByText('⌘K')).toBeInTheDocument()
  })

  it('calls onClear when clear button clicked', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<HelpSearchBar {...defaultProps} query="test" onClear={onClear} />)
    await user.click(screen.getByLabelText('Clear search'))
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
