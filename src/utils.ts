export function trimLeftNonDigit(str: string): string {
  return str.replace(/^.+?(?=\d)/, '')
}

export function parseIdFromSVG(str: string): string {
  return str.replace(/.*(\d+([a-z]+)?).*$/, '$1')
}
