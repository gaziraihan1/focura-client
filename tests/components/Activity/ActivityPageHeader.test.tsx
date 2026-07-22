import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ActivityPageHeader } from '@/components/Dashboard/ActivityLogs/ActivityPageHeader'

describe('ActivityPageHeader', () => {
  const onRefresh = vi.fn()
  const onClearAll = vi.fn()

  beforeEach(() => vi.clearAllMocks())

  it('renders the title', () => {
    render(<ActivityPageHeader onRefresh={onRefresh} onClearAll={onClearAll} />)
    expect(screen.getByText('Activity Feed')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<ActivityPageHeader onRefresh={onRefresh} onClearAll={onClearAll} />)
    expect(screen.getByText(/Track all activities/)).toBeInTheDocument()
  })

  it('renders refresh button', () => {
    render(<ActivityPageHeader onRefresh={onRefresh} onClearAll={onClearAll} />)
    expect(screen.getByText('Refresh')).toBeInTheDocument()
  })

  it('renders clear all button', () => {
    render(<ActivityPageHeader onRefresh={onRefresh} onClearAll={onClearAll} />)
    expect(screen.getByText('Clear All')).toBeInTheDocument()
  })

  it('calls onRefresh when refresh is clicked', () => {
    render(<ActivityPageHeader onRefresh={onRefresh} onClearAll={onClearAll} />)
    fireEvent.click(screen.getByText('Refresh'))
    expect(onRefresh).toHaveBeenCalled()
  })

  it('calls onClearAll when clear all is clicked', () => {
    render(<ActivityPageHeader onRefresh={onRefresh} onClearAll={onClearAll} />)
    fireEvent.click(screen.getByText('Clear All'))
    expect(onClearAll).toHaveBeenCalled()
  })
})
