import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CapacityScheduleForm } from '@/components/Settings/CapacityScheduleForm'

vi.mock('lucide-react', () => ({
  Clock: (props: any) => <svg data-testid="clock-icon" {...props} />,
  Calendar: (props: any) => <svg data-testid="calendar-icon" {...props} />,
  Brain: (props: any) => <svg data-testid="brain-icon" {...props} />,
  Save: (props: any) => <svg data-testid="save-icon" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader-icon" {...props} />,
}))

const mockUpdateCapacity = vi.fn()
const mockUpdateSchedule = vi.fn()

const mockCapacity = { dailyCapacityHours: 8, weeklyHours: 40, deepWorkHours: 4 }
const mockSchedule = { workDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'], workStartHour: 9, workEndHour: 17 }

vi.mock('@/hooks/useUserSettings', () => ({
  useUserCapacity: () => ({
    data: mockCapacity,
    loading: false,
    updateCapacity: mockUpdateCapacity,
  }),
  useUserSchedule: () => ({
    data: mockSchedule,
    loading: false,
    updateSchedule: mockUpdateSchedule,
  }),
}))

describe('CapacityScheduleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders daily capacity section', () => {
    render(<CapacityScheduleForm />)
    expect(screen.getByText('Daily Capacity')).toBeInTheDocument()
  })

  it('renders work schedule section', () => {
    render(<CapacityScheduleForm />)
    expect(screen.getByText('Work Schedule')).toBeInTheDocument()
  })

  it('renders about settings section', () => {
    render(<CapacityScheduleForm />)
    expect(screen.getByText('About These Settings')).toBeInTheDocument()
  })

  it('renders save button', () => {
    render(<CapacityScheduleForm />)
    expect(screen.getByText('Save Settings')).toBeInTheDocument()
  })

  it('renders daily hours value', () => {
    render(<CapacityScheduleForm />)
    expect(screen.getByText('8h / day')).toBeInTheDocument()
  })

  it('renders weekly hours value', () => {
    render(<CapacityScheduleForm />)
    expect(screen.getByText('40h / week')).toBeInTheDocument()
  })

  it('renders deep work hours value', () => {
    render(<CapacityScheduleForm />)
    expect(screen.getByText('4h / day')).toBeInTheDocument()
  })

  it('renders all 7 day buttons', () => {
    render(<CapacityScheduleForm />)
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Thu')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('calls updateCapacity and updateSchedule on save', async () => {
    mockUpdateCapacity.mockResolvedValue(undefined)
    mockUpdateSchedule.mockResolvedValue(undefined)
    render(<CapacityScheduleForm />)
    fireEvent.click(screen.getByText('Save Settings'))
    await waitFor(() => {
      expect(mockUpdateCapacity).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(mockUpdateSchedule).toHaveBeenCalled()
    })
  })
})
