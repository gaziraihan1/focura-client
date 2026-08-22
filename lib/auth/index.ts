// ─────────────────────────────────────────────────────────────────────────────
// Auth — Barrel export
// ─────────────────────────────────────────────────────────────────────────────

export { createExchangeProof, exchangeForTokens } from './exchange';
export { silentRefresh } from './refresh';
export { callInternal, recordLoginFailure } from './bridge';
export type { TokenResponse, RefreshResult, FailedAttemptResult, GoogleProfile } from './types';
