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
