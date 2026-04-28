import { describe, it, expect } from 'vitest'
import { waitFor, act } from '@testing-library/react'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'
import { createWrapper, renderHookWithProviders } from '../utils/renderWithProviders'

import {
  useAdminJobs,
  useAdminJob,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useToggleJobPin,
  useToggleJobStatus,
} from '@/hooks/useJob'
import { AdminJobFormValues } from '@/components/AdminDashboard/careers/AdminJobForm'


const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'



// ─── useAdminJobs ─────────────────────────────────────────────────────────────

describe('useAdminJobs', () => {
  it('fetches jobs list', async () => {
    const { result } = renderHookWithProviders(() => useAdminJobs(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.jobs).toHaveLength(1)
    expect(result.current.data?.jobs[0].id).toBe('job-1')
    expect(result.current.data?.total).toBe(1)
  })

  it('accepts filters', async () => {
    const { result } = renderHookWithProviders(
      () => useAdminJobs({ status: 'OPEN', page: 1 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.jobs).toBeDefined()
  })

  it('handles error state', async () => {
    server.use(
      http.get(`${BASE}/api/jobs/admin/all`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHookWithProviders(() => useAdminJobs(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ─── useAdminJob ──────────────────────────────────────────────────────────────

describe('useAdminJob', () => {
  it('fetches single job', async () => {
    const { result } = renderHookWithProviders(
      () => useAdminJob('job-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('job-1')
  })

  it('is disabled when no id', () => {
    const { result } = renderHookWithProviders(
      () => useAdminJob(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('handles not found', async () => {
    const { result } = renderHookWithProviders(
      () => useAdminJob('not-found'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ─── useCreateJob ─────────────────────────────────────────────────────────────

describe('useCreateJob', () => {
  it('creates job successfully', async () => {
    const { result } = renderHookWithProviders(() => useCreateJob(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
  result.current.mutate({
    title: 'Frontend Developer',
    department: 'ENGINEERING',
    location: 'Remote',
    locationType: 'REMOTE',
    type: 'FULL_TIME',
    experienceLevel: 'MID',
    salaryMin: 1000,
    salaryMax: 2000,
    salaryCurrency: 'USD',
    description: 'Build UI',
    requirements: 'React',
    niceToHave: "next.js",
    benefits: "Health insurance, Remote work",
    closingDate: "2024-12-31",
    applicationUrl: "https://example.com/apply",
    applicationEmail: "careers@example.com",
    status: 'OPEN',
    isPinned: false,
  })
})

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('job-1')
  })
})

// ─── useUpdateJob ─────────────────────────────────────────────────────────────

describe('useUpdateJob', () => {
  it('updates job successfully', async () => {
    const { result } = renderHookWithProviders(() => useUpdateJob(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({
        jobId: 'job-1',
        data: { title: 'Updated Title' } as AdminJobFormValues,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('job-1')
  })
})

// ─── useDeleteJob ─────────────────────────────────────────────────────────────

describe('useDeleteJob', () => {
  it('deletes job successfully', async () => {
    const { result } = renderHookWithProviders(() => useDeleteJob(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate('job-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ─── useToggleJobPin ──────────────────────────────────────────────────────────

describe('useToggleJobPin', () => {
  it('toggles pin successfully', async () => {
    const { result } = renderHookWithProviders(() => useToggleJobPin(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate('job-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.isPinned).toBe(true)
  })
})

// ─── useToggleJobStatus ───────────────────────────────────────────────────────

describe('useToggleJobStatus', () => {
  it('toggles job status OPEN -> PAUSED', async () => {
    const { result } = renderHookWithProviders(() => useToggleJobStatus(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({
        jobId: 'job-1',
        currentStatus: 'OPEN',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('job-1')
  })
})