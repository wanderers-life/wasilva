/**
 * URL helper for Astro projects deployed to a subpath (e.g., GitHub Pages).
 * In dev (base="/"), returns paths as-is.
 * In production (base="/wasilva"), prepends the base.
 * 
 * Usage in Astro frontmatter:
 *   import { url } from "@lib/url";
 *   href={url("/about-us")}
 *   src={url("/images/logo.png")}
 */
export function url(path: string): string {
  // import.meta.env.BASE_URL is "/" in dev, "/wasilva/" in production
  const base = import.meta.env.BASE_URL;
  // Remove trailing slash from base, ensure path starts with /
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
