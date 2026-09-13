// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Preview builds (workflow_dispatch) override these to serve from <user>.github.io/<repo>/.
const SITE_URL = process.env.SITE_URL ?? 'https://hackie.dev';
const SITE_BASE = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site: SITE_URL,
  base: SITE_BASE,
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ca'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  // Self-hosted at build time (no runtime request to Google), preloaded from Base.astro.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--font-instrument-serif',
      weights: [400],
      styles: ['italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      display: 'swap',
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      display: 'swap',
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      // `/` and `/<locale>/alterio/` are only meta-refresh redirects.
      filter: (page) => page !== new URL(SITE_BASE, SITE_URL).href && !/\/alterio\/$/.test(page),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', es: 'es', ca: 'ca' },
      },
    }),
  ],
});
