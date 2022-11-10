import p5 from 'p5'
import { GUI } from 'dat.gui'

import { Settings } from './common'
import { isInRect } from './helper'
import { InkDrop } from './inkDrop'

export const inkDropSketch = (p: p5) => {

    const settings: Settings = { debug: false }
    const drops: InkDrop[] = []

    const minRadius = 20
    const maxRadius = 100
    let currentDropRadius = 0


    p.setup = () => {
        p.createCanvas(p.windowWidth - 260, 400)


        const resetObject = { reset: function onReset() { drops.splice(0, drops.length); } }
        const gui = new GUI()
        const settingsFolder = gui.addFolder('Settings')
        settingsFolder.add(settings, 'debug')
        settingsFolder.add(resetObject, 'reset')
        settingsFolder.open()
    }

    p.mousePressed = () => {
        currentDropRadius = minRadius
    }

    p.mouseReleased = () => {
        if (currentDropRadius < minRadius) {
            currentDropRadius = 0
            return
        }

        const dropPoint = p.createVector(p.mouseX, p.mouseY)
        const radius = currentDropRadius

        if (!isInRect(dropPoint, 0, 0, p.width, p.height))
            return

        drops.forEach(drop => drop.spreadPoints(dropPoint, radius))
        drops.push(new InkDrop(dropPoint, radius, p.color(255, 255, 255), p.TAU, settings))

        currentDropRadius = 0
    }


    function update() {
        if (p.mouseIsPressed) {
            currentDropRadius += 2.5
            currentDropRadius = p.min(currentDropRadius, maxRadius)
        }


        drops.forEach(drop => drop.update())
    }


    p.draw = () => {
        update()

        p.background(227, 238, 240);
        drops.forEach(drop => {
            drop.draw(p)
        });

        p.fill(255, 255, 255, 200)
        p.noStroke()
        p.circle(p.mouseX, p.mouseY, currentDropRadius * 2)
    }
}