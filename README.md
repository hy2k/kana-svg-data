# Kana SVG Data

## Description

Convert Kana SVG path data into JSON.

This repository's uses the svgsKana data from the [AnimeCJK](https://github.com/parsimonhi/animCJK) project.

[Hanzi Writer Japanese Data](https://github.com/chanind/hanzi-writer-data-jp) is the inspiration for this.


## Usage

### Install

using `yarn`

```
yarn add kana-svg-data
```

or `npm`

```
npm install kana-svg-data
```

### via CDN.

- https://cdn.jsdelivr.net/npm/kana-svg-data/dist/allHiragana.json

or

- https://cdn.jsdelivr.net/npm/kana-svg-data/dist/allKatakana.json


To get each character data,

- https://cdn.jsdelivr.net/npm/kana-svg-data/dist/hiragana/%E3%81%82.json

- https://cdn.jsdelivr.net/npm/kana-svg-data/dist/katakana/%E3%83%B3.json


## Data

The JSON of each character has the following shape.

```ts
interface CharacterJSON {
  charCode: number;
  strokes: {
    id: string;
    value: string;
  }[];
  clipPaths: {
    id: string;
    value: string;
  }[];
  medians: {
    id: string;
    value: [number, number][];
  }[];
}
```

`medians` property has the same data as `clipPaths`, except they were parsed to create an array of coordinates ([x, y]) for convinience.

`allHiragana.json` and `allKatakana.json` are the arrays of all characters for the same kana categories.

```ts
type AllKanaJSON = CharacterJSON[]
```

For example, below is the data for `hiragana/あ.json` with value omitted.

```JSON 
{
  "charCode": 12354,
  "strokes": [
    {
      "id": "1",
      "value": "M660 211C637 211 616 221 597 232C570 245 542 252 514 261 (...) Z"
    },
    { "id": "2", "value": "" },
    { "id": "3a", "value": "" },
    { "id": "3b", "value": "" }
  ],
  "medians": [
    {
      "id": "1",
      "value": [
        [ 174, 258 ],
        [ 251, 308 ],
        [ 440, 306 ],
        [ 697, 241 ]
      ]
    },
    { "id": "2", "value": [] },
    { "id": "3a", "value": [] },
    { "id": "3b", "value": [] }
  ],
  "clipPaths": [
    {
      "id": "1",
      "value": "M 174,258 251,308 440,306 697,241"
    },
    { "id": "2", "value": "" },
    { "id": "3a", "value": "" },
    { "id": "3b", "value": "" }
  ]
}
```

Expect the source SVG filenames to contain charCode within the following unicode range:

### Hiragana:
- Range: 3040–309F
- URL: https://www.unicode.org/charts/PDF/U3040.pdf

### Katakana:
- Range: 30A0–30FF
- URL: https://www.unicode.org/charts/PDF/U30A0.pdf

(The Unicode Standard, Version 13.0)


## Example (with React + emotion)

```jsx
import React from 'react';
import { css, keyframes } from '@emotion/core';
import charData from 'kana-svg-data/dist/hiragana/あ.json';

const draw = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

export function Character() {
  const prefix = `z${charData.charCode}`;
  return (
    <svg viewBox="0 0 1024 1024">
      <defs>
        {charData.strokes.map(({ id }) => (
          <clipPath key={id} id={`${prefix}c${id}`}>
            <use href={`#${prefix}d${id}`} />
          </clipPath>
        ))}
      </defs>
      {charData.strokes.map(({ id, value }) => {
        return <path key={id} id={`${prefix}d${id}`} d={value} fill="#ccc" />;
      })}
      {charData.clipPaths.map(({ id, value }) => {
        return (
          <path
            key={id}
            d={value}
            clipPath={`url(#${prefix}c${id})`}
            pathLength={3333}
            css={css`
              fill: none;
              stroke: #000;
              stroke-dasharray: 3337;
              stroke-dashoffset: 3339;
              stroke-width: 128;
              stroke-linecap: round;
              animation: ${draw} 1s linear forwards;
            `}
          />
        );
      })}
    </svg>
  );
}

```

## Licences

- GNU Lesser General Public License

For more information, please see the animeCJK's [COPYING.txt](https://github.com/parsimonhi/animCJK/blob/master/licenses/COPYING.txt) 
