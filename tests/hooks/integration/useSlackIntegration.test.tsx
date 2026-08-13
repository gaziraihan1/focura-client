import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../mock/server'
import { createWrapper } from '../../utils/renderWithProviders'
import {
  useSlackIntegration,
  useWorkspaceSlackIntegration,
  hasSlackLink,
} from '@/hooks/integration/useSlackIntegration'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const activeSlack = { id: 'i1', provider: 'slack', active: true }
const inactiveSlack = { id: 'i1', provider: 'slack', active: false }

describe('useSlackIntegration', () => {
  it('returns connected when an active slack integration exists', async () => {
    server.use(
      http.get(`${BASE}/api/v1/user/integrations`, () =>
        HttpResponse.json({
          success: true,
          data: [activeSlack, { id: 'i2', provider: 'github', active: true }],
        })
      )
    )

    const { result } = renderHook(() => useSlackIntegration(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isConnected).toBe(true)
    expect(result.current.integration).toEqual(activeSlack)
  })

  it('returns disconnected when slack is inactive', async () => {
    server.use(
      http.get(`${BASE}/api/v1/user/integrations`, () =>
        HttpResponse.json({ success: true, data: [inactiveSlack] })
      )
    )

    const { result } = renderHook(() => useSlackIntegration(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isConnected).toBe(false)
    expect(result.current.integration).toEqual(inactiveSlack)
  })

  it('returns disconnected when slack is not among the integrations', async () => {
    server.use(
      http.get(`${BASE}/api/v1/user/integrations`, () =>
        HttpResponse.json({
          success: true,
          data: [{ id: 'i2', provider: 'github', active: true }],
        })
      )
    )

    const { result } = renderHook(() => useSlackIntegration(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isConnected).toBe(false)
    expect(result.current.integration).toBeNull()
  })

  it('returns disconnected when the request fails', async () => {
    server.use(
      http.get(`${BASE}/api/v1/user/integrations`, () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 })
      )
    )

    const { result } = renderHook(() => useSlackIntegration(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isConnected).toBe(false)
    expect(result.current.integration).toBeNull()
  })
})

describe('useWorkspaceSlackIntegration', () => {
  it('returns connected for an active workspace slack integration', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspace-integrations/:slug`, () =>
        HttpResponse.json({ success: true, data: [activeSlack] })
      )
    )

    const { result } = renderHook(
      () => useWorkspaceSlackIntegration('test-ws'),
      { wrapper: createWrapper() }
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isConnected).toBe(true)
  })

  it('returns disconnected when the workspace slack integration is inactive', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspace-integrations/:slug`, () =>
        HttpResponse.json({ success: true, data: [inactiveSlack] })
      )
    )

    const { result } = renderHook(
      () => useWorkspaceSlackIntegration('test-ws'),
      { wrapper: createWrapper() }
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isConnected).toBe(false)
  })
})

describe('hasSlackLink', () => {
  it('returns true when both channel id and message ts exist', () => {
    expect(
      hasSlackLink({ slackChannelId: 'C123', slackMessageTs: '123.456' })
    ).toBe(true)
  })

  it('returns false when either field is missing', () => {
    expect(hasSlackLink({ slackChannelId: null, slackMessageTs: null })).toBe(
      false
    )
    expect(hasSlackLink({ slackChannelId: 'C123', slackMessageTs: null })).toBe(
      false
    )
    expect(hasSlackLink({})).toBe(false)
  })
})
