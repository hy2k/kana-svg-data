import {
  HexRange,
  HIRAGANA_CODEBLOCK_RANGE,
  KATAKANA_CODEBLOCK_RANGE,
} from './constants'

export function trimLeftNonDigit(str: string): string {
  return str.replace(/^.+?(?=\d)/, '')
}

export function parseIdFromSVG(str: string): string {
  return str.replace(/.*(\d+([a-z]+)?).*$/, '$1')
}

function getIsCharCodeInRange(charCode: number, unicodeHexRange: HexRange) {
  return (
    charCode >= parseInt(unicodeHexRange[0], 16) &&
    charCode <= parseInt(unicodeHexRange[1], 16)
  )
}

export function isHiragana(charCode: number): boolean {
  return getIsCharCodeInRange(charCode, HIRAGANA_CODEBLOCK_RANGE)
}

export function isKatakana(charCode: number): boolean {
  return getIsCharCodeInRange(charCode, KATAKANA_CODEBLOCK_RANGE)
}
