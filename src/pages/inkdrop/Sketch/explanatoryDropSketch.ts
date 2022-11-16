import p5 from "p5"
import { InkDrop } from "../../../Drop/inkDrop"
import { getPalette, Palette } from "../../../Shared/palette"

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
        dropEvent: { center: { x: 0.25, y: 0.5 }, radius: 90, initAnimate: true },
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
        dropEvent: { center: { x: 0.55, y: 0.47 }, radius: 80, initAnimate: false },
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
                const currentColor = p.color(255, 180)

                drop = new InkDrop(dropPoint, p.color(currentColor), { radius }, frame.dropEvent.initAnimate)
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


        if (!firstDrop || !secondDrop)
            return

        p.fill("#f0527f")
        p.stroke("#f0527f")
        const offset = 10
        p.line(firstDrop.center.x, firstDrop.center.y, firstDrop.center.x + firstDrop.radius, firstDrop.center.y)
        p.text('r', firstDrop.center.x + firstDrop.radius / 2, firstDrop.center.y - offset / 2)
        p.text('C', firstDrop.center.x - offset, firstDrop.center.y - offset);
        p.circle(firstDrop.center.x, firstDrop.center.y, 5)


        const firstPoint = secondDrop.inkPoints[secondDrop.inkPoints.length / 2 + 3]
        p.line(firstPoint.startPoint.x, firstPoint.startPoint.y, firstPoint.targetPoint.x, firstPoint.targetPoint.y)

        p.circle(firstPoint.startPoint.x, firstPoint.startPoint.y, 5)
        p.text('P', firstPoint.startPoint.x + offset, firstPoint.startPoint.y + offset);

        p.circle(firstPoint.targetPoint.x, firstPoint.targetPoint.y, 5)
        p.text('P\'', firstPoint.targetPoint.x + offset, firstPoint.targetPoint.y + offset);


    }


}





