import p5 from "p5"
import { GUI } from 'dat.gui'

import { InkDrop } from "../../../Drop/inkDrop"
import { tineLineArgs } from "../../../Drop/inkPoint"
import { getRandomElement, point } from "../../../Shared/helper"
import { getPallete, Palette } from "../../../Shared/palette"

const settings = {
    maximumShift: 50,
    sharpness: 5
}

export const tineLineSketch = (p: p5) => {
    const drops: InkDrop[] = []

    let palette: Palette
    let lineStart: point = { x: 0, y: 0 }
    let lineEnd: point = { x: 0, y: 0 }

    p.setup = () => {
        p.createCanvas(400, 400)
        palette = getPallete(p, 1)
        setupInitialDrops()

        p.createButton('reset').mouseClicked(onReset)

        const gui = new GUI()
        gui.add(settings, 'maximumShift')
        gui.add(settings, 'sharpness')
    }

    function onReset() {
        drops.splice(0, drops.length);
        setupInitialDrops()
    }

    p.draw = () => {
        update()

        p.background(palette.background)

        drops.forEach(drop => {
            drop.draw(p)
        });

        p.stroke(palette.stroke)
        p.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y)

    }

    function update() {
        drops.forEach(drop => drop.update())

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

    p.mousePressed = () => {
        lineStart.x = p.mouseX
        lineStart.y = p.mouseY

        lineEnd.x = p.mouseX
        lineEnd.y = p.mouseY
    }

    p.mouseReleased = () => {
        lineEnd.x = p.mouseX
        lineEnd.y = p.mouseY

        const args: tineLineArgs = {
            lineStart: p.createVector(lineStart.x, lineStart.y),
            lineEnd: p.createVector(lineEnd.x, lineEnd.y),
            maximumShift: settings.maximumShift,
            sharpness: settings.sharpness
        }
        drops.forEach(d => d.tineLinePoints(args))
    }

    p.mouseDragged = () => {
        lineEnd.x = p.mouseX
        lineEnd.y = p.mouseY
    }
}