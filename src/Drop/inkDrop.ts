import p5 from "p5"
import { angleToDir } from "../Shared/helper"
import { inkPoint } from "./inkPoint"


export class InkDrop {

    inkPoints: inkPoint[] = []
    vertexCount: number = 60
    color: p5.Color
    fill: boolean = true
    debug: boolean = false

    transitionDuration: number = 300

    constructor(center: p5.Vector, radius: number, color: p5.Color, TAU: number, initAnimate: boolean = false) {
        this.color = color

        for (let i = 0; i < this.vertexCount; i++) {
            const t = i / this.vertexCount
            const ang = t * TAU
            const vector = angleToDir(ang)

            const position = p5.Vector.add(center, p5.Vector.mult(vector, radius))

            this.inkPoints.push(new inkPoint(center, position, initAnimate))
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

        if (this.fill) {
            p.fill(this.color)
        }
        else {
            p.noFill()
        }

        p.noStroke()

        this.inkPoints.forEach(ip => {
            p.vertex(ip.currentPoint.x, ip.currentPoint.y)
        })

        p.endShape(p.CLOSE)
        p.pop()

        if (!this.debug)
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