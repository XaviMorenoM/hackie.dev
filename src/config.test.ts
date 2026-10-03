import { describe, it, expect } from 'vitest'
import { APP_NAME, APP_SLUG } from './config'

describe('config constants', () => {
  it('APP_NAME is a non-empty string', () => {
    expect(typeof APP_NAME).toBe('string')
    expect(APP_NAME.length).toBeGreaterThan(0)
  })

  it('APP_SLUG is a non-empty string', () => {
    expect(typeof APP_SLUG).toBe('string')
    expect(APP_SLUG.length).toBeGreaterThan(0)
  })

  // control: these values must not silently become undefined
  it('APP_NAME and APP_SLUG are defined', () => {
    expect(APP_NAME).toBeDefined()
    expect(APP_SLUG).toBeDefined()
  })
})
