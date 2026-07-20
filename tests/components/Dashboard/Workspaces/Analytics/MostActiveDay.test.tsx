import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('lucide-react', () => {
  const React = require('react')
  const mock = (name: string) => {
    const Cmp = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    Loader2: mock('loader2'),
    AlertTriangle: mock('alert-triangle'),
    BarChart3: mock('bar-chart3'),
    Folder: mock('folder'),
    CheckCircle2: mock('check-circle2'),
    CheckCircle: mock('check-circle'),
    AlertCircle: mock('alert-circle'),
    Clock: mock('clock'),
    Users: mock('users'),
    TrendingUp: mock('trending-up'),
    Crown: mock('crown'),
    User: mock('user'),
    Calendar: mock('calendar'),
    Activity: mock('activity'),
    Flame: mock('flame'),
    Search: mock('search'),
    ArrowUpDown: mock('arrow-up-down'),
    ArrowUp: mock('arrow-up'),
    ArrowDown: mock('arrow-down'),
    Megaphone: mock('megaphone'),
    Menu: mock('menu'),
    X: mock('x'),
    ChevronLeft: mock('chevron-left'),
    Pin: mock('pin'),
    Trash2: mock('trash2'),
    Globe: mock('globe'),
    Lock: mock('lock'),
    Plus: mock('plus'),
    Building2: mock('building2'),
    HardDrive: mock('hard-drive'),
    Timer: mock('timer'),
    LayoutGrid: mock('layout-grid'),
    Zap: mock('zap'),
    Infinity: mock('infinity'),
    Bold: mock('bold'),
    Italic: mock('italic'),
    Code2: mock('code2'),
    Link2: mock('link2'),
    CornerDownLeft: mock('corner-down-left'),
    Check: mock('check'),
    Copy: mock('copy'),
    FolderOpen: mock('folder-open'),
    RotateCcw: mock('rotate-ccw'),
    ArrowLeft: mock('arrow-left'),
    UserCircle2: mock('user-circle2'),
  }
})

import { MostActiveDay } from '@/components/Dashboard/Workspaces/Analytics/MostActiveDay'
import type { MostActiveDay as MostActiveDayType } from '@/hooks/useAnalytics'

const mockMostActiveDayData: MostActiveDayType = {
  day: 'Monday',
  count: 45,
  mostCommonAction: 'CREATED',
}

describe('MostActiveDay', () => {
  it('renders peak activity day title', () => {
    render(<MostActiveDay data={mockMostActiveDayData} />)
    expect(screen.getByText('Peak Activity Day')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days analysis')).toBeInTheDocument()
  })

  it('displays the day name', () => {
    render(<MostActiveDay data={mockMostActiveDayData} />)
    expect(screen.getByText('Monday')).toBeInTheDocument()
  })

  it('shows activity count', () => {
    render(<MostActiveDay data={mockMostActiveDayData} />)
    expect(screen.getByText('45 activities')).toBeInTheDocument()
  })

  it('shows singular "activity" for count of 1', () => {
    const oneActivity: MostActiveDayType = { ...mockMostActiveDayData, count: 1 }
    render(<MostActiveDay data={oneActivity} />)
    expect(screen.getByText('1 activity')).toBeInTheDocument()
  })

  it('displays most common action', () => {
    render(<MostActiveDay data={mockMostActiveDayData} />)
    expect(screen.getByText('Most common: Creating')).toBeInTheDocument()
  })

  it('shows "No data" when day is empty', () => {
    const noData: MostActiveDayType = { ...mockMostActiveDayData, day: '' }
    render(<MostActiveDay data={noData} />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('hides most common action when NONE', () => {
    const noneAction: MostActiveDayType = { ...mockMostActiveDayData, mostCommonAction: 'NONE' }
    render(<MostActiveDay data={noneAction} />)
    expect(screen.queryByText(/Most common/)).not.toBeInTheDocument()
  })

  it('shows raw action label when not in predefined map', () => {
    const customAction: MostActiveDayType = { ...mockMostActiveDayData, mostCommonAction: 'CUSTOM_ACTION' }
    render(<MostActiveDay data={customAction} />)
    expect(screen.getByText('Most common: CUSTOM_ACTION')).toBeInTheDocument()
  })

  it('maps all known activity labels', () => {
    const actions = ['CREATED', 'UPDATED', 'COMPLETED', 'ASSIGNED', 'COMMENTED', 'UPLOADED']
    const labels = ['Creating', 'Updating', 'Completing', 'Assigning', 'Commenting', 'Uploading']
    actions.forEach((action, i) => {
      const data: MostActiveDayType = { ...mockMostActiveDayData, mostCommonAction: action }
      const { unmount } = render(<MostActiveDay data={data} />)
      expect(screen.getByText(`Most common: ${labels[i]}`)).toBeInTheDocument()
      unmount()
    })
  })
})
