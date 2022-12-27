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

    let loopActivate = false
    let loopActiveIndex = 0
    let loopElapseTime = 250
    let lastLoopActiveTime = 0


    const settings = {
        lineThickness: 1,
        lineOpacity: 140,
        repeatDistanceInterval: 1,
        repeatThickness: 150,
        useFlatPen: false,
        penWidth: 11, // 2mm 
        renderOutline: false,
    }

    p.setup = () => {

        // 148 x 105mm

        p.createCanvas(840, 596)
        p.createButton('save').mouseClicked(onSave)
        p.createButton('reset').mouseClicked(onReset)
        p.createButton('add').mouseClicked(onAdd)
        p.createButton('toggleLoopActivate').mouseClicked(onToggleLoopActivate)
        p.createButton('activateAll').mouseClicked(onActivateAll)
        p.createButton('deactivateAll').mouseClicked(onDeactivateAll)

        p.strokeWeight(1); // do 0.1 for laser
        p.stroke(255, 0, 0); // red is good for laser
        p.noFill(); // better not to have a fill for laser


        gui = new GUI()
        gui.add(settings, 'repeatDistanceInterval')
        gui.add(settings, 'repeatThickness')
        gui.add(settings, 'lineThickness')
        gui.add(settings, 'lineOpacity')
        gui.add(settings, 'useFlatPen')
        gui.add(settings, 'penWidth')
        gui.add(settings, 'renderOutline')
        gui.close()

        currentColor = p.color(0)
        for (let index = 0; index < 5; index++) {
            onAdd()
        }
    }

    function onReset() {
        drops.splice(0, drops.length);
    }

    function onSave() {
        saveNextDraw = true
        svgG = p.createGraphics(p.width, p.height, p.SVG)
    }

    function onAdd() {
        const r = p.random(150);
        const theta = p.random(Math.PI * 2);
        const vector = angleToDir(theta)
        const position = p5.Vector.add(p.createVector(p.width / 2, p.height / 2), p5.Vector.mult(vector, r))

        const radius = p.random(100) + 50

        // drop(position.x, position.y, currentColor, radius, drops.length === 0)
        drop(position.x, position.y, currentColor, radius, true)
    }

    function onToggleLoopActivate() {
        loopActivate = !loopActivate
    }

    function onActivateAll() {
        drops.forEach(d => d.active = true)
    }

    function onDeactivateAll() {
        drops.forEach(d => d.active = false)
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

        drop(p.mouseX, p.mouseY, currentColor, currentDropRadius, true)

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

        if (!loopActivate)
            return

        const elapsedTime = Date.now() - lastLoopActiveTime

        if (elapsedTime < loopElapseTime)
            return

        lastLoopActiveTime = Date.now()
        loopActiveIndex = (loopActiveIndex + 1) % drops.length

        drops.forEach((drop, i) => drop.active = i === loopActiveIndex)
    }


    p.draw = () => {
        update()
        const renderer = saveNextDraw ? svgG : p;

        renderer.background(200)
        // renderer.stroke(37, 28, 255, settings.lineOpacity)
        renderer.stroke(0, 0, 0, settings.lineOpacity)
        renderer.strokeWeight(settings.lineThickness)

        drops.forEach(drop => {
            drop.drawPlot(renderer, settings.repeatDistanceInterval, settings.repeatThickness, settings.useFlatPen, settings.penWidth, settings.renderOutline)
        });

        // p.save('drop.svg')
        if (saveNextDraw) {
            svgG.save('print.svg')
            saveNextDraw = false
        }

        if (!currentColor)
            return

        if (!isInRect(p.mouseX, p.mouseY, 0, 0, p.width, p.height))
            return

        renderer.fill(currentColor)
        renderer.noStroke()
        renderer.circle(p.mouseX, p.mouseY, currentDropRadius * 2)

    }
}