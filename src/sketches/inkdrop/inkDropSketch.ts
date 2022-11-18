import p5 from 'p5'
import { getRandomElement, isInRect } from '../../Shared/helper'
import { getPallete, Palette } from '../../Shared/palette'
import { InkDrop } from '../../drop/inkDrop'

type DropSettings = { minRadius: number, maxRadius: number }

export const inkDropSketch = (p: p5) => {
    const drops: InkDrop[] = []


    const dropSettings: DropSettings = {
        minRadius: 20,
        maxRadius: 100,
    }

    let palette: Palette

    let currentDropRadius = 0
    let currentColor: p5.Color | undefined
    let saveNextDraw: boolean = false

    let initialPixelDensity: number = 1

    p.setup = () => {
        p.createCanvas(p.windowWidth - 260, 400)
        palette = getPallete(p, 0)
        p.createButton('save').mouseClicked(onSave)
        p.createButton('reset').mouseClicked(onReset)

        initialPixelDensity = p.pixelDensity()
    }

    function onReset() { drops.splice(0, drops.length); }

    function onSave() {
        saveNextDraw = true
        p.pixelDensity(8)
    }

    p.mousePressed = () => {
        currentDropRadius = dropSettings.minRadius
        currentColor = getRandomElement<p5.Color>(palette.colors)
    }

    p.mouseReleased = () => {
        if (currentDropRadius < dropSettings.minRadius) {
            currentDropRadius = 0
            return
        }

        if (!isInRect(p.mouseX, p.mouseY, 0, 0, p.width, p.height))
            return

        if (!currentColor)
            return

        const dropPoint = p.createVector(p.mouseX, p.mouseY)
        const radius = currentDropRadius

        drops.forEach(drop => drop.spreadPoints(dropPoint, radius))
        drops.push(new InkDrop(dropPoint, p.color(currentColor), { radius }))

        currentDropRadius = 0
    }


    function update() {
        if (p.mouseIsPressed) {
            currentDropRadius += 2.5
            currentDropRadius = p.min(currentDropRadius, dropSettings.maxRadius)
        }


        drops.forEach(drop => drop.update())
    }


    p.draw = () => {
        update()

        p.background(palette.background)

        drops.forEach(drop => {
            drop.draw(p)
        });

        if (saveNextDraw) {
            p.saveCanvas('inkdrop', 'png')
            saveNextDraw = false
            p.pixelDensity(initialPixelDensity)
        }

        if (!currentColor)
            return

        if (!isInRect(p.mouseX, p.mouseY, 0, 0, p.width, p.height))
            return

        p.fill(currentColor)
        p.noStroke()
        p.circle(p.mouseX, p.mouseY, currentDropRadius * 2)
    }
}