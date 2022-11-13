import p5 from 'p5'
import { isInRect } from '../Shared/helper'
import { getPalette, Palette } from '../Shared/palette'
import { InkDrop } from '../Drop/inkDrop'

export const typographySketch = (p: p5) => {
    const drops: InkDrop[] = []
    const letters = ['w', 'o', 'w', '!']
    let letterIndex = 0

    let palette: Palette
    let font: p5.Font

    p.preload = () => {
        font = p.loadFont('/Assets/party-confetti-font/PartyConfettiRegular-eZOn3.ttf');
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, 400)
        palette = getPalette(p)
        p.createButton('reset').mouseClicked(onReset)

        const onSetup = new CustomEvent('onSetup')

        document.dispatchEvent(onSetup)
    }

    function onReset() {
        drops.splice(0, drops.length)
        letterIndex = 0
    }

    p.mouseReleased = () => {

        if (!isInRect(p.mouseX, p.mouseY, 0, 0, p.width, p.height))
            return

        const dropPoint = p.createVector(p.mouseX, p.mouseY)


        const text = letters[letterIndex]
        const fontSize = 100


        const bounds = font.textBounds(text, dropPoint.x, dropPoint.y, fontSize) as { x: number, y: number, w: number, h: number };
        const radius = Math.max(bounds.w, bounds.h) / 2

        const points = font.textToPoints(text, dropPoint.x - bounds.w / 2, dropPoint.y + bounds.h / 2, fontSize, {
            sampleFactor: 0.4,
            simplifyThreshold: 0
        });

        const vectors = points.map(point => p.createVector(point.x, point.y))
        const color = palette.stroke
        color.setAlpha(80)

        drops.forEach(drop => drop.spreadPoints(dropPoint, radius))
        drops.push(new InkDrop(dropPoint, p.color(palette.stroke), { radius, points: vectors }))

        letterIndex = (letterIndex + 1) % letters.length
    }


    function update() {
        drops.forEach(drop => drop.update())
    }


    p.draw = () => {
        update()

        p.background(palette.background)

        drops.forEach(drop => {
            drop.draw(p)
        });


    }
}