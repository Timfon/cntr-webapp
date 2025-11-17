/**
 * Get the site URL for redirects
 * Uses NEXT_PUBLIC_SITE_URL if set, otherwise falls back to window.location.origin
 */
export function getSiteUrl(): string {
  // Server-side: use environment variable
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  }
  
  // Client-side: prefer env var, fallback to current origin
  return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
}

