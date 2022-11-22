import p5 from "p5";

export function drawRepetitive(p: p5, center: p5.Vector, points: p5.Vector[], color: p5.Color, rep: number = 4) {
    const maxSmooth = 20

    for (let i = 0; i < rep; i++) {
        let pct = i / rep;
        const smoothPoints = getSmoothed(p, maxSmooth * pct, 0, points)

        p.push()

        p.translate(center.x, center.y)
        p.scale(p.map(1 - pct, 0, 1, 0.25, 1.25))
        p.translate(-center.x, -center.y)
        p.stroke(color)
        p.noFill()
        p.beginShape()

        for (let j = 0; j < smoothPoints.length; j++) {

            const point = smoothPoints[j];
            // const offset = p5.Vector.sub(center, point).normalize().mult(interval)
            // const newPoint = p5.Vector.add(point, offset)
            p.vertex(point.x, point.y)

        }
        p.endShape(p.CLOSE)

        p.pop()
    }

}

function getSmoothed(p: p5, smoothingSize: number, smoothingShape: number, points: p5.Vector[]) {
    const n = points.length
    smoothingSize = smoothingSize < 0 ? 0 : smoothingSize > n ? n : smoothingSize
    smoothingShape = smoothingShape < 0 ? 0 : smoothingShape > 1 ? 1 : smoothingShape


    const center = points.reduce((prev: p5.Vector, current: p5.Vector) => p5.Vector.add(prev, current)).div(points.length)

    // precompute weights and normalization
    const weights: number[] = [0]

    // side weights
    for (let i = 1; i < smoothingSize; i++) {
        const curWeight = p.map(i, 0, smoothingSize, 1, smoothingShape);
        weights.push(curWeight)
    }

    // make a copy of this polyline

    const result: p5.Vector[] = []

    for (let i = 0; i < n; i++) {
        let sum = 1; // center weight
        result.push(p.createVector())
        for (let j = 1; j < smoothingSize; j++) {
            const cur = p.createVector()

            let leftPosition = i - j
            let rightPosition = i + j
            if (leftPosition < 0) {
                leftPosition += n
            }
            if (leftPosition >= 0) {
                cur.add(points[leftPosition]).sub(center)
                sum += weights[j]
            }
            if (rightPosition >= n) {
                rightPosition -= n
            }
            if (rightPosition < n) {
                cur.add(points[rightPosition]).sub(center)
                sum += weights[j]
            }
            result[i] = result[i].add(cur.mult(weights[j]))

        }
        result[i] = result[i].div(sum).add(center)
    }

    return result
}