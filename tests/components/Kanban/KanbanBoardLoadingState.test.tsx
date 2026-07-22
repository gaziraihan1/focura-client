import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KanbanBoardLoadingState } from '@/components/Dashboard/KanbanView/KanbanBoard/KanbanBoardLoadingState'

describe('KanbanBoardLoadingState', () => {
  it('renders loading message', () => {
    render(<KanbanBoardLoadingState />)
    expect(screen.getByText('Loading board...')).toBeInTheDocument()
  })
})
