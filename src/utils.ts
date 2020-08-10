import * as path from 'path'

export function trimLeftNonDigit(str: string): string {
  return str.replace(/^.+?(?=\d)/, '')
}

export function parseIdFromSVG(str: string): string {
  return str.replace(/.*(\d+([a-z]+)?).*$/, '$1')
}

export function parseCharCode(filename: string): number {
  return parseInt(path.basename(filename, '.svg'))
}
