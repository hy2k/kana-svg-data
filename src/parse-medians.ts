import { trimLeftNonDigit } from './utils'

type Median = [number, number]

export function parseMedians(d: string): Median[] {
  let found = true
  let medianStr = trimLeftNonDigit(d)

  const medians: Median[] = []

  while (found) {
    // X-coordinate
    const numX = parseFloat(medianStr)
    medianStr = medianStr.replace(numX.toString(), '')
    medianStr = trimLeftNonDigit(medianStr)

    // Y-coordinate
    const numY = parseFloat(medianStr)
    medianStr = medianStr.replace(numY.toString(), '')
    medianStr = trimLeftNonDigit(medianStr)

    if (isNaN(numX) || isNaN(numY)) {
      found = false
      continue
    }
    medians.push([numX, numY])
  }

  return medians
}
