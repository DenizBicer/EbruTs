import p5 from "p5"
import { distToSegment } from "../shared/helper"

function inkDrop(point: p5.Vector, dropPoint: p5.Vector, radius: number) {
    const distanceToDrop = p5.Vector.dist(point, dropPoint)
    const forceAmount = Math.sqrt(1 + (radius * radius) / (distanceToDrop * distanceToDrop)) // not sure about the variable name
    const direction = p5.Vector.sub(point, dropPoint)
    const totalDisplacementFromDropPoint = p5.Vector.mult(direction, forceAmount) // not sure about the variable name
    const nextP = p5.Vector.add(dropPoint, totalDisplacementFromDropPoint)
    return nextP
}

function tineLine(point: p5.Vector, args: tineLineArgs) {
    const { lineStart, lineEnd, maximumShift, sharpness } = args
    const distance = distToSegment(point, lineStart, lineEnd)
    const lineUnitVector = p5.Vector.sub(lineEnd, lineStart).normalize()
    const displacementAmount = (maximumShift * sharpness) / (distance + sharpness)
    const nextP = p5.Vector.add(point, p5.Vector.mult(lineUnitVector, displacementAmount))
    return nextP
}


function wavyPattern(point: p5.Vector, args: wavyPatternArgs) {
    const { p, amplitude, wavelength, phase, angle } = args
    const sinT = Math.sin(angle);
    const cosT = Math.cos(angle);

    const v1 = p.createVector(sinT, cosT)
    const v2 = p.createVector(cosT, sinT)

    const v = p5.Vector.dot(point, v1)
    const displacement = v2.mult(amplitude * Math.sin(wavelength * v + phase));

    return p5.Vector.add(point, displacement)
}


export type tineLineArgs = {
    lineStart: p5.Vector
    lineEnd: p5.Vector
    maximumShift: number
    sharpness: number
}

export type wavyPatternArgs = {
    p: p5
    amplitude: number
    wavelength: number
    phase: number
    angle: number
}

export class inkPoint {
    currentPoint: p5.Vector
    startPoint: p5.Vector
    targetPoint: p5.Vector

    pointHistory: p5.Vector[] = []
    distantHistory: number[] = []

    constructor(start: p5.Vector, target: p5.Vector, initAnimate: boolean) {
        this.startPoint = initAnimate ? start : target
        this.currentPoint = initAnimate ? start : target
        this.targetPoint = target
        this.pointHistory.push(start)
        this.pointHistory.push(target)
        this.distantHistory.push(0)
        this.distantHistory.push(p5.Vector.dist(start, target))
    }

    addHistory(point: p5.Vector) {
        const lastPoint = this.pointHistory[this.pointHistory.length - 1]
        const lastDistance = this.distantHistory[this.distantHistory.length - 1]

        this.pointHistory.push(point)
        this.distantHistory.push(lastDistance + p5.Vector.dist(lastPoint, point))
    }

    spread(dropPoint: p5.Vector, radius: number): void {
        this.startPoint = this.currentPoint
        this.targetPoint = inkDrop(this.targetPoint, dropPoint, radius)

        this.addHistory(this.targetPoint)
    }

    tineline(args: tineLineArgs) {
        this.startPoint = this.currentPoint
        this.targetPoint = tineLine(this.targetPoint, args)

        this.addHistory(this.targetPoint)
    }

    wavyPattern(args: wavyPatternArgs) {
        this.startPoint = this.currentPoint
        this.targetPoint = wavyPattern(this.targetPoint, args)

        this.addHistory(this.targetPoint)
    }

    animate(t: number): void {
        const position = p5.Vector.lerp(this.startPoint, this.targetPoint, t)
        this.currentPoint = position
    }

    getVertexAt(t: number): p5.Vector {
        const position = p5.Vector.lerp(this.startPoint, this.targetPoint, t)
        return position
    }

    getVertexAtHistory(t: number): p5.Vector {
        const strechedT = t * (this.pointHistory.length - 1)
        const startIndex = Math.max(Math.floor(strechedT), 0)
        const endIndex = Math.min(startIndex + 1, this.pointHistory.length - 1)

        const position = p5.Vector.lerp(this.pointHistory[startIndex], this.pointHistory[endIndex], strechedT - Math.floor(strechedT))
        return position
    }

    getVertexAtDistance(distance: number): p5.Vector {
        for (let index = 0; index < this.distantHistory.length - 1; index++) {
            const currentDistance = this.distantHistory[index];
            const nextDistance = this.distantHistory[index + 1];
            if (distance < currentDistance || distance > nextDistance)
                continue

            const currentPoint = this.pointHistory[index]
            const nextPoint = this.pointHistory[index + 1]
            const deltaDistance = distance - currentDistance

            const position = p5.Vector.add(
                currentPoint, p5.Vector.mult(
                    p5.Vector.normalize(p5.Vector.sub(nextPoint, currentPoint)),
                    deltaDistance))
            return position
        }

        return this.pointHistory[this.pointHistory.length - 1]
    }

    getLength(): number {
        return this.distantHistory[this.distantHistory.length - 1]
    }
}