import { describe, it, expect } from 'vitest'
import { LOCALES } from '../config'
import { useTranslations } from './index'

describe('i18n translations', () => {
  for (const locale of LOCALES) {
    it(`${locale}: meta.appTitle is a non-empty string`, () => {
      const t = useTranslations(locale)
      expect(typeof t.meta.appTitle).toBe('string')
      expect(t.meta.appTitle.length).toBeGreaterThan(0)
    })
  }

  // control: the translation object structure must not drift — all top-level keys must exist
  it('each locale has all required top-level keys', () => {
    const requiredKeys = ['meta', 'nav', 'product', 'privacy', 'support', 'footer', 'notFound']
    for (const locale of LOCALES) {
      const t = useTranslations(locale)
      for (const key of requiredKeys) {
        expect(t, `${locale} missing key: ${key}`).toHaveProperty(key)
      }
    }
  })
})
