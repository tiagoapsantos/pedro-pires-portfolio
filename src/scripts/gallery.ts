import { nextIndex, selectArtworks } from '../data/gallery-utils';
import type { Artwork } from '../data/artworks';
import type { Locale } from '../data/site';
for (const root of document.querySelectorAll<HTMLElement>('[data-gallery]')) {
  const locale = root.dataset.locale as Locale;
  const pt = locale === 'pt';
  const all = JSON.parse(root.querySelector('[data-artworks]')!.textContent!) as Artwork[];
  const dialog = root.querySelector<HTMLDialogElement>('[data-viewer]')!;
  const media = root.querySelector<HTMLElement>('[data-media]')!;
  let visible = all;
  let index = 0;
  let opener: HTMLButtonElement | null = null;
  let previousOverflow = '';
  function show() {
    const item = visible[index]; if (!item) return;
    root.querySelector('[data-viewer-title]')!.textContent = pt ? 'Imagem ampliada' : 'Enlarged image';
    root.querySelector('[data-viewer-description]')!.textContent = item.description[locale];
    root.querySelector('[data-viewer-credit]')!.textContent = item.credits[locale];
    root.querySelector('[data-viewer-count]')!.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(visible.length).padStart(2, '0') + (item.temporary ? (pt ? ' · ESPAÇO RESERVADO' : ' · PLACEHOLDER') : '');
    media.replaceChildren();
    if (item.image) {
      const image = document.createElement('img'); image.src = root.dataset.base + item.image.src.replace(/^\//, ''); image.alt = item.image.alt[locale]; image.width = item.image.width; image.height = item.image.height;
      image.addEventListener('error', () => { media.textContent = pt ? 'Imagem indisponível. Pode continuar a navegar.' : 'Image unavailable. You can keep browsing.'; }); media.append(image);
    } else {
      const placeholder = document.createElement('div'); placeholder.className = 'viewer-placeholder';
      const number = document.createElement('span'); number.textContent = String(all.findIndex(work => work.id === item.id) + 1).padStart(2, '0');
      const message = document.createElement('p'); message.textContent = pt ? 'Espaço reservado para uma ilustração original autorizada.' : 'Reserved for an authorised original illustration.';
      placeholder.append(number, message); media.append(placeholder);
    }
    root.querySelectorAll<HTMLButtonElement>('[data-previous], [data-next]').forEach(button => button.disabled = visible.length < 2);
  }
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-artwork]')) button.addEventListener('click', () => {
    const found = visible.findIndex(item => item.id === button.dataset.artwork); if (found < 0) return;
    index = found; opener = button; show(); previousOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden'; root.querySelector<HTMLButtonElement>('[data-close]')!.focus();
  });
  root.querySelector('[data-close]')!.addEventListener('click', () => dialog.close());
  const navigate = (direction: number) => { index = nextIndex(index, direction, visible.length); show(); };
  root.querySelector('[data-previous]')!.addEventListener('click', () => navigate(-1));
  root.querySelector('[data-next]')!.addEventListener('click', () => navigate(1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
      const first = controls[0]; const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); navigate(event.key === 'ArrowRight' ? 1 : -1); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; opener?.focus({ preventScroll: true }); });
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-filter]')) button.addEventListener('click', () => {
    const category = button.dataset.filter!; visible = selectArtworks(all, category);
    root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    root.querySelectorAll<HTMLElement>('[data-card]').forEach(card => card.hidden = category !== 'all' && card.dataset.category !== category);
    root.querySelector<HTMLElement>('[data-empty]')!.hidden = visible.length > 0;
    history.replaceState(null, '', category === 'all' ? location.pathname + location.search : '#' + category);
    root.querySelector('[data-count]')!.textContent = visible.length + (pt ? (visible.length === 1 ? ' imagem' : ' imagens') : (visible.length === 1 ? ' image' : ' images'));
  });
  // Category links from the Homepage use the same buttons and filtering logic.
  const filters = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  if (filters.length) {
    const applyCategoryHash = () => {
      const category = location.hash.slice(1);
      const filter = filters.find(button => button.dataset.filter === category);
      if (filter) filter.click();
      else if (!category) filters.find(button => button.dataset.filter === 'all')?.click();
    };
    applyCategoryHash();
    window.addEventListener('hashchange', applyCategoryHash);
  }
}
