/**
 * URL helper for the W.A. Silva Foundation site.
 * Prepends the base path (/wasilva) in production for GitHub Pages.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  // Remove trailing slash from base, ensure path starts with /
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
