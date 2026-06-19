/** Wandelt einen Titel in einen URL-tauglichen Slug um (Umlaute → ae/oe/ue/ss). */
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
 * Erzeugt deterministisch eindeutige Slugs für die Aktuelles-Beiträge in
 * Array-Reihenfolge. Bei Kollisionen wird ein Suffix (-2, -3, …) angehängt,
 * damit Listen-Link und Detail-Route identische Slugs liefern.
 */
export function buildAktuellesSlugs(items: { title?: string | null }[]): string[] {
  const seen = new Map<string, number>();
  return items.map((item, index) => {
    const base = slugify(item.title ?? '') || `beitrag-${index + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}
