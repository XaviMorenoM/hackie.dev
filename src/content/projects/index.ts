export interface Project {
  slug: string;
  name: string;
  platform: ('ios' | 'macos' | 'cli')[];
  accent: string;
  accentDark: string;
  accentInk: string;
  githubUrl?: string;
  appStoreUrl?: string;
  testflightUrl?: string;
  installCommand?: string;
  changelog: { version: string; date: string; notes: string[] }[];
}

export const projectSlugs: string[] = [];

const registry = new Map<string, Project>();

export function registerProject(p: Project) {
  if (!projectSlugs.includes(p.slug)) projectSlugs.push(p.slug);
  registry.set(p.slug, p);
}

export function getProject(slug: string): Project | undefined {
  return registry.get(slug);
}

export function getAllProjects(): Project[] {
  return projectSlugs.map((s) => registry.get(s)).filter((p): p is Project => p !== undefined);
}
