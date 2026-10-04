import { describe, it, expect, beforeAll } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import ProjectLayout from './ProjectLayout.astro'
import type { Project } from '../content/projects/index'

const baseProject: Project = {
  slug: 'test-proj',
  name: 'Test Project',
  platform: ['ios'],
  accent: '#4E79A7',
  accentDark: '#2c4a6b',
  accentInk: '#FFFFFF',
  changelog: [],
}

describe('ProjectLayout', () => {
  let container: AstroContainer

  beforeAll(async () => {
    container = await AstroContainer.create()
  })

  it('supportsTheme:false → no theme-bubble', async () => {
    const html = await container.renderToString(ProjectLayout, {
      props: {
        project: { ...baseProject, supportsTheme: false },
        locale: 'en',
        title: 't',
        description: 'd',
      },
      request: new Request('http://localhost/en/test-proj/'),
    })
    expect(html).not.toContain('data-testid="theme-bubble"')
  })

  it('supportsTheme omitted → theme-bubble present', async () => {
    const html = await container.renderToString(ProjectLayout, {
      props: {
        project: baseProject,
        locale: 'en',
        title: 't',
        description: 'd',
      },
      request: new Request('http://localhost/en/test-proj/'),
    })
    expect(html).toContain('data-testid="theme-bubble"')
  })

  it('supportsTheme:true → theme-bubble present', async () => {
    const html = await container.renderToString(ProjectLayout, {
      props: {
        project: { ...baseProject, supportsTheme: true },
        locale: 'en',
        title: 't',
        description: 'd',
      },
      request: new Request('http://localhost/en/test-proj/'),
    })
    expect(html).toContain('data-testid="theme-bubble"')
  })

  // Accent bug fix: style must be on <html>, not via define:vars (which self-references)
  it('<html> style contains --project-accent (accent bug fix)', async () => {
    const html = await container.renderToString(ProjectLayout, {
      props: {
        project: baseProject,
        locale: 'en',
        title: 't',
        description: 'd',
      },
      request: new Request('http://localhost/en/test-proj/'),
    })
    expect(html).toContain('--project-accent:#4E79A7')
  })

  it('<html> style contains --project-accent when supportsTheme:false', async () => {
    const html = await container.renderToString(ProjectLayout, {
      props: {
        project: { ...baseProject, supportsTheme: false },
        locale: 'en',
        title: 't',
        description: 'd',
      },
      request: new Request('http://localhost/en/test-proj/'),
    })
    expect(html).toContain('--project-accent:#4E79A7')
  })
})
