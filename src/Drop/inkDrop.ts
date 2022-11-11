import p5 from "p5"
import { Settings } from "../Shared/common"
import { angleToDir, easeInOutSine } from "../Shared/helper"
import { inkPoint } from "./inkPoint"

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
    inkPoints: inkPoint[] = []
    vertexCount: number = 60
    color: p5.Color

    transitionDuration: number = 300

    constructor(center: p5.Vector, radius: number, color: p5.Color, TAU: number, sketchSetting: Settings) {
        this.sketchSetings = sketchSetting
        this.color = color

        for (let i = 0; i < this.vertexCount; i++) {
            const t = i / this.vertexCount
            const ang = t * TAU
            const vector = angleToDir(ang)

            const position = p5.Vector.add(center, p5.Vector.mult(vector, radius))

            this.inkPoints.push(new inkPoint(position))
        }
    }

    spreadPoints(dropPoint: p5.Vector, radius: number): void {
        this.inkPoints.forEach(p => p.spread(dropPoint, radius))
    }

    update(): void {
        this.inkPoints.forEach(p => p.update())
    }

    draw(p: p5): void {

        p.push()
        p.beginShape()
        p.fill(this.color)
        p.noStroke()

        this.inkPoints.forEach(ip => {
            p.vertex(ip.currentPoint.x, ip.currentPoint.y)
        })

        p.endShape(p.CLOSE)
        p.pop()

        if (!this.sketchSetings.debug)
            return

        p.push()

        for (let i = 0; i < this.vertexCount; i++) {
            if (i % 3 !== 0)
                continue

            const inkPoint = this.inkPoints[i]
            const start = inkPoint.startPoint
            const point = inkPoint.currentPoint
            const target = inkPoint.targetPoint

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