import { describe, it, expect, beforeAll } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import Base from './Base.astro'

describe('Base layout', () => {
  let container: AstroContainer

  beforeAll(async () => {
    container = await AstroContainer.create()
  })

  it('never contains site-header', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd' },
      request: new Request('http://localhost/en/'),
    })
    expect(html).not.toContain('data-testid="site-header"')
  })

  it('renders site-controls', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd' },
      request: new Request('http://localhost/en/'),
    })
    expect(html).toContain('data-testid="site-controls"')
  })

  it('showThemeBubble:false → no theme-bubble', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd', showThemeBubble: false },
      request: new Request('http://localhost/en/'),
    })
    expect(html).not.toContain('data-testid="theme-bubble"')
  })

  it('projectAccent → <html> style contains --project-accent', async () => {
    const html = await container.renderToString(Base, {
      props: {
        locale: 'en',
        title: 't',
        description: 'd',
        projectAccent: { accent: '#4E79A7', accentDark: '#2c4a6b', accentInk: '#FFFFFF' },
      },
      request: new Request('http://localhost/en/'),
    })
    expect(html).toContain('--project-accent:#4E79A7')
  })

  it('no projectAccent → <html> has no style attribute', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd' },
      request: new Request('http://localhost/en/'),
    })
    expect(html).not.toMatch(/<html[^>]*style=/)
  })

  // control: site-bubble always present exactly once
  it('renders exactly one site-bubble', async () => {
    const html = await container.renderToString(Base, {
      props: { locale: 'en', title: 't', description: 'd' },
      request: new Request('http://localhost/en/'),
    })
    const matches = html.match(/data-testid="site-bubble"/g)
    expect(matches).not.toBeNull()
    expect(matches!.length).toBe(1)
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
