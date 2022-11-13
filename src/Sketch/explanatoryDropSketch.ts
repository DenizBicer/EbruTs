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
    alpha: number
}

type AnimationFrame = {
    time: number
    isEvaluated: boolean
    highlightIndex: number
    dropEvent?: AnimationKeyDropEvent
    renderChangeEvent?: AnimationRenderChangeEvent
}

type HighlightText = {
    id: string,
    element?: HTMLElement | null
}

const animationFramesForFirstDrop: AnimationFrame[] = [
    {
        time: 4000,
        isEvaluated: false,
        highlightIndex: 1,
        dropEvent: { center: { x: 0.25, y: 0.5 }, radius: 90, initAnimate: true, alpha: 100 },
        renderChangeEvent: { fill: true, debug: false }
    },
    {
        time: 6000,
        isEvaluated: false,
        highlightIndex: 2
    }
]

const animationFramesForSecondDrop: AnimationFrame[] = [
    {
        time: 0,
        isEvaluated: false,
        highlightIndex: 0,
        dropEvent: { center: { x: 0.55, y: 0.5 }, radius: 90, initAnimate: false, alpha: 255 },
        renderChangeEvent: { fill: false, debug: true }
    },
    {
        time: 10000,
        isEvaluated: false,
        highlightIndex: 3,
        renderChangeEvent: { fill: true, debug: true }
    },
    {
        time: 16000,
        isEvaluated: false,
        highlightIndex: 3,
        renderChangeEvent: { fill: true, debug: false }
    }
]

export const explanatoryDropSketch = (p: p5) => {
    const animationDuration = 20000
    const loopAnimation = true

    let palette: Palette
    let timeStartAnimation: number = 0

    let firstDrop: InkDrop | undefined = undefined
    let secondDrop: InkDrop | undefined = undefined

    let toggleAnimationButton: HTMLButtonElement
    let playAnimation: boolean = true
    let pauseElapsedTime: number = 0

    const highlightTexts: HighlightText[] = [{ id: 'explain-00' }, { id: 'explain-01' }, { id: 'explain-02' }, { id: 'explain-03' }]

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        palette = getPalette(p)
        timeStartAnimation = Date.now()
        const p5ElementButton = p.createButton('pause')
        p5ElementButton.mouseClicked(onToggleAnimation)
        toggleAnimationButton = p5ElementButton.elt as HTMLButtonElement

        highlightTexts.forEach(t => {
            t.element = document.getElementById(t.id)
        })
    }

    function onToggleAnimation() {
        playAnimation = !playAnimation
        toggleAnimationButton.textContent = playAnimation ? 'pause' : 'resume'
        if (playAnimation) {
            timeStartAnimation = Date.now() - pauseElapsedTime
        }
        else {
            pauseElapsedTime = Date.now() - timeStartAnimation
        }
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

            highlightTexts.forEach((t, i) => {
                if (t.element) {
                    if (i == frame.highlightIndex) {
                        t.element.classList.add('highlight')
                    }
                    else {
                        t.element.classList.remove('highlight')
                    }
                }
            })

            if (frame.dropEvent) {
                const dropPoint = p.createVector(frame.dropEvent.center.x * p.width, frame.dropEvent.center.y * p.height)
                const radius = frame.dropEvent.radius
                const currentColor = getRandomElement<p5.Color>(palette.colors)
                currentColor.setAlpha(frame.dropEvent.alpha)

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
        if (!playAnimation)
            return

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





