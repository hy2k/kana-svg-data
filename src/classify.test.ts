import { classify } from './classify'
import { Categoty } from './constants'

describe('classify', () => {
  it('categories filenames', () => {
    const testData = [
      '12353.svg',
      '12435',
      '12450.json',
      '12531',
      '10000.svg',
      'abc.svg',
    ]
    const expected = new Map([
      [Categoty.hiragana, ['12353.svg', '12435']],
      [Categoty.katakana, ['12450.json', '12531']],
    ])
    expect(classify(testData)).toStrictEqual(expected)
  })
})
