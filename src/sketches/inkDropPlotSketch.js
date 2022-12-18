import p5 from 'p5'
import p5Svg from "p5.js-svg"

import { getRandomElement, isInRect } from '../Shared/helper'
import { InkDrop } from '../drop/inkDrop'
import { GUI } from 'dat.gui'
import { angleToDir } from "../shared/helper"

p5Svg(p5)

export const inkDropPlotSketch = (p) => {
    const drops = []

    const dropSettings = {
        minRadius: 20,
        maxRadius: 100,
    }


    let currentDropRadius = 0
    let currentColor
    let saveNextDraw = false


    let gui
    let svgG

    const settings = {
        lineThickness: 2,
        lineOpacity: 80,
        repeatDistanceInterval: 3
    }

    p.setup = () => {

        p.createCanvas(p.windowWidth - 260, 400)
        p.createButton('save').mouseClicked(onSave)
        p.createButton('reset').mouseClicked(onReset)
        p.createButton('add').mouseClicked(onAdd)

        p.strokeWeight(1); // do 0.1 for laser
        p.stroke(255, 0, 0); // red is good for laser
        p.noFill(); // better not to have a fill for laser


        gui = new GUI()
        gui.add(settings, 'repeatDistanceInterval')
        gui.add(settings, 'lineThickness')
        gui.add(settings, 'lineOpacity')
    }

    function onReset() {
        drops.splice(0, drops.length);
    }

    function onSave() {
        saveNextDraw = true
        svgG = p.createGraphics(p.width, p.height, p.SVG)
    }

    function onAdd() {
        const r = p.random(200);
        const theta = p.random(Math.PI * 2);
        const vector = angleToDir(theta)
        const position = p5.Vector.add(p.createVector(p.width / 2, p.height / 2), p5.Vector.mult(vector, r))

        const radius = p.random(dropSettings.maxRadius) + 10

        // drop(position.x, position.y, currentColor, radius, drops.length === 0)
        drop(position.x, position.y, currentColor, radius, true)
    }

    p.mousePressed = () => {
        currentDropRadius = dropSettings.minRadius
        currentColor = p.color(0)
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

        drop(p.mouseX, p.mouseY, currentColor, currentDropRadius, drops.length === 0)

        currentDropRadius = 0
    }


    function drop(x, y, currentColor, radius, active) {
        const dropPoint = p.createVector(x, y)

        drops.forEach(drop => drop.spreadPoints(dropPoint, radius))

        const newDrop = new InkDrop(dropPoint, p.color(currentColor), { radius })
        newDrop.active = active
        drops.push(newDrop)
        gui.add(newDrop, 'active')
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
        p.background(200)
        p.stroke(37, 28, 255, settings.lineOpacity)
        p.strokeWeight(settings.lineThickness)

        drops.forEach(drop => {
            drop.drawPlot(p, settings.repeatDistanceInterval)
        });

        // p.save('drop.svg')
        if (saveNextDraw) {
            svgG.background(200)
            svgG.stroke(37, 28, 255, settings.lineOpacity)
            svgG.strokeWeight(settings.lineThickness)
            drops.forEach(drop => {
                drop.drawSVG(p, settings.repeatDistanceInterval, svgG)
            });
            svgG.save('print.svg')

            saveNextDraw = false
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