import { describe, it, expect } from 'vitest'
import { getProject } from './index'
import './alterio/index'
import './diskspace/index'

describe('project cover fields', () => {
  it('alterio has a cover defined', () => {
    expect(getProject('alterio')?.cover).toBeDefined()
  })

  it('diskspace has a cover defined', () => {
    expect(getProject('diskspace')?.cover).toBeDefined()
  })

  it('alterio cover.src has a non-empty src string', () => {
    const cover = getProject('alterio')?.cover
    expect(cover?.src.src).toBeTruthy()
  })

  it('diskspace cover.src has a non-empty src string', () => {
    const cover = getProject('diskspace')?.cover
    expect(cover?.src.src).toBeTruthy()
  })

  // control: existing fields must still resolve after adding cover
  it('control — alterio slug is still "alterio"', () => {
    expect(getProject('alterio')?.slug).toBe('alterio')
  })

  it('control — diskspace slug is still "diskspace"', () => {
    expect(getProject('diskspace')?.slug).toBe('diskspace')
  })
})
