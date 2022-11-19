import p5 from "p5";
import { InkDrop } from "../../drop/inkDrop";
import { getRandomElement } from "../../shared/helper";
import { getPallete, Palette } from "../../shared/palette";

export const wavyPatternSketch = (p: p5) => {
    const drops: InkDrop[] = []

    let palette: Palette

    p.setup = () => {
        p.createCanvas(400, 400)
        palette = getPallete(p, 1)

        setupInitialDrops()

        p.createButton('reset').mouseClicked(onReset)
    }

    p.draw = () => {
        drops.forEach(d => d.update())

        p.background(palette.background)

        drops.forEach(d => d.draw(p))
    }

    function onReset() {
        drops.splice(0, drops.length);
        setupInitialDrops()
    }

    function setupInitialDrops() {
        const center = p.createVector(p.width / 2, p.height / 3)
        const radius = 30

        const dropCount = 5

        for (let i = 0; i < dropCount; i++) {
            const currentColor = getRandomElement<p5.Color>(palette.colors)
            drops.forEach(drop => drop.spreadPoints(center, radius))
            const newDrop = new InkDrop(center, p.color(currentColor), { radius })
            drops.push(newDrop)
        }
    }
}