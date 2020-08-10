import { parseMedians } from './parse-medians'

describe('parse-medians', () => {
  it('parses comma-separated median string such as あ', () => {
    const testStr = 'M 174,258 251,308 440,306'
    const expected = [
      [174, 258],
      [251, 308],
      [440, 306],
    ]
    expect(parseMedians(testStr)).toStrictEqual(expected)
  })

  it('parses space-separated median string such as カ', () => {
    const testStr = 'M470 97L528 158L489 391'
    const expected = [
      [470, 97],
      [528, 158],
      [489, 391],
    ]
    expect(parseMedians(testStr)).toStrictEqual(expected)
  })

  it('parses series of number separated by space such as の', () => {
    const testStr = 'M 505 239 540 439 468 605'
    const expected = [
      [505, 239],
      [540, 439],
      [468, 605],
    ]
    expect(parseMedians(testStr)).toStrictEqual(expected)
  })

  it('parses mix of integers and floating point numbers such as お', () => {
    const testStr = 'M 111.6,323.2 174,363.7 327,362.1'
    const expected = [
      [111.6, 323.2],
      [174, 363.7],
      [327, 362.1],
    ]
    expect(parseMedians(testStr)).toStrictEqual(expected)
  })
})
