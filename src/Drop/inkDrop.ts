import p5 from "p5"
import { angleToDir } from "../Shared/helper"
import { inkPoint } from "./inkPoint"

type circleDrop = {
    radius: number
}
type customDrop = {
    radius: number
    points: p5.Vector[]
}

export class InkDrop {

    center: p5.Vector
    radius: number
    inkPoints: inkPoint[] = []
    vertexCount: number = 60
    color: p5.Color
    fill: boolean = true
    debug: boolean = false

    transitionDuration: number = 300


    constructor(center: p5.Vector, color: p5.Color, dropProperty: circleDrop | customDrop, initAnimate: boolean = false) {
        this.color = color
        this.center = center

        const circleDrop = dropProperty as circleDrop
        const customDrop = dropProperty as customDrop

        this.radius = circleDrop.radius

        if (customDrop.points) {
            customDrop.points.map(p => this.inkPoints.push(new inkPoint(center, p, initAnimate)))
            return
        }

        for (let i = 0; i < this.vertexCount; i++) {
            const t = i / this.vertexCount
            const ang = t * Math.PI * 2
            const vector = angleToDir(ang)

            const position = p5.Vector.add(center, p5.Vector.mult(vector, this.radius))

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

        for (let i = 0; i < this.inkPoints.length; i++) {
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