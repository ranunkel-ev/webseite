/** Turns a title into a URL-safe slug (umlauts → ae/oe/ue/ss). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Builds deterministically unique slugs for the Aktuelles posts in array order.
 * Collisions get a suffix (-2, -3, …) so the list link and the detail route
 * always produce identical slugs.
 */
export function buildPostSlugs(items: { title?: string | null }[]): string[] {
  const seen = new Map<string, number>();
  return items.map((item, index) => {
    const base = slugify(item.title ?? '') || `beitrag-${index + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}
