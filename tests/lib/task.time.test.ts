import { describe, it, expect } from 'vitest'
import { getTaskTimeInfo } from '@/lib/task/time'

describe('getTaskTimeInfo', () => {
  it('returns null hours when no dueDate', () => {
    const result = getTaskTimeInfo({ dueDate: null, status: 'TODO' })
    expect(result.isOverdue).toBe(false)
    expect(result.isDueToday).toBe(false)
    expect(result.hoursUntilDue).toBeNull()
  })

  it('returns null hours when dueDate is undefined', () => {
    const result = getTaskTimeInfo({ status: 'TODO' })
    expect(result.hoursUntilDue).toBeNull()
  })

  it('detects overdue task', () => {
    const past = new Date(Date.now() - 86400000).toISOString()
    const result = getTaskTimeInfo({ dueDate: past, status: 'TODO' })
    expect(result.isOverdue).toBe(true)
  })

  it('does not mark completed task as overdue', () => {
    const past = new Date(Date.now() - 86400000).toISOString()
    const result = getTaskTimeInfo({ dueDate: past, status: 'COMPLETED' })
    expect(result.isOverdue).toBe(false)
  })

  it('does not mark DONE task as overdue', () => {
    const past = new Date(Date.now() - 86400000).toISOString()
    const result = getTaskTimeInfo({ dueDate: past, status: 'DONE' })
    expect(result.isOverdue).toBe(false)
  })

  it('detects due today', () => {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    const result = getTaskTimeInfo({ dueDate: today.toISOString(), status: 'TODO' })
    expect(result.isDueToday).toBe(true)
  })

  it('does not mark completed as due today', () => {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    const result = getTaskTimeInfo({ dueDate: today.toISOString(), status: 'COMPLETED' })
    expect(result.isDueToday).toBe(false)
  })

  it('returns positive hoursUntilDue for future task', () => {
    const future = new Date(Date.now() + 86400000).toISOString()
    const result = getTaskTimeInfo({ dueDate: future, status: 'TODO' })
    expect(result.hoursUntilDue).toBeGreaterThan(0)
  })

  it('returns null hoursUntilDue for past task', () => {
    const past = new Date(Date.now() - 86400000).toISOString()
    const result = getTaskTimeInfo({ dueDate: past, status: 'TODO' })
    expect(result.hoursUntilDue).toBeNull()
  })
})
