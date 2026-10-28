/** Pure helpers: importing gallery behaviour must not bundle the catalogue. */
export function selectArtworks<T extends { category: string }>(items: T[], category: string) { return category === 'all' ? items : items.filter(item => item.category === category); }
export function nextIndex(index: number, direction: number, count: number) { return count ? ((index + direction) % count + count) % count : 0; }
