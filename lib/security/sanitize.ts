/**
 * Client-side sanitization (defense in depth)
 */

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .substring(0, 10000);
}

export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return 'file';

  return filename
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}

/**
 * Validate and sanitize URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate a post-login redirect target to prevent open redirects.
 * Only allows relative, same-origin paths. Rejects absolute URLs,
 * protocol-relative URLs (//evil.com), and non-path values.
 */
export function safeCallbackUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "/dashboard";

  const trimmed = url.trim();

  // Reject protocol-relative and absolute URLs (http:, https:, javascript:, etc.)
  if (trimmed.startsWith("//") || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return "/dashboard";
  }

  // Must be a path starting with a single slash.
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return "/dashboard";
  }

  return trimmed;
}