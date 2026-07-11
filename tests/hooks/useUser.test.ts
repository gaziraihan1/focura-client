import { describe, it, expect, vi } from 'vitest';
import { renderHookWithProviders } from '@/tests/utils/renderWithProviders';
import { useUser, useUserId, useIsAuthenticated, useUserProfile } from '@/hooks/useUser';
import { mockUserProfile } from '@/tests/mock/handlers/user.handler';
import { http, HttpResponse } from 'msw';
import { server } from '@/tests/mock/server';
import { act } from '@testing-library/react';

describe('useUser hooks', () => {
  it('useUser should fetch and return user profile', async () => {
    const { result } = renderHookWithProviders(() => useUser());

    // Initial state
    expect(result.current.isLoading).toBe(true);

    // Wait for data to load
    await act(async () => {
      await vi.waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    expect(result.current.data).toEqual(mockUserProfile);
  });

  it('useUser should return null when profile is missing', async () => {
    server.use(
      http.get('*/api/v1/user/profile', () => {
        return HttpResponse.json({ success: true, data: { user: null } });
      })
    );

    const { result } = renderHookWithProviders(() => useUser());

    await act(async () => {
      await vi.waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
    expect(result.current.data).toBeNull();
  });

  it('useUser should handle error state', async () => {
    server.use(
      http.get('*/api/v1/user/profile', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { result } = renderHookWithProviders(() => useUser());

    await act(async () => {
      await vi.waitFor(() => expect(result.current.isError).toBe(true), { timeout: 2000 });
    });
    expect(result.current.error).toBeDefined();
  });

  it('useUserId should return the user id', async () => {
    const { result } = renderHookWithProviders(() => useUserId());

    await act(async () => {
      await vi.waitFor(() => expect(result.current).toBe(mockUserProfile.id));
    });
  });

  it('useIsAuthenticated should return correct auth state', async () => {
    const { result } = renderHookWithProviders(() => useIsAuthenticated());

    // Check authenticated state
    await act(async () => {
      await vi.waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    });
    expect(result.current.isLoading).toBe(false);

    // Check unauthenticated state
    server.use(
      http.get('*/api/v1/user/profile', () => {
        return HttpResponse.json({ success: true, data: { user: null } });
      })
    );

    // Need to clear cache because useUser is used inside
    const { result: resultUnauth } = renderHookWithProviders(() => useIsAuthenticated());
    await act(async () => {
      await vi.waitFor(() => expect(resultUnauth.current.isAuthenticated).toBe(false));
    });
  });

  it('useUserProfile should return full user profile and derived values', async () => {
    const { result } = renderHookWithProviders(() => useUserProfile());

    await act(async () => {
      await vi.waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    });

    expect(result.current.user).toEqual(mockUserProfile);
    expect(result.current.userId).toBe(mockUserProfile.id);
    expect(result.current.userName).toBe(mockUserProfile.name);
    expect(result.current.userEmail).toBe(mockUserProfile.email);
    expect(result.current.userImage).toBe(mockUserProfile.image);
  });

  it('useUserProfile should handle unauthenticated state', async () => {
    server.use(
      http.get('*/api/v1/user/profile', () => {
        return HttpResponse.json({ success: true, data: { user: null } });
      })
    );

    const { result } = renderHookWithProviders(() => useUserProfile());

    await act(async () => {
      await vi.waitFor(() => expect(result.current.isAuthenticated).toBe(false));
    });
    expect(result.current.user).toBeFalsy();
    expect(result.current.userId).toBeUndefined();
  });
});
