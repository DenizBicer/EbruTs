import p5 from "p5"
import { easeInOutSine } from "../Shared/helper"

function DropMovement(point: p5.Vector, dropPoint: p5.Vector, radius: number) {
    const distanceToDrop = p5.Vector.dist(point, dropPoint)
    const forceAmount = Math.sqrt(1 + (radius * radius) / (distanceToDrop * distanceToDrop)) // not sure about the variable name
    const direction = p5.Vector.sub(point, dropPoint)
    const totalDisplacementFromDropPoint = p5.Vector.mult(direction, forceAmount) // not sure about the variable name
    const nextP = p5.Vector.add(dropPoint, totalDisplacementFromDropPoint)
    return nextP
}

export class inkPoint {
    currentPoint: p5.Vector
    startPoint: p5.Vector
    targetPoint: p5.Vector

    transitionStartTime: number = 0
    transitionDuration: number = 300

    constructor(position: p5.Vector) {
        this.startPoint = position
        this.currentPoint = position
        this.targetPoint = position

        this.transitionStartTime = Date.now()
    }

    spread(dropPoint: p5.Vector, radius: number): void {
        this.startPoint = this.currentPoint
        this.targetPoint = DropMovement(this.targetPoint, dropPoint, radius)
        this.transitionStartTime = Date.now()
    }

    update(): void {
        const elapsedTime = Date.now() - this.transitionStartTime;
        if (elapsedTime > this.transitionDuration) {
            return;
        }

        let t = elapsedTime / this.transitionDuration;

        t = easeInOutSine(t)
        const position = p5.Vector.lerp(this.startPoint, this.targetPoint, t)
        this.currentPoint = position
    }
}