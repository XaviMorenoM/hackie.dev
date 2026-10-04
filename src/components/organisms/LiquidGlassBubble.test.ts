import { describe, it, expect, beforeAll } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { LOCALES, DEVELOPER_LINKEDIN } from '../../config'
import { localePath, useTranslations } from '../../i18n'
import LiquidGlassBubble from './LiquidGlassBubble.astro'
// Register all projects so projectSlugs is populated for the isProjectPage check
import '../../content/projects/alterio/index'
import '../../content/projects/diskspace/index'

// design-system: molecule candidate — BubbleGlass composition is tested via render output

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

    it(`${locale}: bubble-projects href points to home and has aria-current="true" on project page`, async () => {
      const t = useTranslations(locale)
      const html = await container.renderToString(LiquidGlassBubble, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/alterio/`),
      })
      const home = localePath(locale)
      expect(html).toContain(`href="${home}"`)
      expect(html).toContain('data-testid="bubble-projects"')
      // section indicator — link points into the current section but is not the exact page
      expect(html).toContain('aria-current="true"')
      expect(html).not.toContain('aria-current="page"')
      // label comes from locale
      expect(html).toContain(t.nav.bubble.projects)
    })

    it(`${locale}: bubble-projects has aria-current="page" on the directory (home) path`, async () => {
      const html = await container.renderToString(LiquidGlassBubble, {
        props: { locale },
        request: new Request(`http://localhost/${locale}/`),
      })
      // directory page — the link IS the current page
      expect(html).toContain('aria-current="page"')
      expect(html).not.toContain('aria-current="true"')
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

  it(`${LOCALES[0]}: bubble-projects has no aria-current on 404 page`, async () => {
    const locale = LOCALES[0]
    const html = await container.renderToString(LiquidGlassBubble, {
      props: { locale },
      request: new Request(`http://localhost/${locale}/404`),
    })
    // 404 path has no trailing slash — must not receive aria-current
    expect(html).not.toContain('aria-current')
  })

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
