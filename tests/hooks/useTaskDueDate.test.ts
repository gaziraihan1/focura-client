import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  useTaskDueDate,
  shouldSendReminder,
  getUrgencyClasses,
} from '@/hooks/useTaskDueDate'
import type { Task } from '@/hooks/useTask'

// ─── Test Helpers ──────────────────────────────────────────────────────────────

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Test Task',
    description: null,
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    startDate: null,
    completedAt: null,
    estimatedHours: null,
    actualHours: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    projectId: null,
    intent: 'EXECUTION',
    createdBy: { id: 'u-1', name: 'Test User' },
    assignees: [],
    labels: [],
    _count: { comments: 0, subtasks: 0, files: 0 },
    ...overrides,
  }
}

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

// ─── useTaskDueDate Hook Tests ─────────────────────────────────────────────────

describe('useTaskDueDate', () => {
  // ── No due date ────────────────────────────────────────────────────────────

  describe('task with no due date', () => {
    it('returns hasDueDate false', () => {
      const task = createTask({ dueDate: null })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.hasDueDate).toBe(false)
    })

    it('returns urgency "normal"', () => {
      const task = createTask({ dueDate: null })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.urgency).toBe('normal')
    })

    it('returns timeRemaining "No due date"', () => {
      const task = createTask({ dueDate: null })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.timeRemaining).toBe('No due date')
    })

    it('returns hoursUntilDue null', () => {
      const task = createTask({ dueDate: null })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.hoursUntilDue).toBeNull()
    })

    it('returns isOverdue false', () => {
      const task = createTask({ dueDate: null })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isOverdue).toBe(false)
    })

    it('returns isDueToday false', () => {
      const task = createTask({ dueDate: null })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isDueToday).toBe(false)
    })

    it('returns isDueSoon false', () => {
      const task = createTask({ dueDate: null })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isDueSoon).toBe(false)
    })
  })

  // ── Overdue tasks ──────────────────────────────────────────────────────────

  describe('overdue task', () => {
    it('isOverdue true when past due date and not completed', () => {
      const task = createTask({ dueDate: hoursAgo(5), status: 'TODO' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isOverdue).toBe(true)
    })

    it('urgency is "overdue"', () => {
      const task = createTask({ dueDate: hoursAgo(5), status: 'IN_PROGRESS' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.urgency).toBe('overdue')
    })

    it('shows "overdue" in timeRemaining text', () => {
      const task = createTask({ dueDate: hoursAgo(5), status: 'TODO' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.timeRemaining).toContain('overdue')
    })

    it('shows days overdue when >= 24h', () => {
      const task = createTask({ dueDate: hoursAgo(72), status: 'TODO' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.timeRemaining).toBe('3d overdue')
    })

    it('hoursUntilDue is negative', () => {
      const task = createTask({ dueDate: hoursAgo(3), status: 'TODO' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.hoursUntilDue).toBeLessThan(0)
    })
  })

  // ── Completed tasks ────────────────────────────────────────────────────────

  describe('completed task', () => {
    it('isOverdue false even when past due date', () => {
      const task = createTask({ dueDate: hoursAgo(5), status: 'COMPLETED' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isOverdue).toBe(false)
    })

    it('isCompleted true for COMPLETED status', () => {
      const task = createTask({ status: 'COMPLETED' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isCompleted).toBe(true)
    })

    it('isCompleted true for CANCELLED status', () => {
      const task = createTask({ status: 'CANCELLED' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isCompleted).toBe(true)
    })

    it('timeRemaining shows "Completed"', () => {
      const task = createTask({ dueDate: hoursAgo(5), status: 'COMPLETED' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.timeRemaining).toBe('Completed')
    })

    it('urgency is "normal" for completed tasks', () => {
      // Use a far-future date so isDueToday is false
      const task = createTask({ dueDate: hoursFromNow(48), status: 'COMPLETED' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.urgency).toBe('normal')
    })

    it('isDueSoon false for completed tasks even when within threshold', () => {
      const task = createTask({ dueDate: hoursFromNow(2), status: 'COMPLETED' })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isDueSoon).toBe(false)
    })
  })

  // ── Due today ──────────────────────────────────────────────────────────────

  describe('task due today', () => {
    it('isDueToday true', () => {
      const task = createTask({ dueDate: hoursFromNow(5) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isDueToday).toBe(true)
    })

    it('urgency is "due-today"', () => {
      const task = createTask({ dueDate: hoursFromNow(5) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.urgency).toBe('due-today')
    })

    it('isOverdue false when due today but not yet past', () => {
      const task = createTask({ dueDate: hoursFromNow(2) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isOverdue).toBe(false)
    })
  })

  // ── Due soon ───────────────────────────────────────────────────────────────

  describe('task due soon', () => {
    it('isDueSoon true when within default 6h threshold', () => {
      const task = createTask({ dueDate: hoursFromNow(3) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isDueSoon).toBe(true)
    })

    it('isDueSoon false when beyond threshold', () => {
      const task = createTask({ dueDate: hoursFromNow(10) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.isDueSoon).toBe(false)
    })

    it('urgency is "due-soon" when not due today', () => {
      // Use a date just past midnight tomorrow to avoid isDueToday
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(1, 0, 0, 0)
      const task = createTask({ dueDate: tomorrow.toISOString() })
      const { result } = renderHook(() => useTaskDueDate(task))
      // If it's within 6h of now, it's due-soon; otherwise it might be normal
      const hoursUntil = (tomorrow.getTime() - Date.now()) / (1000 * 60 * 60)
      if (hoursUntil <= 6) {
        expect(result.current.urgency).toBe('due-soon')
      } else {
        expect(result.current.urgency).toBe('normal')
      }
    })

    it('shows "left" in timeRemaining', () => {
      const task = createTask({ dueDate: hoursFromNow(3) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.timeRemaining).toContain('left')
    })

    it('custom soonThresholdHours works', () => {
      const task = createTask({ dueDate: hoursFromNow(4) })
      const { result } = renderHook(() => useTaskDueDate(task, 3))
      expect(result.current.isDueSoon).toBe(false)
    })

    it('isDueSoon true when within custom threshold', () => {
      const task = createTask({ dueDate: hoursFromNow(2) })
      const { result } = renderHook(() => useTaskDueDate(task, 3))
      expect(result.current.isDueSoon).toBe(true)
    })
  })

  // ── Normal (future, not due soon) ──────────────────────────────────────────

  describe('normal future task', () => {
    it('urgency is "normal"', () => {
      const task = createTask({ dueDate: hoursFromNow(48) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.urgency).toBe('normal')
    })

    it('shows days left for far future tasks', () => {
      const task = createTask({ dueDate: hoursFromNow(72) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.timeRemaining).toMatch(/\d+d left/)
    })

    it('hoursUntilDue is positive', () => {
      const task = createTask({ dueDate: hoursFromNow(24) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.hoursUntilDue).toBeGreaterThan(0)
    })
  })

  // ── Boundary cases ─────────────────────────────────────────────────────────

  describe('boundary cases', () => {
    it('hasDueDate true when due date is set', () => {
      const task = createTask({ dueDate: hoursFromNow(24) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.hasDueDate).toBe(true)
    })

    it('dueDate is a Date object', () => {
      const task = createTask({ dueDate: hoursFromNow(24) })
      const { result } = renderHook(() => useTaskDueDate(task))
      expect(result.current.dueDate).toBeInstanceOf(Date)
    })
  })
})

// ─── shouldSendReminder Tests ──────────────────────────────────────────────────

describe('shouldSendReminder', () => {
  it('returns false when no due date', () => {
    const task = createTask({ dueDate: null })
    expect(shouldSendReminder(task)).toBe(false)
  })

  it('returns false when task is COMPLETED', () => {
    const task = createTask({ dueDate: hoursFromNow(2), status: 'COMPLETED' })
    expect(shouldSendReminder(task)).toBe(false)
  })

  it('returns false when task is CANCELLED', () => {
    const task = createTask({ dueDate: hoursFromNow(2), status: 'CANCELLED' })
    expect(shouldSendReminder(task)).toBe(false)
  })

  it('returns true when within default 3h reminder', () => {
    const task = createTask({ dueDate: hoursFromNow(2) })
    expect(shouldSendReminder(task)).toBe(true)
  })

  it('returns true when within default 6h reminder', () => {
    const task = createTask({ dueDate: hoursFromNow(5) })
    expect(shouldSendReminder(task)).toBe(true)
  })

  it('returns false when beyond all reminder windows', () => {
    const task = createTask({ dueDate: hoursFromNow(10) })
    expect(shouldSendReminder(task)).toBe(false)
  })

  it('returns false when overdue', () => {
    const task = createTask({ dueDate: hoursAgo(2) })
    expect(shouldSendReminder(task)).toBe(false)
  })

  it('respects custom reminder hours', () => {
    // Task due in 2 hours — within [1, 2] window but beyond [0.5, 1] window
    const task = createTask({ dueDate: hoursFromNow(2) })
    expect(shouldSendReminder(task, [1, 2])).toBe(true)
    expect(shouldSendReminder(task, [0.5, 1])).toBe(false)
  })
})

// ─── getUrgencyClasses Tests ───────────────────────────────────────────────────

describe('getUrgencyClasses', () => {
  it('returns red classes for overdue', () => {
    const classes = getUrgencyClasses('overdue')
    expect(classes).toContain('text-red-600')
    expect(classes).toContain('bg-red-50')
    expect(classes).toContain('border-red-200')
  })

  it('returns orange classes for due-today', () => {
    const classes = getUrgencyClasses('due-today')
    expect(classes).toContain('text-orange-600')
    expect(classes).toContain('bg-orange-50')
    expect(classes).toContain('border-orange-200')
  })

  it('returns yellow classes for due-soon', () => {
    const classes = getUrgencyClasses('due-soon')
    expect(classes).toContain('text-yellow-600')
    expect(classes).toContain('bg-yellow-50')
    expect(classes).toContain('border-yellow-200')
  })

  it('returns muted classes for normal', () => {
    const classes = getUrgencyClasses('normal')
    expect(classes).toContain('text-muted-foreground')
    expect(classes).toContain('bg-muted/50')
    expect(classes).toContain('border-border')
  })
})
