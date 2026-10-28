export type Locale = 'pt' | 'en';
export type Page = 'home' | 'portfolio' | 'about' | 'contact';
export const email = 'pedro.insider@gmail.com';
export const facebook = 'https://www.facebook.com/Pedro.Pires.Illustration/';
export const pages: Page[] = ['home', 'portfolio', 'about', 'contact'];
export const paths: Record<Locale, Record<Page, string>> = {
  pt: { home: '', portfolio: 'portfolio/', about: 'sobre/', contact: 'contactos/' },
  en: { home: 'en/', portfolio: 'en/portfolio/', about: 'en/about/', contact: 'en/contact/' },
};
export const labels: Record<Locale, Record<Page, string>> = {
  pt: { home: 'Início', portfolio: 'Portfolio', about: 'Sobre', contact: 'Contactos' },
  en: { home: 'Home', portfolio: 'Portfolio', about: 'About', contact: 'Contact' },
};
export function href(locale: Locale, page: Page, base = '/') { return base.replace(/\/?$/, '/') + paths[locale][page]; }
export const t = (locale: Locale, pt: string, en: string) => locale === 'pt' ? pt : en;
