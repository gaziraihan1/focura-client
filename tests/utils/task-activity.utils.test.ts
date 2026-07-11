import { describe, it, expect } from 'vitest'
import {
  getActivityIcon,
  getActionColor,
  getActivityDescription,
  getUserInitials,
  groupActivitiesByDate,
} from '@/utils/task-activity.utils'
import type { Activity } from '@/types/task-activity.types'

describe('getActivityIcon', () => {
  it('returns correct icons for all actions', () => {
    expect(getActivityIcon('CREATED')).toBe('Plus')
    expect(getActivityIcon('UPDATED')).toBe('Pencil')
    expect(getActivityIcon('DELETED')).toBe('Trash2')
    expect(getActivityIcon('COMPLETED')).toBe('CheckCircle2')
    expect(getActivityIcon('ASSIGNED')).toBe('Users')
    expect(getActivityIcon('UNASSIGNED')).toBe('Users')
    expect(getActivityIcon('COMMENTED')).toBe('MessageSquare')
    expect(getActivityIcon('UPLOADED')).toBe('Paperclip')
    expect(getActivityIcon('MOVED')).toBe('ArrowRight')
    expect(getActivityIcon('STATUS_CHANGED')).toBe('AlertCircle')
    expect(getActivityIcon('PRIORITY_CHANGED')).toBe('AlertCircle')
  })

  it('returns Circle for unknown action', () => {
    expect(getActivityIcon('UNKNOWN')).toBe('Circle')
  })
})

describe('getActionColor', () => {
  it('returns correct colors for all actions', () => {
    expect(getActionColor('CREATED')).toContain('green')
    expect(getActionColor('ASSIGNED')).toContain('green')
    expect(getActionColor('COMPLETED')).toContain('blue')
    expect(getActionColor('DELETED')).toContain('red')
    expect(getActionColor('UNASSIGNED')).toContain('red')
    expect(getActionColor('UPLOADED')).toContain('purple')
    expect(getActionColor('MOVED')).toContain('purple')
    expect(getActionColor('COMMENTED')).toContain('indigo')
    expect(getActionColor('UPDATED')).toContain('yellow')
    expect(getActionColor('STATUS_CHANGED')).toContain('yellow')
    expect(getActionColor('PRIORITY_CHANGED')).toContain('yellow')
  })

  it('returns default gray for unknown action', () => {
    expect(getActionColor('UNKNOWN')).toContain('gray')
  })
})

describe('getActivityDescription', () => {
  it('returns correct description for CREATED', () => {
    expect(getActivityDescription('CREATED')).toBe('created a task')
  })

  it('returns correct description for CREATED with ANNOUNCEMENT entityType', () => {
    expect(getActivityDescription('CREATED', undefined, 'ANNOUNCEMENT')).toBe('created an announcement')
  })

  it('returns correct description for UPDATED with changes', () => {
    const metadata = { changes: { title: 'new title', status: 'DONE' } }
    expect(getActivityDescription('UPDATED', metadata)).toContain('updated title, status on this task')
  })

  it('returns correct description for UPDATED without changes', () => {
    expect(getActivityDescription('UPDATED')).toBe('updated this task')
  })

  it('returns correct description for UPDATED with COMMENT entityType', () => {
    expect(getActivityDescription('UPDATED', undefined, 'COMMENT')).toBe('edited a comment')
  })

  it('returns correct description for COMPLETED', () => {
    expect(getActivityDescription('COMPLETED')).toBe('completed this task')
  })

  it('returns correct description for DELETED', () => {
    expect(getActivityDescription('DELETED')).toBe('deleted a task')
  })

  it('returns correct description for DELETED with COMMENT entityType', () => {
    expect(getActivityDescription('DELETED', undefined, 'COMMENT')).toBe('deleted a comment')
  })

  it('returns correct description for DELETED with FILE entityType', () => {
    expect(getActivityDescription('DELETED', undefined, 'FILE')).toBe('deleted an attachment')
  })

  it('returns correct description for DELETED with ANNOUNCEMENT entityType', () => {
    expect(getActivityDescription('DELETED', undefined, 'ANNOUNCEMENT')).toBe('deleted an announcement')
  })

  it('returns correct description for STATUS_CHANGED with newStatus', () => {
    const metadata = { newStatus: 'IN_PROGRESS' }
    expect(getActivityDescription('STATUS_CHANGED', metadata)).toBe('changed task status to IN PROGRESS')
  })

  it('returns correct description for STATUS_CHANGED without newStatus', () => {
    expect(getActivityDescription('STATUS_CHANGED')).toBe('changed the task status')
  })

  it('returns correct description for PRIORITY_CHANGED with newPriority', () => {
    const metadata = { newPriority: 'HIGH' }
    expect(getActivityDescription('PRIORITY_CHANGED', metadata)).toBe('changed task priority to HIGH')
  })

  it('returns correct description for PRIORITY_CHANGED without newPriority', () => {
    expect(getActivityDescription('PRIORITY_CHANGED')).toBe('changed the task priority')
  })

  it('returns correct description for ASSIGNED with assigneeName', () => {
    const metadata = { assigneeName: 'John' }
    expect(getActivityDescription('ASSIGNED', metadata)).toBe('assigned John to this task')
  })

  it('returns correct description for ASSIGNED without assigneeName', () => {
    expect(getActivityDescription('ASSIGNED')).toBe('assigned a member to this task')
  })

  it('returns correct description for UNASSIGNED with assigneeName', () => {
    const metadata = { assigneeName: 'John' }
    expect(getActivityDescription('UNASSIGNED', metadata)).toBe('removed John from this task')
  })

  it('returns correct description for UNASSIGNED without assigneeName', () => {
    expect(getActivityDescription('UNASSIGNED')).toBe('unassigned a member from this task')
  })

  it('returns correct description for COMMENTED', () => {
    expect(getActivityDescription('COMMENTED')).toBe('added a comment')
  })

  it('returns correct description for UPLOADED with fileName', () => {
    const metadata = { fileName: 'doc.pdf' }
    expect(getActivityDescription('UPLOADED', metadata)).toBe('uploaded doc.pdf')
  })

  it('returns correct description for UPLOADED without fileName', () => {
    expect(getActivityDescription('UPLOADED')).toBe('uploaded an attachment')
  })

  it('returns correct description for MOVED with destination', () => {
    const metadata = { destination: 'Project B' }
    expect(getActivityDescription('MOVED', metadata)).toBe('moved this task to Project B')
  })

  it('returns correct description for MOVED without destination', () => {
    expect(getActivityDescription('MOVED')).toBe('moved this task')
  })

  it('uses correct subject for subtask', () => {
    const metadata = { isSubtask: true }
    expect(getActivityDescription('CREATED', metadata)).toBe('created a subtask')
  })

  it('uses correct subject for FILE entityType', () => {
    expect(getActivityDescription('CREATED', undefined, 'FILE')).toBe('created a file')
  })

  it('uses correct subject for MEMBER entityType', () => {
    expect(getActivityDescription('CREATED', undefined, 'MEMBER')).toBe('created a member')
  })

  it('uses correct subject for PROJECT entityType', () => {
    expect(getActivityDescription('CREATED', undefined, 'PROJECT')).toBe('created a project')
  })

  it('uses correct subject for WORKSPACE entityType', () => {
    expect(getActivityDescription('CREATED', undefined, 'WORKSPACE')).toBe('created a workspace')
  })

  it('returns lowercased action for unknown actions', () => {
    expect(getActivityDescription('ARCHIVED')).toBe('archived')
  })

  it('replaces underscores in unknown actions', () => {
    expect(getActivityDescription('MARK_AS_DONE')).toBe('mark as done')
  })
})

describe('getUserInitials', () => {
  it('returns first char uppercase', () => {
    expect(getUserInitials('john')).toBe('J')
  })

  it('returns U for empty string', () => {
    expect(getUserInitials('')).toBe('U')
  })

  it('handles nullish input', () => {
    expect(getUserInitials(undefined as any)).toBe('U')
  })
})

describe('groupActivitiesByDate', () => {
  it('groups activities by date', () => {
    const activities: Activity[] = [
      { id: '1', action: 'CREATED', entityType: 'TASK', createdAt: '2024-01-15T10:00:00Z', user: { id: 'u1', name: 'User' } },
      { id: '2', action: 'UPDATED', entityType: 'TASK', createdAt: '2024-01-15T14:00:00Z', user: { id: 'u1', name: 'User' } },
      { id: '3', action: 'COMPLETED', entityType: 'TASK', createdAt: '2024-01-16T10:00:00Z', user: { id: 'u1', name: 'User' } },
    ]
    const grouped = groupActivitiesByDate(activities)
    const keys = Object.keys(grouped)
    expect(keys.length).toBe(2)
    expect(grouped[keys[0]].length).toBe(2)
    expect(grouped[keys[1]].length).toBe(1)
  })
})
