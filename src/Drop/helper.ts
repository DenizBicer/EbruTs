import p5 from "p5"

export function angleToDir(angRad: number): p5.Vector {
    const vector = new p5.Vector()
    vector.x = Math.cos(angRad)
    vector.y = Math.sin(angRad)
    return vector
}

export function isInRect(point: p5.Vector, x: number, y: number, width: number, height: number): boolean {
    return point.x >= x && point.x < (x + width) && point.y >= y && point.y < ((y + height))
}
