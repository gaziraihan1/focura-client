import { describe, it, expect, vi } from 'vitest'
import { kpisCard, statusChartData } from '@/constants/analytics.constants'

vi.mock('@/utils/analytics.utils', () => ({
  formatHours: (hours: number) => `${hours}h`,
}))

describe('analytics.constants', () => {
  describe('kpisCard', () => {
    const mockKpis = {
      totalProjects: 10,
      activeProjects: 5,
      totalTasks: 100,
      completedTasks: 60,
      overdueTasks: 10,
      completionRate: 60,
      totalMembers: 8,
      activeMembers: 6,
      totalHours: 120,
      storageUsed: 512.5,
    }

    it('returns 10 cards', () => {
      const { cards } = kpisCard({ kpis: mockKpis })
      expect(cards).toHaveLength(10)
    })

    it('each card has label, value, icon, color, bgColor', () => {
      const { cards } = kpisCard({ kpis: mockKpis })
      cards.forEach(card => {
        expect(card.label).toBeTruthy()
        expect(card.value).toBeTruthy()
        expect(card.icon).toBeTruthy()
        expect(card.color).toBeTruthy()
        expect(card.bgColor).toBeTruthy()
      })
    })

    it('Total Projects card has correct value', () => {
      const { cards } = kpisCard({ kpis: mockKpis })
      const totalProjects = cards.find(c => c.label === 'Total Projects')
      expect(totalProjects).toBeDefined()
      expect(totalProjects!.value).toBe(10)
    })

    it('Completion Rate card shows percentage', () => {
      const { cards } = kpisCard({ kpis: mockKpis })
      const rate = cards.find(c => c.label === 'Completion Rate')
      expect(rate).toBeDefined()
      expect(rate!.value).toBe('60%')
    })

    it('Storage Used card shows formatted value', () => {
      const { cards } = kpisCard({ kpis: mockKpis })
      const storage = cards.find(c => c.label === 'Storage Used')
      expect(storage).toBeDefined()
      expect(storage!.value).toContain('MB')
    })

    it('Hours Logged card uses formatHours', () => {
      const { cards } = kpisCard({ kpis: mockKpis })
      const hours = cards.find(c => c.label === 'Hours Logged')
      expect(hours).toBeDefined()
      expect(hours!.value).toBe('120h')
    })

    it('Active Members card has subtitle "Last 7 days"', () => {
      const { cards } = kpisCard({ kpis: mockKpis })
      const active = cards.find(c => c.label === 'Active Members')
      expect(active).toBeDefined()
      expect(active!.subtitle).toBe('Last 7 days')
    })
  })

  describe('statusChartData', () => {
    it('calculates total from data', () => {
      const data = [
        { status: 'TODO', count: 10 },
        { status: 'COMPLETED', count: 20 },
      ]
      const result = statusChartData({ data })
      expect(result.total).toBe(30)
    })

    it('returns 6 colors', () => {
      const data = [{ status: 'TODO', count: 10 }]
      const result = statusChartData({ data })
      expect(result.colors).toHaveLength(6)
    })

    it('generates conic gradient string', () => {
      const data = [
        { status: 'TODO', count: 50 },
        { status: 'COMPLETED', count: 50 },
      ]
      const result = statusChartData({ data })
      expect(result.conicGradient).toContain('rgb(')
      expect(result.conicGradient).toContain('0%')
      expect(result.conicGradient).toContain('100%')
    })

    it('handles single item', () => {
      const data = [{ status: 'COMPLETED', count: 10 }]
      const result = statusChartData({ data })
      expect(result.total).toBe(10)
      expect(result.conicGradient).toContain('0%')
      expect(result.conicGradient).toContain('100%')
    })

    it('calculates correct segment percentages', () => {
      const data = [
        { status: 'TODO', count: 25 },
        { status: 'IN_PROGRESS', count: 25 },
        { status: 'COMPLETED', count: 50 },
      ]
      const result = statusChartData({ data })
      expect(result.total).toBe(100)
      expect(result.conicGradient).toContain('25%')
      expect(result.conicGradient).toContain('50%')
      expect(result.conicGradient).toContain('100%')
    })
  })
})
