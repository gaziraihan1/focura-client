// ─────────────────────────────────────────────────────────────────────────────
// Focura API — Types, config, and UI constants
// ─────────────────────────────────────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type AuthLevel  = 'public' | 'auth' | 'admin';

export interface ParamDef {
  name       : string;
  type       : string;
  required   : boolean;
  description: string;
  example   ?: string;
}

export interface BodyField {
  name       : string;
  type       : string;
  required   : boolean;
  description: string;
  example   ?: string | number | boolean;
}

export interface ResponseField {
  name       : string;
  type       : string;
  description: string;
}

export interface CodeExample {
  label  : string;
  code   : string;
}

export interface Endpoint {
  id          : string;
  method      : HttpMethod;
  path        : string;
  summary     : string;
  description : string;
  auth        : AuthLevel;
  pathParams ?: ParamDef[];
  queryParams?: ParamDef[];
  bodyFields ?: BodyField[];
  responses   : { status: number; description: string; shape?: ResponseField[] }[];
  examples    : CodeExample[];
  tags        : string[];
  deprecated ?: boolean;
}

export interface ApiSection {
  id         : string;
  title      : string;
  description: string;
  endpoints  : Endpoint[];
}

// ─── Base config ──────────────────────────────────────────────────────────────
export const API_BASE_URL = 'https://focura-backend-vr75.onrender.com';
export const API_VERSION  = 'v1';
export const API_PREFIX   = '/api/v1';
export const FULL_BASE    = `${API_BASE_URL}${API_PREFIX}`;

// ─── UI constants ─────────────────────────────────────────────────────────────
export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET   : 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
  POST  : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
  PUT   : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  PATCH : 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/50',
  DELETE: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
};

export const METHOD_DOT: Record<HttpMethod, string> = {
  GET   : 'bg-blue-500',
  POST  : 'bg-emerald-500',
  PUT   : 'bg-amber-500',
  PATCH : 'bg-violet-500',
  DELETE: 'bg-red-500',
};

export const AUTH_BADGE: Record<AuthLevel, { label: string; style: string }> = {
  public: { label: 'Public',    style: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400' },
  auth  : { label: 'Auth',      style: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' },
  admin : { label: 'Admin only', style: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400' },
};
