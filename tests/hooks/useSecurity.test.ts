import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validatePasswordStrength } from '@/hooks/useSecurity';

// Mock fetch for 2FA hooks
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
  };
});

describe('validatePasswordStrength', () => {
  it('should return score 0 for empty password', () => {
    const result = validatePasswordStrength('');
    expect(result.score).toBe(0);
  });

  it('should return score 0 for short lowercase password', () => {
    const result = validatePasswordStrength('abc');
    expect(result.score).toBe(0);
  });

  it('should return score 1 for 8+ character lowercase password', () => {
    const result = validatePasswordStrength('abcdefgh');
    expect(result.score).toBe(1);
  });

  it('should return score 2 for 12+ character lowercase password', () => {
    const result = validatePasswordStrength('abcdefghijkl');
    expect(result.score).toBe(2);
  });

  it('should return score 3 for 12+ character mixed case password', () => {
    const result = validatePasswordStrength('abcdefghABCD');
    expect(result.score).toBe(3);
  });

  it('should return score 3 for password with uppercase, lowercase, and number but < 12 chars', () => {
    const result = validatePasswordStrength('Abcdefgh1');
    expect(result.score).toBe(3);
  });

  it('should return score 5 for strong password with special characters', () => {
    const result = validatePasswordStrength('MyStr0ng!Pass');
    expect(result.score).toBe(5);
    expect(result.feedback).toHaveLength(0);
  });

  it('should return feedback for missing uppercase', () => {
    const result = validatePasswordStrength('abcdefgh123!');
    expect(result.feedback).toContain('Mix of uppercase and lowercase');
  });

  it('should return feedback for missing numbers', () => {
    const result = validatePasswordStrength('Abcdefgh!');
    expect(result.feedback).toContain('At least one number');
  });

  it('should return feedback for missing special characters', () => {
    const result = validatePasswordStrength('Abcdefgh1');
    expect(result.feedback).toContain('At least one special character');
  });

  it('should return feedback for short password', () => {
    const result = validatePasswordStrength('Ab1!');
    expect(result.feedback).toContain('At least 8 characters');
  });

  it('should handle password with only numbers (8+ chars)', () => {
    const result = validatePasswordStrength('12345678');
    // Score: length>=8 (+1) + no uppercase/lowercase (+0) + has digit (+1) + no special (+0) = 2
    expect(result.score).toBe(2);
    expect(result.feedback).toContain('Mix of uppercase and lowercase');
  });

  it('should handle password with only special characters (8+ chars)', () => {
    const result = validatePasswordStrength('!@#$%^&*');
    // Score: length>=8 (+1) + no uppercase/lowercase (+0) + no digit (+0) + has special (+1) = 2
    expect(result.score).toBe(2);
    expect(result.feedback).toContain('Mix of uppercase and lowercase');
  });
});
