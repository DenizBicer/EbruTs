import p5 from "p5"
import { animatedDropSketch } from "./Sketch/animatedDropSketch"
import { inkDropSketch } from "./Sketch/inkDropSketch"

const div = document.getElementById('p5sketch')
const sketch = animatedDropSketch
const p5sketch = div && new p5(sketch, div)

if (document.readyState === 'complete') {
    onPageLoaded()
} else {
    window.addEventListener("load", onPageLoaded);
}

function onPageLoaded() {

    resizeSketchCanvas()
}

function resizeSketchCanvas() {
    if (!p5sketch || !div)
        return

    p5sketch.resizeCanvas(div.offsetWidth, div.offsetHeight)
    console.log(div.offsetWidth, div.offsetHeight)
}

window.addEventListener('resize', onPageResize)


function onPageResize() {
    resizeSketchCanvas()
}
