/**
 * Reference:
 * The Unicode Standard, Version 13.0
 *
 * Hiragana:
 *  - Range: 3040–309F
 *  - URL: https://www.unicode.org/charts/PDF/U3040.pdf
 *
 * Katakana:
 *  - Range: 30A0–30FF
 *  - URL: https://www.unicode.org/charts/PDF/U30A0.pdf
 */

export type HexRange = [string, string]

// Inclusive
export const HIRAGANA_CODEBLOCK_RANGE: HexRange = ['0x3041', '0x3096']
export const KATAKANA_CODEBLOCK_RANGE: HexRange = ['0x30A1', '0x30FA']

export enum Categoty {
  hiragana = 'hiragana',
  katakana = 'katakana',
}
