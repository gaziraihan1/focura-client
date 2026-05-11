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