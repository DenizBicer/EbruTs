import p5 from "p5"
import { angleToDir, easeInOutSine } from "../shared/helper"
import { inkPoint, tineLineArgs, wavyPatternArgs } from "./inkPoint"

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
    vertexCount: number = 100
    color: p5.Color
    fill: boolean = true
    debug: boolean = false
    active: boolean = true

    transitionStartTime: number = 0
    transitionDuration: number = 300


    constructor(center: p5.Vector, color: p5.Color, dropProperty: circleDrop | customDrop, initAnimate: boolean = false) {
        this.color = color
        this.center = center

        const circleDrop = dropProperty as circleDrop
        const customDrop = dropProperty as customDrop

        this.radius = circleDrop.radius

        this.transitionStartTime = Date.now()

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
        this.transitionStartTime = Date.now()
    }

    tineLinePoints(args: tineLineArgs) {
        this.inkPoints.forEach(p => p.tineline(args))
        this.transitionStartTime = Date.now()
    }

    wavyPatternPoints(args: wavyPatternArgs) {
        this.inkPoints.forEach(p => p.wavyPattern(args))
        this.transitionStartTime = Date.now()
    }

    update(): void {
        const elapsedTime = Date.now() - this.transitionStartTime;
        if (elapsedTime > this.transitionDuration) {
            return;
        }

        let t = elapsedTime / this.transitionDuration;
        t = easeInOutSine(t)
        this.inkPoints.forEach(p => p.animate(t))
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

    drawPlot(p: p5, repeatDistanceInterval: number, repeatThickness: number): void {
        if (!this.active)
            return

        p.push()
        p.noFill()


        const maxDistance = this.inkPoints.map(p => p.getLength()).reduce((p, c) => Math.max(p, c))
        const repeatCount = maxDistance / repeatDistanceInterval

        const maxThickness = repeatCount * repeatDistanceInterval

        for (let index = repeatCount; index > 0; index--) {

            const d = index * repeatDistanceInterval

            if ((maxThickness - d) > repeatThickness)
                break

            p.beginShape()
            this.inkPoints.forEach(ip => {
                const vertex = ip.getVertexAtDistance(d)
                p.curveVertex(vertex.x, vertex.y)
            })
            p.endShape(p.CLOSE)
        }
        p.pop()
    }

    drawSVG(p: p5, repeatDistanceInterval: number, repeatThickness: number, svgG: any) {
        if (!this.active)
            return

        svgG.push()
        svgG.noFill()


        const maxDistance = this.inkPoints.map(p => p.getLength()).reduce((p, c) => Math.max(p, c))
        const repeatCount = maxDistance / repeatDistanceInterval

        const maxThickness = repeatCount * repeatDistanceInterval


        for (let index = repeatCount; index > 0; index--) {

            const d = index * repeatDistanceInterval

            if ((maxThickness - d) > repeatThickness)
                break

            svgG.beginShape()
            this.inkPoints.forEach(ip => {
                const vertex = ip.getVertexAtDistance(d)
                svgG.curveVertex(vertex.x, vertex.y)
            })
            svgG.endShape(p.CLOSE)
        }
        svgG.pop()
    }
}