import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DueDateReminderSettings } from '@/components/Settings/DueDateReminderSettings'

vi.mock('lucide-react', () => {

  const mock = (name: string) => {
    const C = (props: Record<string, unknown>) =>
      React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    C.displayName = name
    return C
  }
  return {
    Bell: mock('bell'),
    Clock: mock('clock'),
    Save: mock('save'),
    Loader2: mock('loader2'),
  }
})

vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/axios', () => ({
  api: { put: vi.fn().mockResolvedValue({}) },
}))

vi.mock('@/lib/a11y', () => ({
  announce: vi.fn(),
}))

describe('DueDateReminderSettings', () => {
  it('renders the component title', () => {
    render(<DueDateReminderSettings />)
    expect(screen.getByText('Due Date Reminders')).toBeInTheDocument()
  })

  it('renders enable/disable toggle', () => {
    render(<DueDateReminderSettings />)
    expect(screen.getByText('Enable reminders')).toBeInTheDocument()
  })

  it('shows reminder intervals when enabled', () => {
    render(<DueDateReminderSettings />)
    expect(screen.getByText('Remind me')).toBeInTheDocument()
    expect(screen.getByText('1 hour before')).toBeInTheDocument()
    expect(screen.getByText('3 hours before')).toBeInTheDocument()
    expect(screen.getByText('6 hours before')).toBeInTheDocument()
  })

  it('hides reminder intervals when disabled', () => {
    render(<DueDateReminderSettings initialSettings={{ enabled: false, hoursBeforeDue: [] }} />)
    expect(screen.queryByText('Remind me')).not.toBeInTheDocument()
  })

  it('renders save button', () => {
    render(<DueDateReminderSettings />)
    expect(screen.getByText('Save Settings')).toBeInTheDocument()
  })

  it('toggles enable state', () => {
    render(<DueDateReminderSettings />)
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    // After clicking, the intervals should be hidden
    expect(screen.queryByText('Remind me')).not.toBeInTheDocument()
  })
})
