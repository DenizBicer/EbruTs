import p5 from 'p5'
import { GUI } from 'dat.gui'
import * as tome from 'chromotome';

import { Settings } from '../Drop/common'
import { getRandomElement, isInRect } from '../Drop/helper'
import { InkDrop } from '../Drop/inkDrop'

type DropSettings = { minRadius: number, maxRadius: number }

export const inkDropSketch = (p: p5) => {

    const settings: Settings = { debug: false }
    const drops: InkDrop[] = []

    const dropSettings: DropSettings = {
        minRadius: 20,
        maxRadius: 100,
    }

    let palette: Palette

    let currentDropRadius = 0
    let currentColor: string = '#ffffff'

    p.setup = () => {
        p.createCanvas(p.windowWidth - 260, 400)

        palette = tome.get();

        const resetObject = { reset: function onReset() { drops.splice(0, drops.length); } }
        const gui = new GUI()
        const generalFolder = gui.addFolder('General')
        generalFolder.add(settings, 'debug')
        generalFolder.add(resetObject, 'reset')
        generalFolder.open()
        const sketchFolder = gui.addFolder('Drop')
        sketchFolder.add(dropSettings, 'minRadius')
        sketchFolder.add(dropSettings, 'maxRadius')
    }

    p.mousePressed = () => {
        currentDropRadius = dropSettings.minRadius
        currentColor = getRandomElement<string>(palette.colors)
    }

    p.mouseReleased = () => {
        if (currentDropRadius < dropSettings.minRadius) {
            currentDropRadius = 0
            return
        }

        const dropPoint = p.createVector(p.mouseX, p.mouseY)
        const radius = currentDropRadius

        if (!isInRect(dropPoint, 0, 0, p.width, p.height))
            return

        drops.forEach(drop => drop.spreadPoints(dropPoint, radius))
        drops.push(new InkDrop(dropPoint, radius, p.color(currentColor), p.TAU, settings))

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

        p.background(p.color(palette.background))

        drops.forEach(drop => {
            drop.draw(p)
        });

        p.fill(p.color(currentColor))
        p.noStroke()
        p.circle(p.mouseX, p.mouseY, currentDropRadius * 2)
    }
}