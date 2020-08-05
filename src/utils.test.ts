import { parseIdFromSVG, trimLeftNonDigit } from './utils'

describe('regex utils', () => {
  it('trims non-digit from left', () => {
    expect(trimLeftNonDigit('aB c123')).toBe('123')
    expect(trimLeftNonDigit('abc123!')).toBe('123!')
  })

  it('parses clipPath ID from SVG', () => {
    expect(parseIdFromSVG('z12354c1')).toBe('1')
    expect(parseIdFromSVG('z12354c3a')).toBe('3a')
    expect(parseIdFromSVG('url(#z12354c1)')).toBe('1')
    expect(parseIdFromSVG('url(#z12354c3a)')).toBe('3a')
  })

  it('parses stroke ID from SVG', () => {
    expect(parseIdFromSVG('z12361d1')).toBe('1')
    expect(parseIdFromSVG('z12361d2b')).toBe('2b')
    expect(parseIdFromSVG('#z12361d1')).toBe('1')
    expect(parseIdFromSVG('#z12361d2b')).toBe('2b')
  })
})
