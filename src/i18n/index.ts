import {
  APP_NAME,
  CONTACT_EMAIL,
  DEFAULT_LOCALE,
  DEVELOPER_NAME,
  LOCALES,
  MIN_IOS_VERSION,
  PRIVACY_EFFECTIVE_DATE,
  type Locale,
} from '../config';
import { ca } from './ca';
import { en } from './en';
import { es } from './es';
import type { Translations } from './types';

const sources: Record<Locale, Translations> = { en, es, ca };

/** Tokens every locale file may use. Replaced once per locale at module load. */
function tokensFor(locale: Locale): Record<string, string> {
  return {
    app: APP_NAME,
    developer: DEVELOPER_NAME,
    email: CONTACT_EMAIL,
    ios: MIN_IOS_VERSION,
    date: formatDate(PRIVACY_EFFECTIVE_DATE, locale),
  };
}

const tokenPattern = /\{(app|developer|email|ios|date)\}/g;

function interpolate<T>(value: T, tokens: Record<string, string>): T {
  if (typeof value === 'string') {
    return value.replace(tokenPattern, (_, key: string) => tokens[key] ?? `{${key}}`) as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => interpolate(v, tokens)) as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = interpolate(v, tokens);
    }
    return out as T;
  }
  return value;
}

/** Formats an ISO date (`2026-09-13`) in the locale's long form. */
export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y!, m! - 1, d!)),
  );
}

const resolved = Object.fromEntries(
  LOCALES.map((locale) => [locale, interpolate(sources[locale], tokensFor(locale))]),
) as Record<Locale, Translations>;

export function isLocale(value: string | undefined): value is Locale {
  return (LOCALES as readonly string[]).includes(value ?? '');
}

/** Returns the fully interpolated string table for a locale. */
export function useTranslations(locale: Locale): Translations {
  return resolved[locale];
}

/** Reads the leading path segment (`/es/alterio` → `es`); falls back to the default locale. */
export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/** Path with the locale prefix removed and a leading slash kept (`/es/alterio/` → `/alterio/`). */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/');
  if (isLocale(parts[1])) parts.splice(1, 1);
  const rest = parts.join('/');
  return rest === '' ? '/' : rest;
}

/** Builds a locale-prefixed, trailing-slash path: `localePath('ca', '/alterio/privacy')` → `/ca/alterio/privacy/`. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

/** `getStaticPaths` helper — one entry per locale. */
export function localeStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}
