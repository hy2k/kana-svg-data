import * as fs from 'fs'
import * as path from 'path'
import { parse as parseSVG } from 'svgson'
import { Categoty } from './constants'
import { parseMedians } from './parse-medians'
import { isHiragana, isKatakana, parseIdFromSVG } from './utils'

const inputDir = path.join(__dirname, '../vendor/animCJK/svgsKana')
const distDir = path.join(__dirname, '../dist')

function getCharCode(filename: string): number {
  return parseInt(path.basename(filename, '.svg'))
}

async function onFileContent(fileContent: string, filename: string) {
  const svgNode = await parseSVG(fileContent)

  // Remove the prefix `z` from id
  const charCode = getCharCode(filename)

  const allSvgPaths = svgNode.children
    .filter((el) => el.name === 'path')
    .map((el) => el.attributes)

  const medianElements = allSvgPaths.filter((el) => el['clip-path'])

  return {
    charCode,
    strokes: allSvgPaths
      .filter((el) => el.id)
      .map((el) => ({
        id: parseIdFromSVG(el.id),
        value: el.d,
      })),
    medians: medianElements.map((el) => ({
      id: parseIdFromSVG(el['clip-path']),
      value: parseMedians(el.d),
    })),
    clipPaths: medianElements.map((el) => ({
      id: parseIdFromSVG(el['clip-path']),
      value: el.d,
    })),
  }
}

function classifySVGFiles(dir: string) {
  const svgFiles = new Map<string, string[]>()
  const allFilenames = fs.readdirSync(dir)
  svgFiles.set(
    Categoty.hiragana,
    allFilenames.filter((filename) => isHiragana(getCharCode(filename)))
  )
  svgFiles.set(
    Categoty.katakana,
    allFilenames.filter((filename) => isKatakana(getCharCode(filename)))
  )
  return svgFiles
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir)
}

classifySVGFiles(inputDir).forEach((filelist, key) => {
  const outDir = path.join(distDir, key)
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
  }

  const promises = filelist.map((filename) => {
    const fileContent = fs.readFileSync(path.resolve(inputDir, filename), {
      encoding: 'utf-8',
    })

    return onFileContent(fileContent, filename)
  })

  const outPathAllChars = path.join(
    distDir,
    `all${key.charAt(0).toUpperCase() + key.slice(1)}.json`
  )

  Promise.all(promises)
    .then((data) => {
      fs.writeFile(outPathAllChars, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.log(err)
        }
      })

      data.forEach((item) => {
        const kana = String.fromCharCode(item.charCode)
        fs.writeFile(
          path.join(outDir, `${kana}.json`),
          JSON.stringify(item, null, 2),
          (err) => {
            if (err) {
              console.log(err)
            }
          }
        )
      })
    })
    .catch((err) => {
      console.error(err)
    })
})
