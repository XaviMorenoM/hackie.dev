import { describe, it, expect, beforeAll } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import type { ImageMetadata } from 'astro'
import ProjectCard from './ProjectCard.astro'
// design-system: CardCover and ProjectMeta composition is tested via render output

const mockCover: { src: ImageMetadata; alt: string } = {
  src: { src: '/mock-cover.png', width: 1200, height: 675, format: 'png' },
  alt: 'Cover alt',
}

const baseProject = {
  slug: 'test-project',
  name: 'Test Project',
  platform: ['ios' as const],
  accent: '#C6FF3D',
  accentDark: '#C6FF3D',
  accentInk: '#101400',
  changelog: [],
}

describe('ProjectCard', () => {
  let container: AstroContainer

  beforeAll(async () => {
    container = await AstroContainer.create()
  })

  describe('with cover', () => {
    it('renders card-cover wrapper', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: { ...baseProject, cover: mockCover }, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).toContain('data-testid="card-cover"')
    })

    it('renders an <img> element', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: { ...baseProject, cover: mockCover }, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).toContain('<img')
    })

    it('renders the cover alt text', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: { ...baseProject, cover: mockCover }, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).toContain('alt="Cover alt"')
    })

    it('sets data-has-cover="true"', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: { ...baseProject, cover: mockCover }, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).toContain('data-has-cover="true"')
    })
  })

  describe('without cover', () => {
    it('does not render card-cover wrapper', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: baseProject, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).not.toContain('data-testid="card-cover"')
    })

    it('sets data-has-cover="false"', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: baseProject, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).toContain('data-has-cover="false"')
    })
  })

  describe('both cases: data attributes always present', () => {
    it('with cover: data-testid includes the slug', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: { ...baseProject, cover: mockCover }, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).toContain(`data-testid="project-card-${baseProject.slug}"`)
    })

    it('with cover: data-hover-border is present', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: { ...baseProject, cover: mockCover }, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).toContain('data-hover-border')
    })

    it('without cover: data-testid includes the slug', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: baseProject, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).toContain(`data-testid="project-card-${baseProject.slug}"`)
    })

    it('without cover: data-hover-border is present', async () => {
      const html = await container.renderToString(ProjectCard, {
        props: { project: baseProject, locale: 'en' },
        request: new Request('http://localhost/en/'),
      })
      expect(html).toContain('data-hover-border')
    })
  })

  // control: data-project-card must always be on the root anchor
  it('control — data-project-card is on the root element', async () => {
    const html = await container.renderToString(ProjectCard, {
      props: { project: baseProject, locale: 'en' },
      request: new Request('http://localhost/en/'),
    })
    expect(html).toContain('data-project-card')
  })
})
