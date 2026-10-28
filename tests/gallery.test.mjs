import test from 'node:test';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { artworks, categories, selectArtworks, nextIndex, validateArtworks, artworkTitle, artworkCategory, availableCategories, featuredArtworks, heroArtwork } from '../src/data/artworks.ts';
import { href, pages } from '../src/data/site.ts';
test('81 real local images preserve six categories without fabricated titles or credits', () => { assert.equal(categories.length, 6); assert.equal(artworks.length, 81); assert.ok(artworks.every(item => !item.temporary && item.image)); assert.ok(artworks.every(item => !item.title.pt && !item.title.en && !item.credits.pt && !item.credits.en)); assert.equal(artworkTitle(artworks[0], 'pt'), 'Imagem 001'); validateArtworks(artworks); });
test('filters show only their category and support empty results', () => { for (const category of categories) { const selected = selectArtworks(artworks, category.id); assert.ok(selected.every(item => item.category === category.id)); } assert.equal(selectArtworks(artworks, 'all').length, 81); assert.deepEqual(selectArtworks(artworks, 'missing'), []); assert.deepEqual(selectArtworks(artworks, 'caricatures'), []); });
test('viewer wraps safely including empty and single selections', () => { assert.equal(nextIndex(5, 1, 6), 0); assert.equal(nextIndex(0, -1, 6), 5); assert.equal(nextIndex(0, 1, 1), 0); assert.equal(nextIndex(0, -1, 0), 0); });
test('paired routes are unique and support a future base path', () => { const routes = pages.flatMap(page => ['pt', 'en'].map(locale => href(locale, page))); assert.equal(new Set(routes).size, 8); assert.equal(href('en', 'about'), '/en/about/'); assert.equal(href('pt', 'contact', '/preview/'), '/preview/contactos/'); });
test('final entries need local images and PT/EN alternatives', () => { assert.throws(() => validateArtworks([{ ...artworks[0], temporary: false, image: undefined }])); assert.throws(() => validateArtworks([{ ...artworks[0], image: { src: 'https://example.test/image.jpg', width: 100, height: 100, alt: { pt: 'Exemplo', en: 'Example' } } }])); assert.throws(() => validateArtworks([artworks[0], artworks[0]])); });

test('all originals are unchanged and optimised files exist separately', { skip: !existsSync('assets/artwork-sources.json') ? 'Originals and private provenance intentionally excluded from the repository; verified locally.' : false }, async () => {
  const fs = await import('node:fs'); const crypto = await import('node:crypto');
  const sources = JSON.parse(fs.readFileSync('assets/artwork-sources.json', 'utf8'));
  assert.equal(sources.length, artworks.length);
  for (const source of sources) { assert.equal(crypto.createHash('sha256').update(fs.readFileSync(source.source)).digest('hex'), source.sha256); }
  for (const item of artworks) { assert.ok(fs.existsSync('public' + item.image.src)); assert.ok(fs.existsSync('public' + item.image.thumbnail)); assert.ok(item.image.width > 0 && item.image.height > 0); assert.ok(item.image.thumbnailWidth <= 640 && item.image.thumbnailHeight <= 800); }
});

test('WebP variants have correct proportions and no private metadata', async () => {
  const { default: sharp } = await import('sharp');
  for (const item of artworks) {
    const full = await sharp('public' + item.image.src).metadata();
    const thumb = await sharp('public' + item.image.thumbnail).metadata();
    assert.equal(full.width, item.image.width); assert.equal(full.height, item.image.height);
    assert.ok(Math.abs(full.width / full.height - thumb.width / thumb.height) < 0.01);
    assert.ok(!full.exif && !full.xmp && !thumb.exif && !thumb.xmp);
  }
});

test('category lookup stays independent of unconfirmed titles in either language', () => {
  for (const item of artworks) for (const locale of ['pt', 'en']) {
    const label = artworkCategory(item, locale);
    assert.ok(categories.some(category => category[locale] === label));
    assert.ok(!/\d|\.webp|Imagem|Image \d/.test(label));
    assert.equal(artworkCategory({...item,title:{pt:'Título provisório 123',en:'Temporary title 123'}},locale), label);
  }
});
test('Homepage selection has six preserved works and empty categories are not offered', () => {
  assert.ok(artworks.includes(heroArtwork)); assert.ok(!featuredArtworks.includes(heroArtwork));
  assert.equal(featuredArtworks.length,6); assert.equal(new Set(featuredArtworks.map(item=>item.id)).size,6);
  assert.ok(featuredArtworks.every(item=>item.image && artworks.includes(item)));
  assert.ok(!availableCategories(artworks).some(category=>category.id==='caricatures'));
  assert.equal(availableCategories(artworks).length,5);
});
