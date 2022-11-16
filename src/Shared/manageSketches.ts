import p5 from "p5"

export type SketchMap = {
    id: string,
    sketch: (p: p5) => void
    p5Instance?: p5 | null
    htmlElement?: HTMLElement | null
}

export class sketchManager {
    sketches: SketchMap[]
    constructor(sketches: SketchMap[]) {
        this.sketches = sketches

        window.addEventListener('resize', this.onPageResize.bind(this))

        if (document.readyState === 'complete') {
            this.onPageLoaded()
        } else {
            window.addEventListener("load", this.onPageLoaded.bind(this));
        }

    }

    loadSketch(sketch: SketchMap) {
        sketch.htmlElement = document.getElementById(sketch.id)

        if (!sketch.htmlElement)
            return

        sketch.p5Instance = new p5(sketch.sketch, sketch.htmlElement)
    }

    onPageLoaded() {
        document.addEventListener('onSetup', this.onSketchSetup.bind(this))
        this.sketches.forEach(s => this.loadSketch(s))
        this.sketches.forEach(s => this.resizeSketchCanvas(s))
    }

    onSketchSetup() {
        this.sketches.forEach(s => this.resizeSketchCanvas(s))
    }

    resizeSketchCanvas(sketch: SketchMap) {
        if (!sketch.p5Instance || !sketch.htmlElement)
            return

        sketch.p5Instance.resizeCanvas(sketch.htmlElement.offsetWidth, sketch.htmlElement.offsetHeight)
    }

    onPageResize() {
        this.sketches.forEach(s => this.resizeSketchCanvas(s))
    }
}









