import p5 from "p5"
import { getPalette, Palette } from "../../../Shared/palette"

export const tineLineSketch = (p: p5) => {
    let palette: Palette

    p.setup = () => {
        p.createCanvas(400, 400)
        palette = getPalette(p)
    }

    p.draw = () => {
        p.background(palette.background)
    }
}