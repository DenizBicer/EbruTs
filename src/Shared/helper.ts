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

