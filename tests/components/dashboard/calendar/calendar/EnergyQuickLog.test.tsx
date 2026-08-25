import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EnergyQuickLog } from '@/components/dashboard/calendar/calendar/EnergyQuickLog'
import { useEnergyLevel } from '@/hooks/useEnergyLevel'

vi.mock('@/hooks/useEnergyLevel', () => ({
  useEnergyLevel: vi.fn(),
}))

const mockUseEnergyLevel = vi.mocked(useEnergyLevel)

describe('EnergyQuickLog', () => {
  const mockLogEnergy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseEnergyLevel.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      logEnergy: mockLogEnergy,
      refetch: vi.fn(),
    } as any)
  })

  it('renders a floating "Log energy" button', () => {
    render(<EnergyQuickLog />)
    expect(screen.getByRole('button', { name: /log energy/i })).toBeInTheDocument()
  })

  it('opens the popup with slider when clicked', () => {
    render(<EnergyQuickLog />)
    fireEvent.click(screen.getByRole('button', { name: /log energy/i }))

    expect(screen.getByRole('dialog', { name: /energy level/i })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: /energy level 1 to 10/i })).toBeInTheDocument()
  })

  it('pre-fills the slider from today\'s logged energy', () => {
    mockUseEnergyLevel.mockReturnValue({
      data: { energyLevel: 8, note: 'Felt great' },
      loading: false,
      error: null,
      logEnergy: mockLogEnergy,
      refetch: vi.fn(),
    } as any)

    render(<EnergyQuickLog />)
    fireEvent.click(screen.getByRole('button', { name: /log energy/i }))

    const slider = screen.getByRole('slider', { name: /energy level 1 to 10/i }) as HTMLInputElement
    expect(slider.value).toBe('8')
    expect(screen.getByDisplayValue('Felt great')).toBeInTheDocument()
  })

  it('closes the popup when the close button is clicked', () => {
    render(<EnergyQuickLog />)
    fireEvent.click(screen.getByRole('button', { name: /log energy/i }))
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls logEnergy with the selected value on save', async () => {
    mockLogEnergy.mockResolvedValue(true)
    render(<EnergyQuickLog />)
    fireEvent.click(screen.getByRole('button', { name: /log energy/i }))

    const slider = screen.getByRole('slider', { name: /energy level 1 to 10/i })
    fireEvent.change(slider, { target: { value: '7' } })

    fireEvent.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => {
      expect(mockLogEnergy).toHaveBeenCalledWith(
        expect.objectContaining({ energyLevel: 7 })
      )
    })
  })

  it('sends the optional note with the save', async () => {
    mockLogEnergy.mockResolvedValue(true)
    render(<EnergyQuickLog />)
    fireEvent.click(screen.getByRole('button', { name: /log energy/i }))

    fireEvent.change(screen.getByPlaceholderText(/optional note/i), {
      target: { value: 'Slept well' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => {
      expect(mockLogEnergy).toHaveBeenCalledWith(
        expect.objectContaining({ note: 'Slept well' })
      )
    })
  })

  it('shows success state when save succeeds', async () => {
    mockLogEnergy.mockResolvedValue(true)
    render(<EnergyQuickLog />)
    fireEvent.click(screen.getByRole('button', { name: /log energy/i }))
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => {
      expect(screen.getByText('Saved')).toBeInTheDocument()
    })
  })

  it('shows failure state when save fails', async () => {
    mockLogEnergy.mockResolvedValue(false)
    render(<EnergyQuickLog />)
    fireEvent.click(screen.getByRole('button', { name: /log energy/i }))
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument()
    })
  })
})
