'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  lastPasswordChange: string | null;
}

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const securityKeys = {
  all: ['security'] as const,
  sessions: () => [...securityKeys.all, 'sessions'] as const,
  settings: () => [...securityKeys.all, 'settings'] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch active sessions for the current user
 */
export function useActiveSessions() {
  return useQuery({
    queryKey: securityKeys.sessions(),
    queryFn: async (): Promise<ActiveSession[]> => {
      const response = await api.get<ActiveSession[]>('/api/v1/user/sessions', {
        showErrorToast: false,
      });
      return response?.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Revoke a specific session
 */
export function useRevokeSession() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      await api.delete(`/api/v1/user/sessions/${sessionId}`, {
        showSuccessToast: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: securityKeys.sessions() });
      toast.success('Session revoked');
    },
    onError: () => {
      toast.error('Failed to revoke session');
    },
  });
}

/**
 * Revoke all sessions except the current one
 */
export function useRevokeAllSessions() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete('/api/v1/user/sessions', {
        showSuccessToast: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: securityKeys.sessions() });
      toast.success('All other sessions revoked');
    },
    onError: () => {
      toast.error('Failed to revoke sessions');
    },
  });
}

/**
 * Change user password
 */
export function useChangePassword() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: PasswordChangeInput) => {
      await api.put('/api/v1/user/password', input, {
        showSuccessToast: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: securityKeys.settings() });
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to change password';
      toast.error(message);
    },
  });
}

/**
 * Fetch security settings
 */
export function useSecuritySettings() {
  return useQuery({
    queryKey: securityKeys.settings(),
    queryFn: async (): Promise<SecuritySettings> => {
      const response = await api.get<SecuritySettings>('/api/v1/user/security', {
        showErrorToast: false,
      });
      return response?.data || { twoFactorEnabled: false, emailVerified: false, lastPasswordChange: null };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Set up 2FA — generates TOTP secret and returns QR code URI
 */
export function useSetupTwoFactor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{ secret: string; uri: string }> => {
      const response = await api.post<{ secret: string; uri: string }>('/api/v1/user/2fa/setup', {}, {
        showErrorToast: false,
      });
      if (!response?.data) {
        throw new Error('Failed to set up two-factor authentication');
      }
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: securityKeys.settings() });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to set up two-factor authentication');
    },
  });
}

/**
 * Verify a TOTP token and enable 2FA
 */
export function useVerifyTwoFactor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (token: string): Promise<void> => {
      await api.post('/api/v1/user/2fa/verify', { token }, {
        showErrorToast: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: securityKeys.settings() });
      toast.success('Two-factor authentication enabled successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to verify code');
    },
  });
}

/**
 * Disable 2FA (requires current password)
 */
export function useDisableTwoFactor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (password: string): Promise<void> => {
      await api.post('/api/v1/user/2fa/disable', { password }, {
        showErrorToast: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: securityKeys.settings() });
      toast.success('Two-factor authentication disabled successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to disable two-factor authentication');
    },
  });
}

/**
 * Validate password strength client-side
 */
export function validatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');

  if (password.length >= 12) score += 1;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  else feedback.push('Mix of uppercase and lowercase');

  if (/\d/.test(password)) score += 1;
  else feedback.push('At least one number');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('At least one special character');

  return { score, feedback };
}
