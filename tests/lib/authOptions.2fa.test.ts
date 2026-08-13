import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
  },
}));

vi.mock('argon2', () => ({
  verify: vi.fn().mockResolvedValue(true),
}));

vi.mock('otplib', () => ({
  verifySync: vi.fn(),
}));

// Preserve the authorize function so we can test 2FA logic
vi.mock('next-auth/providers/credentials', () => ({
  default: (opts: Record<string, unknown>) => ({
    id: opts.id as string,
    name: opts.name as string,
    type: 'credentials',
    options: opts,
    authorize: opts.authorize as (...args: unknown[]) => unknown,
  }),
}));

vi.mock('next-auth/providers/google', () => ({
  default: () => ({ id: 'google', name: 'Google', type: 'oauth' }),
}));

vi.mock('@next-auth/prisma-adapter', () => ({
  PrismaAdapter: () => ({}),
}));

describe('authOptions authorize - 2FA enforcement', () => {
  let authorize: (credentials: Record<string, string>) => Promise<unknown>;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { authOptions } = await import('@/lib/auth/authOptions');
    const credsProvider = authOptions.providers.find(
      (p: Record<string, unknown>) => p.id === 'credentials',
    ) as Record<string, unknown>;
    authorize = (credsProvider.options as Record<string, unknown>)
      .authorize as (credentials: Record<string, string>) => Promise<unknown>;
  });

  const defaultUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test',
    password: 'hashed-password',
    role: 'USER',
    image: null,
    emailVerified: new Date(),
    twoFactorEnabled: false,
    twoFactorSecret: null,
  };

  it('allows login without 2FA when twoFactorEnabled is false', async () => {
    const { prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.user.findUnique).mockResolvedValue(defaultUser);

    const result = await authorize({
      email: 'test@example.com',
      password: 'correct-password',
    });

    expect(result).toBeDefined();
    expect((result as Record<string, unknown>).id).toBe('user-1');
    expect(vi.mocked(prisma.user.findUnique)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'test@example.com' },
        select: expect.objectContaining({
          twoFactorEnabled: true,
          twoFactorSecret: true,
        }),
      }),
    );
  });

  it('throws 2FA_REQUIRED when user has 2FA enabled and no totpCode', async () => {
    const { prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...defaultUser,
      twoFactorEnabled: true,
      twoFactorSecret: 'MOCKBASE32SECRET',
    });

    await expect(
      authorize({
        email: 'test@example.com',
        password: 'correct-password',
      }),
    ).rejects.toThrow('2FA_REQUIRED');
  });

  it('throws configuration error when 2FA enabled but secret is null', async () => {
    const { prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...defaultUser,
      twoFactorEnabled: true,
      twoFactorSecret: null,
    });

    await expect(
      authorize({
        email: 'test@example.com',
        password: 'correct-password',
        totpCode: '123456',
      }),
    ).rejects.toThrow(
      'Two-factor authentication is not properly configured. Please contact support.',
    );
  });

  it('allows login with valid TOTP code when 2FA is enabled', async () => {
    const { prisma } = await import('@/lib/prisma');
    const { verifySync } = await import('otplib');
    vi.mocked(verifySync).mockReturnValue({ valid: true } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...defaultUser,
      twoFactorEnabled: true,
      twoFactorSecret: 'MOCKBASE32SECRET',
    });

    const result = await authorize({
      email: 'test@example.com',
      password: 'correct-password',
      totpCode: '123456',
    });

    expect(result).toBeDefined();
    expect((result as Record<string, unknown>).id).toBe('user-1');
    // twoFactorSecret should be excluded from the returned user
    expect((result as Record<string, unknown>).twoFactorSecret).toBeUndefined();
    expect(vi.mocked(verifySync)).toHaveBeenCalledWith({
      token: '123456',
      secret: 'MOCKBASE32SECRET',
    });
  });

  it('throws error with invalid TOTP code when 2FA is enabled', async () => {
    const { prisma } = await import('@/lib/prisma');
    const { verifySync } = await import('otplib');
    vi.mocked(verifySync).mockReturnValue({ valid: false } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...defaultUser,
      twoFactorEnabled: true,
      twoFactorSecret: 'MOCKBASE32SECRET',
    });

    await expect(
      authorize({
        email: 'test@example.com',
        password: 'correct-password',
        totpCode: '000000',
      }),
    ).rejects.toThrow('Invalid verification code. Please try again.');
  });

  it('updates lastLoginAt after successful 2FA verification', async () => {
    const { prisma } = await import('@/lib/prisma');
    const { verifySync } = await import('otplib');
    vi.mocked(verifySync).mockReturnValue({ valid: true } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...defaultUser,
      twoFactorEnabled: true,
      twoFactorSecret: 'MOCKBASE32SECRET',
    });

    await authorize({
      email: 'test@example.com',
      password: 'correct-password',
      totpCode: '123456',
    });

    expect(vi.mocked(prisma.user.update)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({ lastLoginAt: expect.any(Date) }),
      }),
    );
  });
});

describe('authOptions jwt callback - Google sign-in 2FA gate', () => {
  let jwt: (
    params: Record<string, unknown>
  ) => Promise<Record<string, unknown>>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { authOptions } = await import('@/lib/auth/authOptions');
    jwt = (authOptions.callbacks as Record<string, unknown>)
      .jwt as (params: Record<string, unknown>) => Promise<Record<string, unknown>>;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('marks the session pending and mints NO tokens for a Google login on a 2FA account', async () => {
    const { prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      role: 'USER',
      twoFactorEnabled: true,
    } as never);

    const token = await jwt({
      token: {},
      user: { id: 'user-1', email: 'test@example.com', role: 'USER' },
      account: { provider: 'google' },
    });

    expect(token.twoFactorPending).toBe(true);
    expect(token.backendToken).toBeUndefined();
    expect(vi.mocked(prisma.user.findUnique)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'user-1' } }),
    );
  });

  it('does NOT gate Google logins when 2FA is disabled', async () => {
    const { prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      role: 'USER',
      twoFactorEnabled: false,
    } as never);

    const token = await jwt({
      token: {},
      user: { id: 'user-1', email: 'test@example.com', role: 'USER' },
      account: { provider: 'google' },
    });

    expect(token.twoFactorPending).not.toBe(true);
  });

  it('completes the exchange when the 2FA marker is verified on session update', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
    const tokens = {
      accessToken: 'AT-123',
      refreshToken: 'RT-123',
      sseToken: 'SSE-123',
      accessTokenExpiry: 123,
      refreshTokenExpiry: 456,
    };
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/internal/2fa-check')) {
          return { ok: true, json: async () => ({ success: true, verified: true }) };
        }
        if (url.includes('/auth/exchange')) {
          return { ok: true, json: async () => tokens };
        }
        return { ok: false, json: async () => ({}) };
      }),
    );

    const token = await jwt({
      token: {
        twoFactorPending: true,
        id: 'user-1',
        role: 'USER',
        sessionId: 'sess-1',
        email: 'test@example.com',
      },
      trigger: 'update',
    });

    expect(token.twoFactorPending).toBe(false);
    expect(token.backendToken).toBe('AT-123');
    expect(token.refreshToken).toBe('RT-123');
    expect(token.sseToken).toBe('SSE-123');
  });

  it('stays pending when the 2FA marker is not yet verified', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/internal/2fa-check')) {
          return { ok: true, json: async () => ({ success: true, verified: false }) };
        }
        return { ok: false, json: async () => ({}) };
      }),
    );

    const token = await jwt({
      token: {
        twoFactorPending: true,
        id: 'user-1',
        role: 'USER',
        sessionId: 'sess-1',
        email: 'test@example.com',
      },
      trigger: 'update',
    });

    expect(token.twoFactorPending).toBe(true);
    expect(token.backendToken).toBeUndefined();
  });
});
