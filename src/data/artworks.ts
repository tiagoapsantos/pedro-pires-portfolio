import catalogue from './artwork-catalogue.json' with { type: 'json' };
import type { Locale } from './site.ts';
export const categories = [
  { id: 'children', pt: 'Ilustração infantil', en: 'Children’s illustration' },
  { id: 'watercolour', pt: 'Aguarela', en: 'Watercolour' },
  { id: 'digital', pt: 'Ilustração digital', en: 'Digital illustration' },
  { id: 'editorial', pt: 'Editorial', en: 'Editorial' },
  { id: 'comics', pt: 'Banda desenhada', en: 'Comics' },
  { id: 'caricatures', pt: 'Caricaturas', en: 'Caricatures' },
] as const;
export type Category = typeof categories[number]['id'];
type Translation = Record<Locale, string>;
export interface Artwork {
  id: string; catalogueNumber?: string; category: Category; title: Translation; description: Translation; credits: Translation;
  temporary: boolean; format: 'portrait' | 'square' | 'landscape';
  image?: { src: string; thumbnail?: string; thumbnailWidth?: number; thumbnailHeight?: number; width: number; height: number; alt: Translation };
}
/** Actual local images; blank titles/credits are deliberately not invented. */
export const artworks = catalogue as Artwork[];
export const heroArtwork = artworks.find(item => item.id === 'digital-08')!;
export const featuredArtworks = ['children-19', 'children-17', 'watercolour-15', 'comics-10', 'digital-04', 'digital-01'].map(id => artworks.find(item => item.id === id)!);
export function artworkCategory(item: Artwork, locale: Locale) { return categories.find(category => category.id === item.category)![locale]; }
export function availableCategories(items: Artwork[]) { return categories.filter(category => items.some(item => item.category === category.id)); }
export function artworkTitle(item: Artwork, locale: Locale) { return item.title[locale]?.trim() || (locale === 'pt' ? 'Imagem ' : 'Image ') + item.catalogueNumber; }
export { selectArtworks, nextIndex } from './gallery-utils.ts';
export function validateArtworks(items: Artwork[]) {
  const ids = new Set<string>();
  for (const item of items) {
    if (!item.id || ids.has(item.id)) throw new Error('Artwork IDs must be unique.'); ids.add(item.id);
    if (!categories.some(category => category.id === item.category)) throw new Error('Unknown category.');
    for (const locale of ['pt', 'en'] as const) if (!item.description[locale]?.trim() || (!item.title[locale]?.trim() && !item.catalogueNumber)) throw new Error('Description and catalogue reference required.');
    if (!item.temporary && !item.image) throw new Error('Final artwork needs an authorised local image.');
    if (item.image?.thumbnail && (!item.image.thumbnail.startsWith('/images/') || /[\\]|\.\./.test(item.image.thumbnail))) throw new Error('Thumbnail must be local.');
    if (item.image && (!item.image.src.startsWith('/images/') || /[\\]|\.\./.test(item.image.src) || item.image.width <= 0 || item.image.height <= 0 || !item.image.alt.pt || !item.image.alt.en)) throw new Error('Use a local image with dimensions and PT/EN alt text.');
  }
}
validateArtworks(artworks);
