/**
 * Site-wide constants. `APP_NAME` is the ONLY place the product's display
 * name lives — every title, copy string, meta tag and JSON-LD block
 * interpolates it. Rename the product by editing this one line.
 */
export const APP_NAME = 'Alterio';

/** URL segment for the product's routes (`/en/alterio`, …). Stays stable even if the display name changes. */
export const APP_SLUG = 'alterio';

export const SITE_URL = import.meta.env.SITE ?? 'https://hackie.dev';
/** Deployment base path (`/` in prod, `/<repo>/` for github.io previews). Always ends with `/`. */
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/?$/, '/');
export const SITE_NAME = 'hackie.dev';

export const CONTACT_EMAIL = 'xavier.moreno.martinez@gmail.com';
export const DEVELOPER_NAME = 'Xavi Moreno';
export const DEVELOPER_GITHUB = 'https://github.com/XaviMorenoM';

/** Set when the app is live on the App Store. `null` → CTA renders as "Coming soon". */
export const APP_STORE_URL: string | null = null;
/** Public TestFlight link, if any. Used as CTA fallback when `APP_STORE_URL` is null. */
export const TESTFLIGHT_URL: string | null = null;

export const PRIVACY_EFFECTIVE_DATE = '2026-09-13';

export const MIN_IOS_VERSION = '18';

export const LOCALES = ['en', 'es', 'ca'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ca: 'Català',
};

/** BCP-47 tags used for `<html lang>`, `hreflang` and `og:locale`. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en',
  es: 'es',
  ca: 'ca',
};

export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
  ca: 'ca_ES',
};
