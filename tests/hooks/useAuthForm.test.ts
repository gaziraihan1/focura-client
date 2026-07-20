import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthForm } from '@/hooks/useAuthForm';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useAuthForm', () => {
  const mockPush = vi.fn();
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    (useSearchParams as any).mockReturnValue({ get: mockGet });
  });

  describe('login mode', () => {
    it('should handle successful login', async () => {
      (signIn as any).mockResolvedValue({ ok: true });
      mockGet.mockReturnValue(null);

      const { result } = renderHook(() => useAuthForm({ mode: 'login' }));
      
      await act(async () => {
        await result.current.onSubmit({
          email: 'test@example.com',
          password: 'password123',
        } as any as Record<string, unknown>);
      });

      expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      }));
      expect(toast.success).toHaveBeenCalledWith('Welcome back!');
      expect(mockPush).toHaveBeenCalledWith('/authentication/success');
    });

    it('should handle login error from signIn', async () => {
      (signIn as any).mockResolvedValue({ error: 'Invalid credentials' });
      mockGet.mockReturnValue(null);

      const { result } = renderHook(() => useAuthForm({ mode: 'login' }));
      
      await act(async () => {
        await result.current.onSubmit({
          email: 'test@example.com',
          password: 'password123',
        } as any as Record<string, unknown>);
      });

      expect(toast.error).toHaveBeenCalledWith('Invalid email or password. Please try again.');
    });

    it('should handle login exception', async () => {
      (signIn as any).mockRejectedValue(new Error('Network error'));
      mockGet.mockReturnValue(null);

      const { result } = renderHook(() => useAuthForm({ mode: 'login' }));
      
      await act(async () => {
        await result.current.onSubmit({
          email: 'test@example.com',
          password: 'password123',
        } as any as Record<string, unknown>);
      });

      expect(toast.error).toHaveBeenCalledWith('Something went wrong. Please check your connection and try again.');
    });

    it('should use callbackUrl if provided', async () => {
      (signIn as any).mockResolvedValue({ ok: true });
      mockGet.mockReturnValue('/custom-callback');

      const { result } = renderHook(() => useAuthForm({ mode: 'login' }));
      
      await act(async () => {
        await result.current.onSubmit({
          email: 'test@example.com',
          password: 'password123',
        } as any as Record<string, unknown>);
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/authentication/success?callbackUrl=')
      );
    });
  });

  describe('register mode', () => {
    it('should handle successful registration', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() => useAuthForm({ mode: 'register' }));
      
      await act(async () => {
        await result.current.onSubmit({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        } as any as Record<string, unknown>);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
        method: 'POST',
      }));
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Please check your email to verify your account.');
      expect(mockPush).toHaveBeenCalledWith('/authentication/login?verifyEmail=true');
    });

    it('should handle registration error 429', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Too many requests' }),
      });

      const { result } = renderHook(() => useAuthForm({ mode: 'register' }));
      
      await act(async () => {
        await result.current.onSubmit({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        } as any as Record<string, unknown>);
      });

      expect(toast.error).toHaveBeenCalledWith('Too many attempts. Please try again later.');
    });

    it('should handle registration error - email already exists', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Email already exists' }),
      });

      const { result } = renderHook(() => useAuthForm({ mode: 'register' }));
      
      await act(async () => {
        await result.current.onSubmit({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        } as any as Record<string, unknown>);
      });

      expect(toast.error).toHaveBeenCalledWith('An account with this email already exists. Please login instead.');
    });

    it('should handle registration general error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Some other error' }),
      });

      const { result } = renderHook(() => useAuthForm({ mode: 'register' }));
      
      await act(async () => {
        await result.current.onSubmit({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        } as any as Record<string, unknown>);
      });

      expect(toast.error).toHaveBeenCalledWith('Some other error');
    });

    it('should handle registration exception', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuthForm({ mode: 'register' }));
      
      await act(async () => {
        await result.current.onSubmit({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        } as any as Record<string, unknown>);
      });

      expect(toast.error).toHaveBeenCalledWith('Something went wrong. Please check your connection and try again.');
    });
  });

  describe('google sign-in', () => {
    it('should handle successful google sign-in', async () => {
      (signIn as any).mockResolvedValue({ ok: true });
      mockGet.mockReturnValue(null);

      const { result } = renderHook(() => useAuthForm({ mode: 'login' }));
      
      await act(async () => {
        await result.current.handleGoogle();
      });

      expect(signIn).toHaveBeenCalledWith('google', expect.objectContaining({
        callbackUrl: '/authentication/success',
      }));
    });

    it('should handle google sign-in error', async () => {
      (signIn as any).mockRejectedValue(new Error('Google error'));
      
      const { result } = renderHook(() => useAuthForm({ mode: 'login' }));
      
      await act(async () => {
        await result.current.handleGoogle();
      });

      expect(toast.error).toHaveBeenCalledWith('Google sign-in failed. Please try again.');
    });

    it('should use callbackUrl for google sign-in', async () => {
      (signIn as any).mockResolvedValue({ ok: true });
      mockGet.mockReturnValue('/custom-callback');

      const { result } = renderHook(() => useAuthForm({ mode: 'login' }));
      
      await act(async () => {
        await result.current.handleGoogle();
      });

      expect(signIn).toHaveBeenCalledWith('google', expect.objectContaining({
        callbackUrl: expect.stringContaining('/authentication/success?callbackUrl='),
      }));
    });
  });
});
