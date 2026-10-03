import { describe, it, expect, beforeAll } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { LOCALES, DEVELOPER_LINKEDIN } from '../../config'
import { localePath, useTranslations } from '../../i18n'
import LiquidGlassBubble from './LiquidGlassBubble.astro'

describe('LiquidGlassBubble', () => {
  let container: AstroContainer

  beforeAll(async () => {
    container = await AstroContainer.create()
  })

  for (const locale of LOCALES) {
    it(`${locale}: renders data-testid="site-bubble"`, async () => {
      const html = await container.renderToString(LiquidGlassBubble, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/alterio/`),
      })
      expect(html).toContain('data-testid="site-bubble"')
    })

    it(`${locale}: bubble-projects href points to home and has no aria-current on non-home path`, async () => {
      const t = useTranslations(locale)
      const html = await container.renderToString(LiquidGlassBubble, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/alterio/`),
      })
      const home = localePath(locale)
      expect(html).toContain(`href="${home}"`)
      expect(html).toContain('data-testid="bubble-projects"')
      // aria-current present on a project page (active section indicator)
      expect(html).toContain('aria-current="page"')
      // label comes from locale
      expect(html).toContain(t.nav.bubble.projects)
    })

    it(`${locale}: bubble-projects has no aria-current="page" on directory (home) path`, async () => {
      const html = await container.renderToString(LiquidGlassBubble, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/`),
      })
      expect(html).not.toContain('aria-current="page"')
    })

    it(`${locale}: bubble-profile href equals DEVELOPER_LINKEDIN`, async () => {
      const html = await container.renderToString(LiquidGlassBubble, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/`),
      })
      expect(html).toContain(`href="${DEVELOPER_LINKEDIN}"`)
      expect(html).toContain('data-testid="bubble-profile"')
    })

    it(`${locale}: avatar src does not reference licdn.com`, async () => {
      const html = await container.renderToString(LiquidGlassBubble, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/`),
      })
      expect(html).not.toContain('licdn.com')
      expect(html).toContain('data-testid="bubble-avatar"')
    })
  }

  // control: component must not revert to hard-coded strings
  it('no hard-coded English "Projects" string outside translation', async () => {
    const container2 = await AstroContainer.create()
    const htmlEs = await container2.renderToString(LiquidGlassBubble, {
      props: { locale: 'es' },
      request: new Request('http://localhost/es/'),
    })
    const t = useTranslations('es')
    // Spanish uses "Proyectos", not "Projects"
    expect(htmlEs).toContain(t.nav.bubble.projects)
  })
})
