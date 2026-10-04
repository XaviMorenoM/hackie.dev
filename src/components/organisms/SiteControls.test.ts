import { describe, it, expect, beforeAll } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { LOCALES, LOCALE_LABELS } from '../../config'
import { useTranslations } from '../../i18n'
import SiteControls from './SiteControls.astro'

describe('SiteControls', () => {
  let container: AstroContainer

  beforeAll(async () => {
    container = await AstroContainer.create()
  })

  // Per-locale: core elements
  for (const locale of LOCALES) {
    it(`${locale}: renders site-controls, lang-bubble, and theme-bubble`, async () => {
      const html = await container.renderToString(SiteControls, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/diskspace/`),
      })
      expect(html).toContain('data-testid="site-controls"')
      expect(html).toContain('data-testid="lang-bubble"')
      expect(html).toContain('data-testid="theme-bubble"')
    })

    it(`${locale}: lang-bubble-trigger aria-label includes locale label`, async () => {
      const t = useTranslations(locale)
      const html = await container.renderToString(SiteControls, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/diskspace/`),
      })
      expect(html).toContain(`${t.nav.language}: ${LOCALE_LABELS[locale]}`)
    })

    it(`${locale}: has lang-option links for other locales, not current`, async () => {
      const otherLocales = LOCALES.filter((l) => l !== locale)
      const html = await container.renderToString(SiteControls, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/diskspace/`),
      })
      for (const l of otherLocales) {
        expect(html).toContain(`data-testid="lang-option-${l}"`)
      }
      expect(html).not.toContain(`data-testid="lang-option-${locale}"`)
    })

    it(`${locale}: has all three data-set-theme buttons`, async () => {
      const html = await container.renderToString(SiteControls, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/diskspace/`),
      })
      expect(html).toContain('data-set-theme="system"')
      expect(html).toContain('data-set-theme="light"')
      expect(html).toContain('data-set-theme="dark"')
    })
  }

  // Flag SVG for Catalan
  it('ca: renders the Senyera SVG with data-flag="ca"', async () => {
    const html = await container.renderToString(SiteControls, {
      props: { locale: 'ca' },
      request: new Request('http://localhost/ca/diskspace/'),
    })
    expect(html).toContain('data-flag="ca"')
  })

  // Edge cases: conditional rendering
  it('showTheme:false → no theme-bubble; lang-bubble still present', async () => {
    const html = await container.renderToString(SiteControls, {
      props: { locale: 'en', showTheme: false },
      request: new Request('http://localhost/en/diskspace/'),
    })
    expect(html).not.toContain('data-testid="theme-bubble"')
    expect(html).toContain('data-testid="lang-bubble"')
  })

  it('showLang:false → no lang-bubble; theme-bubble still present', async () => {
    const html = await container.renderToString(SiteControls, {
      props: { locale: 'en', showLang: false },
      request: new Request('http://localhost/en/diskspace/'),
    })
    expect(html).not.toContain('data-testid="lang-bubble"')
    expect(html).toContain('data-testid="theme-bubble"')
  })

  // Control: theme option labels come from translations, not hard-coded
  it('es: theme option labels are in Spanish', async () => {
    const t = useTranslations('es')
    const html = await container.renderToString(SiteControls, {
      props: { locale: 'es' },
      request: new Request('http://localhost/es/diskspace/'),
    })
    expect(html).toContain(t.nav.theme.system)
    expect(html).toContain(t.nav.theme.light)
    expect(html).toContain(t.nav.theme.dark)
  })
})
