import { pages, href } from '../data/site';
import { siteOrigin, basePath } from '../data/publication';
export const prerender = true;
export function GET() {
  const absolute = (locale: 'pt' | 'en', page: typeof pages[number]) => new URL(href(locale, page, basePath), siteOrigin).href;
  const entries = pages.flatMap(page => (['pt','en'] as const).map(locale => '<url><loc>' + absolute(locale,page) + '</loc><xhtml:link rel="alternate" hreflang="pt-PT" href="' + absolute('pt',page) + '"/><xhtml:link rel="alternate" hreflang="en" href="' + absolute('en',page) + '"/></url>'));
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + entries.join('') + '</urlset>', { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
