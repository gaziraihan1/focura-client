import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useAnnouncementPage, useAnnouncementModal } from '@/hooks/useAnnouncementPage'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useAnnouncementPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    expect(result.current.showModal).toBe(false)
    expect(result.current.deletingId).toBeNull()
    expect(result.current.pinningId).toBeNull()
    expect(result.current.form.title).toBe('')
    expect(result.current.form.visibility).toBe('PUBLIC')
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.openModal).toBe('function')
    expect(typeof result.current.handleClose).toBe('function')
    expect(typeof result.current.handleSubmit).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
    expect(typeof result.current.handleTogglePin).toBe('function')
    expect(typeof result.current.setTitle).toBe('function')
    expect(typeof result.current.setContent).toBe('function')
    expect(typeof result.current.setVisibilityField).toBe('function')
    expect(typeof result.current.setIsPinnedField).toBe('function')
    expect(typeof result.current.setProjectId).toBe('function')
    expect(typeof result.current.toggleTarget).toBe('function')
    expect(typeof result.current.isValid).toBe('boolean')
    expect(typeof result.current.canManage).toBe('boolean')
  })

  it('validates form - empty title and content', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    expect(result.current.isValid).toBe(false)
  })

  it('validates form - has title and content', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    act(() => result.current.setTitle('Test Title'))
    act(() => result.current.setContent('Test Content'))

    expect(result.current.isValid).toBe(true)
  })

  it('opens create modal without editing state', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    act(() => result.current.openModal())

    expect(result.current.showModal).toBe(true)
    expect(result.current.isEditing).toBe(false)
    expect(result.current.editingAnnouncement).toBeNull()
    expect(result.current.form.title).toBe('')
  })

  it('opens edit modal with prefilled form', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    const announcement = {
      id: 'a1',
      title: 'Edit Me',
      content: 'Body content',
      visibility: 'PRIVATE' as const,
      isPinned: true,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      workspaceId: 'ws-1',
      projectId: null,
      project: null,
      createdById: 'u1',
      createdBy: { id: 'u1', name: 'Admin', image: null },
      targets: [{ userId: 'u2', user: { id: 'u2', name: 'Bob', image: null } }],
    }

    act(() => result.current.openEdit(announcement))

    expect(result.current.showModal).toBe(true)
    expect(result.current.isEditing).toBe(true)
    expect(result.current.editingAnnouncement?.id).toBe('a1')
    expect(result.current.form.title).toBe('Edit Me')
    expect(result.current.form.content).toBe('Body content')
    expect(result.current.form.visibility).toBe('PRIVATE')
    expect(result.current.form.isPinned).toBe(true)
    expect(result.current.form.targetIds).toEqual(['u2'])
  })

  it('closes edit modal and resets editing state', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    act(() => result.current.openEdit({
      id: 'a1',
      title: 'Edit Me',
      content: 'Body',
      visibility: 'PUBLIC' as const,
      isPinned: false,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      workspaceId: 'ws-1',
      projectId: null,
      project: null,
      createdById: 'u1',
      createdBy: { id: 'u1', name: 'Admin', image: null },
      targets: [],
    }))
    act(() => result.current.handleClose())

    expect(result.current.showModal).toBe(false)
    expect(result.current.isEditing).toBe(false)
    expect(result.current.editingAnnouncement).toBeNull()
    expect(result.current.form.title).toBe('')
  })
})

const modalAnnouncement = {
  id: 'a1',
  title: 'Edit Me',
  content: 'Body content',
  visibility: 'PRIVATE' as const,
  isPinned: true,
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
  workspaceId: 'ws-1',
  projectId: 'p-1',
  project: null,
  createdById: 'u1',
  createdBy: { id: 'u1', name: 'Admin', image: null },
  targets: [{ userId: 'u2', user: { id: 'u2', name: 'Bob', image: null } }],
}

describe('useAnnouncementModal', () => {
  it('opens in create mode by default', () => {
    const { result } = renderHook(
      () => useAnnouncementModal('ws-slug'),
      { wrapper: createWrapper() }
    )

    act(() => result.current.open())

    expect(result.current.modalProps.isOpen).toBe(true)
    expect(result.current.modalProps.isEditing).toBe(false)
    expect(result.current.modalProps.form.title).toBe('')
  })

  it('edit opens modal with prefilled form', () => {
    const { result } = renderHook(
      () => useAnnouncementModal('ws-slug'),
      { wrapper: createWrapper() }
    )

    act(() => result.current.edit(modalAnnouncement))

    expect(result.current.modalProps.isOpen).toBe(true)
    expect(result.current.modalProps.isEditing).toBe(true)
    expect(result.current.modalProps.form.title).toBe('Edit Me')
    expect(result.current.modalProps.form.content).toBe('Body content')
    expect(result.current.modalProps.form.visibility).toBe('PRIVATE')
    expect(result.current.modalProps.form.isPinned).toBe(true)
    expect(result.current.modalProps.form.targetIds).toEqual(['u2'])
  })

  it('open after edit resets to create mode', () => {
    const { result } = renderHook(
      () => useAnnouncementModal('ws-slug'),
      { wrapper: createWrapper() }
    )

    act(() => result.current.edit(modalAnnouncement))
    act(() => result.current.open())

    expect(result.current.modalProps.isEditing).toBe(false)
    expect(result.current.modalProps.form.title).toBe('')
  })

  it('closing edit resets form and editing state', () => {
    const { result } = renderHook(
      () => useAnnouncementModal('ws-slug'),
      { wrapper: createWrapper() }
    )

    act(() => result.current.edit(modalAnnouncement))
    act(() => result.current.modalProps.onClose())

    expect(result.current.modalProps.isOpen).toBe(false)
    expect(result.current.modalProps.isEditing).toBe(false)
    expect(result.current.modalProps.form.title).toBe('')
  })

  it('submits an update when editing', async () => {
    server.use(
      http.patch(`${BASE}/api/v1/announcements/:id`, async ({ request }) => {
        const body = await request.json() as any
        return HttpResponse.json({ success: true, data: { ...modalAnnouncement, ...body } })
      })
    )

    const { result } = renderHook(
      () => useAnnouncementModal('ws-slug'),
      { wrapper: createWrapper() }
    )

    act(() => result.current.edit(modalAnnouncement))
    act(() => result.current.modalProps.onTitleChange('Updated Title'))

    await act(async () => {
      await result.current.modalProps.onSubmit()
    })

    expect(result.current.modalProps.isOpen).toBe(false)
    expect(result.current.modalProps.isEditing).toBe(false)
  })
})
