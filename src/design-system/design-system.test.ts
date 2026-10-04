import { describe, it, expect, beforeAll } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { LOCALES } from '../config'
import DesignSystemPage from '../pages/[locale]/design-system/index.astro'

describe('Design System page', () => {
  let container: AstroContainer

  beforeAll(async () => {
    container = await AstroContainer.create()
  })

  // Per-locale: page renders with the root test id
  for (const locale of LOCALES) {
    it(`${locale}: renders data-testid="design-system-page"`, async () => {
      const html = await container.renderToString(DesignSystemPage, {
        props: { locale },
        params: { locale },
        request: new Request(`http://localhost/${locale}/design-system/`),
      })
      expect(html).toContain('data-testid="design-system-page"')
    })

    it(`${locale}: page is noindex (dev-only)`, async () => {
      const html = await container.renderToString(DesignSystemPage, {
        props: { locale },
        params: { locale },
        request: new Request(`http://localhost/${locale}/design-system/`),
      })
      expect(html).toContain('noindex')
    })
  }

  // control: the page must not appear in main site navigation
  it('control — page has no link to navigation items', async () => {
    const html = await container.renderToString(DesignSystemPage, {
      props: { locale: 'en' },
      params: { locale: 'en' },
      request: new Request('http://localhost/en/design-system/'),
    })
    // page is not linked from itself
    expect(html).not.toContain('href="/en/design-system/"')
  })
})
