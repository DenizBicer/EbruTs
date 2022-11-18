import p5 from "p5"

export function angleToDir(angRad: number): p5.Vector {
    const vector = new p5.Vector()
    vector.x = Math.cos(angRad)
    vector.y = Math.sin(angRad)
    return vector
}

export function isInRect(px: number, py: number, x: number, y: number, width: number, height: number): boolean {
    return px >= x && px < (x + width) && py >= y && py < ((y + height))
}

export function easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function getRandomElement<T>(list: T[]): T {
    const i = getRandomInt(0, list.length)
    return list[i]
}
export type point = { x: number, y: number }
function sqr(x: number) { return x * x }
function dist2(v: point, w: point) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegmentSquared(p: point, v: point, w: point) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, {
        x: v.x + t * (w.x - v.x),
        y: v.y + t * (w.y - v.y)
    });
}
export function distToSegment(p: point, v: point, w: point) {
    return Math.sqrt(distToSegmentSquared(p, v, w));
}

