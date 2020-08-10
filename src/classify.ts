import {
  Categoty,
  HexRange,
  HIRAGANA_CODEBLOCK_RANGE,
  KATAKANA_CODEBLOCK_RANGE,
} from './constants'
import { parseCharCode } from './utils'

function getIsCharCodeInRange(charCode: number, unicodeHexRange: HexRange) {
  return (
    charCode >= parseInt(unicodeHexRange[0], 16) &&
    charCode <= parseInt(unicodeHexRange[1], 16)
  )
}

function isHiragana(charCode: number): boolean {
  return getIsCharCodeInRange(charCode, HIRAGANA_CODEBLOCK_RANGE)
}

function isKatakana(charCode: number): boolean {
  return getIsCharCodeInRange(charCode, KATAKANA_CODEBLOCK_RANGE)
}

export function classify(files: string[]): Map<string, string[]> {
  const svgFiles = new Map<string, string[]>()
  svgFiles.set(
    Categoty.hiragana,
    files.filter((filename) => isHiragana(parseCharCode(filename)))
  )
  svgFiles.set(
    Categoty.katakana,
    files.filter((filename) => isKatakana(parseCharCode(filename)))
  )
  return svgFiles
}
