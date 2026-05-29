/**
 * Safely appends an image-size suffix to a TheSportsDB CDN URL.
 *
 * TheSportsDB returns null for missing images. Naively concatenating
 *   `team.strBadge + "/small"`
 * throws a TypeError at runtime when strBadge is null.
 *
 * Usage in EJS:  <%= imgUrl(team.strBadge, 'small') %>
 * Returns '' when src is null/undefined so EJS conditionals still work:
 *   <% if (imgUrl(team.strBadge, 'small')) { %>
 */
export function imgUrl(src: string | null | undefined, size: "tiny" | "small" | "medium" | "large"): string {
  if (!src) return "";
  return `${src}/${size}`;
}
