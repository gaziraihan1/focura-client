// Canonical backend API configuration.
//
// Every module that needs the Focura backend base URL must import from here
// instead of re-reading env vars, so dev/prod overrides can never drift apart
// between client, server and CSRF code paths.

export const DEV_BACKEND_URL = "http://localhost:5000";

/**
 * Base URL used by Node-side code (RSC, route handlers) via lib/api/server.
 * In production this MUST be set via BACKEND_URL; it may be undefined there,
 * which callers surface as a configuration error.
 */
export const SERVER_API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? DEV_BACKEND_URL
    : process.env.BACKEND_URL;

/**
 * Base URL used by browser code via lib/axios and public ISR fetches.
 * Set through NEXT_PUBLIC_API_URL; lib/axios/instance throws when missing
 * outside development.
 */
export const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
