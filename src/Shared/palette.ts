import p5 from "p5";
import { getRandomElement } from "./helper";

export type Palette = {
    colors: p5.Color[],
    stroke: p5.Color,
    background: p5.Color,
}

type RawPalette = {
    colors: string[],
    stroke: string,
    background: string,
}


export function getPallete(p: p5, index: number): Palette {
    if (index > rawPalettes.length)
        return getRandomPalette(p)

    const rawPallette = rawPalettes[index]
    return rawPaletteToPalette(p, rawPallette)
}

export function getRandomPalette(p: p5): Palette {
    const rawPallette = getRandomElement<RawPalette>(rawPalettes)
    return rawPaletteToPalette(p, rawPallette)
}

function rawPaletteToPalette(p: p5, raw: RawPalette): Palette {
    return {
        colors: raw.colors.map(c => p.color(c)),
        stroke: p.color(raw.stroke),
        background: p.color(raw.background),
    }
}

const rawPalettes: RawPalette[] = [
    // {
    //     colors: ['#8c8c8c', '#616161', '#a1a1a1', '#c4c4c4', '#ffffff'],
    //     stroke: '#251CFF',
    //     background: '#e8e8e8'
    // },
    {
        colors: ['#e3dd34', '#78496b', '#f0527f', '#a7e0e2', '#ffffff'],
        stroke: '#251CFF',
        background: '#e0eff0'
    },
    {
        colors: ['#172a89', '#f7f7f3', '#f3abb0'],
        stroke: '#251CFF',
        background: '#e0eff0',
    }
]

