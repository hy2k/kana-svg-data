import * as fs from 'fs'
import * as path from 'path'
import { parse as parseSVG } from 'svgson'
import { parseMedians } from './parse-medians'
import { parseIdFromSVG } from './utils'

const inputDir = path.join(__dirname, '../vendor/animCJK/svgsKana')
const distDir = path.join(__dirname, '../dist')

type KanaCategoty = 'hiragana' | 'katakana'
type KanaDictionary = {
  [key in KanaCategoty]: string[]
}

// prettier-ignore
const kanaDict: KanaDictionary = {
  hiragana: [
    'あ', 'い', 'う', 'え', 'お',
    'か', 'き', 'く', 'け', 'こ',
    'さ', 'し', 'す', 'せ', 'そ',
    'た', 'ち', 'つ', 'て', 'と',
    'な', 'に', 'ぬ', 'ね', 'の',
    'は', 'ひ', 'ふ', 'へ', 'ほ',
    'ま', 'み', 'む', 'め', 'も',
    'や', 'ゆ', 'よ',
    'ら', 'り', 'る', 'れ', 'ろ',
    'わ', 'を', 'ん',
  ],
  katakana: [
    'ア', 'イ', 'ウ', 'エ', 'オ',
    'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ',
    'タ', 'チ', 'ツ', 'テ', 'ト',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ',
    'ヤ', 'ユ', 'ヨ',
    'ラ', 'リ', 'ル', 'レ', 'ロ',
    'ワ', 'ヲ', 'ン',
  ],
}

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

function classifySVGFiles(dir: string, dict: KanaDictionary) {
  const svgFiles = new Map<KanaCategoty, string[]>()
  const allFilenames = fs.readdirSync(dir)

  const caterories = Object.keys(dict) as KanaCategoty[]
  caterories.forEach((category) => {
    const filenames = allFilenames.filter((filename) => {
      const charcode = getCharCode(filename)
      return dict[category].includes(String.fromCharCode(charcode))
    })
    svgFiles.set(category, filenames)
  })
  return svgFiles
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir)
}

classifySVGFiles(inputDir, kanaDict).forEach((filelist, key) => {
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
