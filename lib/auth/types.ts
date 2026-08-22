// ─────────────────────────────────────────────────────────────────────────────
// Auth — Shared types
// ─────────────────────────────────────────────────────────────────────────────

export interface GoogleProfile {
  email_verified?: boolean;
  verified_email?: boolean;
}

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  sseToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
};

// A refresh attempt either returns a new token pair or fails. On failure we
// keep the server's error code so the jwt callback can tell a transient blip
// (network, 5xx) apart from a genuinely dead session (TOKEN_REVOKED,
// SESSION_TIMEOUT, replay, invalid) — only the latter must force-logout.
export type RefreshResult =
  | { ok: true; tokens: TokenResponse }
  | { ok: false; code?: string };

export type FailedAttemptResult = {
  success?: boolean;
  locked?: boolean;
  unlocksAt?: string;
  attempts?: number;
};
