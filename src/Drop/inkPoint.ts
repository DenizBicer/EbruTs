import p5 from "p5"
import { distToSegment } from "../shared/helper"

function inkDropFunction(point: p5.Vector, dropPoint: p5.Vector, radius: number) {
    const distanceToDrop = p5.Vector.dist(point, dropPoint)
    const forceAmount = Math.sqrt(1 + (radius * radius) / (distanceToDrop * distanceToDrop)) // not sure about the variable name
    const direction = p5.Vector.sub(point, dropPoint)
    const totalDisplacementFromDropPoint = p5.Vector.mult(direction, forceAmount) // not sure about the variable name
    const nextP = p5.Vector.add(dropPoint, totalDisplacementFromDropPoint)
    return nextP
}

function tineLineFunction(point: p5.Vector, args: tineLineArgs) {
    const { lineStart, lineEnd, maximumShift, sharpness } = args
    const distance = distToSegment(point, lineStart, lineEnd)
    const lineUnitVector = p5.Vector.sub(lineEnd, lineStart).normalize()
    const displacementAmount = (maximumShift * sharpness) / (distance + sharpness)
    const nextP = p5.Vector.add(point, p5.Vector.mult(lineUnitVector, displacementAmount))
    return nextP
}

export type tineLineArgs = {
    lineStart: p5.Vector
    lineEnd: p5.Vector
    maximumShift: number
    sharpness: number
}

export class inkPoint {
    currentPoint: p5.Vector
    startPoint: p5.Vector
    targetPoint: p5.Vector


    constructor(start: p5.Vector, target: p5.Vector, initAnimate: boolean) {
        this.startPoint = initAnimate ? start : target
        this.currentPoint = initAnimate ? start : target
        this.targetPoint = target
    }

    spread(dropPoint: p5.Vector, radius: number): void {
        this.startPoint = this.currentPoint
        this.targetPoint = inkDropFunction(this.targetPoint, dropPoint, radius)
    }

    tineline(args: tineLineArgs) {
        this.startPoint = this.currentPoint
        this.targetPoint = tineLineFunction(this.targetPoint, args)
    }

    animate(t: number): void {
        const position = p5.Vector.lerp(this.startPoint, this.targetPoint, t)
        this.currentPoint = position
    }
}