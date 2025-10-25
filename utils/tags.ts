/**
 * Normalizes a tag string into a canonical, URL-friendly format.
 * This process includes trimming, lowercasing, replacing spaces with hyphens,
 * and removing any characters that are not alphanumeric or hyphens.
 * @param input The raw tag string from user input.
 * @returns A normalized, canonical tag string.
 */
export function normalizeTag(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with a single hyphen
    .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .slice(0, 35); // Enforce a max length for tags
}

/**
 * Formats a canonical tag string for display in the UI.
 * This process includes replacing hyphens with spaces and capitalizing each word.
 * @param canonical The canonical tag string (e.g., 'data-visualization').
 * @returns A human-readable, display-friendly tag string (e.g., 'Data Visualization').
 */
export function displayTag(canonical: string): string {
  if (!canonical) return '';
  return canonical
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
}
