import * as fs from "fs";
import * as path from "path";
import { parse as parseSVG } from "svgson";

const inputDir = path.join(__dirname, "../vendor/animCJK/svgsKana");
const distDir = path.join(__dirname, "../dist");

type KanaCategoty = "hiragana" | "katakana"
type KanaDictionary = {
  [key in KanaCategoty]: string[];
};
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

async function onFileContent(
  fileContent: string
) {
  const svgNode = await parseSVG(fileContent);

  // Remove the prefix `z` from id
  const id = svgNode.attributes.id.slice(1);

  const allSvgPaths = svgNode.children
    .filter((el) => el.name === "path")
    .map((el) => el.attributes);

  const stroke = allSvgPaths
    .filter((el) => el.id)
    .map((el) => ({
      id: el.id.replace(/.*d/, ""),
      d: el.d,
    }));

  const median = allSvgPaths
    .filter((el) => el["clip-path"])
    .map((el) => ({
      id: el["clip-path"].replace(/.*c(\d+[a-z]*).+/, "$1"),
      d: el.d,
    }));

  return {
    id,
    stroke,
    median,
  };
}

function classify(dir: string, dict: KanaDictionary) {
  const svgFiles = new Map<string, string[]>();
  const allFilenames = fs.readdirSync(dir);

  Object.keys(dict).forEach((key: KanaCategoty) => {
    const filenames = allFilenames.filter((filename) => {
      const charcode = parseInt(path.basename(filename, ".svg"));
      return dict[key].includes(String.fromCharCode(charcode));
    });

    svgFiles.set(key, filenames);
  });

  return svgFiles;
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

classify(inputDir, kanaDict).forEach((filelist, key) => {
  const outDir = path.join(distDir, key);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  const promises = filelist.map((filename) => {
    const buffer = fs.readFileSync(path.resolve(inputDir, filename), {
      encoding: "utf-8",
    });

    return onFileContent(buffer);
  });

  const outPathAllChars = path.join(
    distDir,
    `all${key.charAt(0).toUpperCase() + key.slice(1)}.json`
  );

  Promise.all(promises)
    .then((data) => {
      fs.writeFile(outPathAllChars, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.log(err);
        }
      });

      data.forEach((item) => {
        const jaChar = String.fromCharCode(parseInt(item.id));

        const outPathChar = path.join(outDir, `${jaChar}.json`);

        fs.writeFile(outPathChar, JSON.stringify(item, null, 2), (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
});
