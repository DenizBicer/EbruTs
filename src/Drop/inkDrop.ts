import p5 from "p5"
import { Settings } from "./common"
import { angleToDir } from "./helper"

function DropMovement(point: p5.Vector, dropPoint: p5.Vector, radius: number) {
    const distanceToDrop = p5.Vector.dist(point, dropPoint)
    const forceAmount = Math.sqrt(1 + (radius * radius) / (distanceToDrop * distanceToDrop)) // not sure about the variable name
    const direction = p5.Vector.sub(point, dropPoint)
    const totalDisplacementFromDropPoint = p5.Vector.mult(direction, forceAmount) // not sure about the variable name
    const nextP = p5.Vector.add(dropPoint, totalDisplacementFromDropPoint)
    return nextP
}

export class InkDrop {

    sketchSetings: Settings

    currentPoints: p5.Vector[] = []
    startPoints: p5.Vector[] = []
    targetPoints: p5.Vector[] = []

    vertexCount: number = 60
    color: p5.Color

    transitionStartTime: number
    transitionDuration: number = 400

    constructor(center: p5.Vector, radius: number, color: p5.Color, TAU: number, sketchSetting: Settings) {
        this.sketchSetings = sketchSetting
        this.color = color

        for (let i = 0; i < this.vertexCount; i++) {
            const t = i / this.vertexCount
            const ang = t * TAU
            const vector = angleToDir(ang)

            const position = p5.Vector.add(center, p5.Vector.mult(vector, radius))

            this.startPoints.push(position)
            this.currentPoints.push(position)
            this.targetPoints.push(position)
        }

        this.transitionStartTime = Date.now()
    }

    spreadPoints(dropPoint: p5.Vector, radius: number): void {
        for (let i = 0; i < this.vertexCount; i++) {

            const p = this.currentPoints[i]
            var oldTarget = this.targetPoints[i]

            this.startPoints[i] = p;
            this.targetPoints[i] = DropMovement(oldTarget, dropPoint, radius);
        }

        this.transitionStartTime = Date.now()
    }

    update(): void {
        const elapsedTime = Date.now() - this.transitionStartTime;
        if (elapsedTime > this.transitionDuration) {
            return;
        }

        var t = elapsedTime / this.transitionDuration;

        for (let i = 0; i < this.vertexCount; i++) {
            const position = p5.Vector.lerp(this.startPoints[i], this.targetPoints[i], t)
            this.currentPoints[i] = position
        }
    }

    draw(p: p5): void {
        p.push()
        p.beginShape()
        p.fill(this.color)
        p.noStroke()
        for (let i = 0; i < this.vertexCount; i++) {
            const point = this.currentPoints[i]
            p.vertex(point.x, point.y)
        }

        p.endShape(p.CLOSE)
        p.pop()

        if (!this.sketchSetings.debug)
            return
        p.push()

        // noStroke()
        for (let i = 0; i < this.vertexCount; i++) {
            if (i % 1 !== 0)
                continue
            const start = this.startPoints[i]
            const point = this.currentPoints[i]
            const target = this.targetPoints[i]

            p.fill(37, 28, 255)
            p.noStroke()
            p.circle(point.x, point.y, 6)

            p.stroke(37, 28, 255, 80)
            p.strokeWeight(3)
            p.line(start.x, start.y, target.x, target.y)

        }
        p.pop()
    }
}