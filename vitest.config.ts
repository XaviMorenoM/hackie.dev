// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — 'test' is a Vitest extension to Vite's UserConfig; astro check does not see it.
import { getViteConfig } from 'astro/config'

export default getViteConfig({ test: { include: ['src/**/*.test.ts'] } })
