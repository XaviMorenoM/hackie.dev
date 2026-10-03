import { describe, it, expect, beforeAll } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import Base from './Base.astro'

describe('Base layout', () => {
  let container: AstroContainer

  beforeAll(async () => {
    container = await AstroContainer.create()
  })

  it('noHeader:false — renders exactly one site-bubble', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd', noHeader: false },
      request: new Request('http://localhost/en/'),
    })
    const matches = html.match(/data-testid="site-bubble"/g)
    expect(matches).not.toBeNull()
    expect(matches!.length).toBe(1)
  })

  it('noHeader:false — renders site-header', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd', noHeader: false },
      request: new Request('http://localhost/en/'),
    })
    expect(html).toContain('data-testid="site-header"')
  })

  it('noHeader:false — header contains no wordmark link', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd', noHeader: false },
      request: new Request('http://localhost/en/'),
    })
    // The wordmark link was a display-class anchor inside the header; the header
    // must only contain the lang-switcher and theme-switch now.
    expect(html).toContain('data-testid="lang-switcher"')
    expect(html).toContain('data-testid="theme-switch"')
    // No "display text-2xl" anchor (former wordmark) in the output
    expect(html).not.toContain('display text-2xl')
  })

  it('noHeader:true — renders exactly one site-bubble', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd', noHeader: true },
      request: new Request('http://localhost/en/'),
    })
    const matches = html.match(/data-testid="site-bubble"/g)
    expect(matches).not.toBeNull()
    expect(matches!.length).toBe(1)
  })

  it('noHeader:true — does not render site-header', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd', noHeader: true },
      request: new Request('http://localhost/en/'),
    })
    expect(html).not.toContain('data-testid="site-header"')
  })

  // control: skip link must exist and carry the raised z-index class
  it('skip link has z-[60] class', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd' },
      request: new Request('http://localhost/en/'),
    })
    expect(html).toContain('focus:z-[60]')
  })
})
