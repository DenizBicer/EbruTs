import p5 from "p5"
import { animatedDropSketch } from "./Sketch/animatedDropSketch"
import { inkDropSketch } from "./Sketch/inkDropSketch"


type SketchMap = {
    id: string,
    sketch: (p: p5) => void
    p5Instance?: p5 | null
    htmlElement?: HTMLElement | null
}

const sketches: SketchMap[] = [
    {
        id: 'sketch-01',
        sketch: animatedDropSketch,
    },
    {
        id: 'sketch-02',
        sketch: inkDropSketch
    }
]



if (document.readyState === 'complete') {
    onPageLoaded()
} else {
    window.addEventListener("load", onPageLoaded);
}

function loadSketch(sketch: SketchMap) {
    sketch.htmlElement = document.getElementById(sketch.id)

    if (!sketch.htmlElement)
        return

    sketch.p5Instance = new p5(sketch.sketch, sketch.htmlElement)
}

function onPageLoaded() {

    sketches.forEach(s => loadSketch(s))
    sketches.forEach(s => resizeSketchCanvas(s))
}

function resizeSketchCanvas(sketch: SketchMap) {
    if (!sketch.p5Instance || !sketch.htmlElement)
        return

    sketch.p5Instance.resizeCanvas(sketch.htmlElement.offsetWidth, sketch.htmlElement.offsetHeight)

}

window.addEventListener('resize', onPageResize)


function onPageResize() {
    sketches.forEach(s => resizeSketchCanvas(s))
}
