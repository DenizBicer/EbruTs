import p5 from "p5"
import { InkDrop } from "../Drop/inkDrop"
import { getRandomElement } from "../Shared/helper"
import { getPalette, Palette } from "../Shared/palette"

type AnimationRenderChangeEvent = {
    fill: boolean,
    debug: boolean
}

type AnimationKeyDropEvent = {
    center: { x: number, y: number },
    radius: number,
    initAnimate: boolean
}

type AnimationFrame = {
    time: number
    isEvaluated: boolean
    dropEvent?: AnimationKeyDropEvent
    renderChangeEvent?: AnimationRenderChangeEvent
}

const animationFramesForFirstDrop: AnimationFrame[] = [
    {
        time: 2000,
        isEvaluated: false,
        dropEvent: { center: { x: 0.25, y: 0.5 }, radius: 90, initAnimate: true },
        renderChangeEvent: { fill: true, debug: false }
    }
]

const animationFramesForSecondDrop: AnimationFrame[] = [
    {
        time: 0,
        isEvaluated: false,
        dropEvent: { center: { x: 0.5, y: 0.5 }, radius: 90, initAnimate: false },
        renderChangeEvent: { fill: false, debug: true }
    },
    {
        time: 4000,
        isEvaluated: false,
        renderChangeEvent: { fill: true, debug: true }
    },
    {
        time: 6000,
        isEvaluated: false,
        renderChangeEvent: { fill: true, debug: false }
    }
]
export const explanatoryDropSketch = (p: p5) => {
    const animationDuration = 8000
    const loopAnimation = true

    let palette: Palette
    let timeStartAnimation: number = 0

    let firstDrop: InkDrop | undefined = undefined
    let secondDrop: InkDrop | undefined = undefined

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        palette = getPalette(p)
        timeStartAnimation = Date.now()
    }

    function reset() {
        firstDrop = undefined
        secondDrop = undefined

        animationFramesForFirstDrop.map(a => a.isEvaluated = false)
        animationFramesForSecondDrop.map(a => a.isEvaluated = false)
    }

    function evaluateAnimation(frames: AnimationFrame[], elapsedTime: number, drop: InkDrop | undefined, otherDrop: InkDrop | undefined): InkDrop | undefined {
        for (const frame of frames) {
            if (frame.isEvaluated) continue
            if (elapsedTime < frame.time) continue

            if (frame.dropEvent) {
                const dropPoint = p.createVector(frame.dropEvent.center.x * p.width, frame.dropEvent.center.y * p.height)
                const radius = frame.dropEvent.radius
                const currentColor = getRandomElement<p5.Color>(palette.colors)

                drop = new InkDrop(dropPoint, radius, p.color(currentColor), p.TAU, frame.dropEvent.initAnimate)
                if (otherDrop) {
                    otherDrop.spreadPoints(dropPoint, radius)
                }
            }

            if (frame.renderChangeEvent && drop) {
                drop.fill = frame.renderChangeEvent.fill
                drop.debug = frame.renderChangeEvent.debug
            }

            frame.isEvaluated = true
        }
        return drop
    }

    function update() {

        firstDrop && firstDrop.update()
        secondDrop && secondDrop.update()

        const elapsedTime = Date.now() - timeStartAnimation

        if (elapsedTime > animationDuration) {
            if (loopAnimation) {
                timeStartAnimation = Date.now()
                reset()
            }

            return
        }

        firstDrop = evaluateAnimation(animationFramesForFirstDrop, elapsedTime, firstDrop, secondDrop)
        secondDrop = evaluateAnimation(animationFramesForSecondDrop, elapsedTime, secondDrop, firstDrop)
    }

    p.draw = () => {
        update()

        p.background(palette.background)

        secondDrop && secondDrop.draw(p)
        firstDrop && firstDrop.draw(p)
    }


}





