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

export function getPalette(p: p5): Palette {
    const rawPallette = getRandomElement<RawPalette>(rawPalettes)
    return {
        colors: rawPallette.colors.map(c => p.color(c)),
        stroke: p.color(rawPallette.stroke),
        background: p.color(rawPallette.background),
    }
}


const rawPalettes: RawPalette[] = [
    // {
    //     colors: ['#ffffff', '#519D56', '#25292E'],
    //     stroke: '#251CFF',
    //     background: '#E3EEF0'
    // },
    {
        colors: ['#e3dd34', '#78496b', '#f0527f', '#a7e0e2', '#ffffff'],
        stroke: '#251CFF',
        background: '#e0eff0'
    }
]