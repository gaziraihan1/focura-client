import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FocusModeBar } from '@/components/Dashboard/KanbanView/ExecutionControlBar/FocusModeBar'

describe('FocusModeBar', () => {
  it('renders focus mode message', () => {
    render(<FocusModeBar />)
    expect(screen.getByText(/Focus Mode/)).toBeInTheDocument()
  })
})
