export const mockProject = {
  id: 'proj-1',
  name: 'Test Project',
  slug: 'test-project',
  description: 'A test project',
  status: 'ACTIVE' as const,
  priority: 'HIGH' as const,
  color: '#3B82F6',
  icon: null,
  dueDate: '2025-12-31T00:00:00Z',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  workspaceId: 'ws-1',
  ownerId: 'user-1',
  members: [
    { user: { id: 'user-1', name: 'Alice' }, role: 'MANAGER' },
    { user: { id: 'user-2', name: 'Bob' }, role: 'MEMBER' },
  ],
  _count: { tasks: 5, members: 2 },
}

export const mockMembers = [
  { user: { id: 'user-1', name: 'Alice', email: 'alice@test.com', image: null }, role: 'MANAGER' },
  { user: { id: 'user-2', name: 'Bob', email: 'bob@test.com', image: null }, role: 'MEMBER' },
  { user: { id: 'user-3', name: 'Charlie', email: 'charlie@test.com', image: null }, role: 'MEMBER' },
  { user: { id: 'user-4', name: 'Diana', email: 'diana@test.com', image: null }, role: 'MEMBER' },
]
