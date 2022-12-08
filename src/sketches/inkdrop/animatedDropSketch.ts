import p5 from "p5";
import { InkDrop } from "../../drop/inkDrop";
import { getRandomElement } from "../../Shared/helper";
import { getPallete, Palette } from "../../Shared/palette";


type AnimatedDrop =
    {
        center: { x: number, y: number },
        radius: number,
        time: number
        isDropped: boolean
    }


export const animatedDropSketch = (p: p5) => {

    const animationDuration = 4000
    const loopAnimation = true

    let palette: Palette
    let timeStartAnimation: number = 0

    const animatedDrops: AnimatedDrop[] = [
        {
            center: { x: 0.5, y: 0.4 },
            radius: 25,
            time: 500,
            isDropped: false
        },
        {
            center: { x: 0.6, y: 0.45 },
            radius: 40,
            time: 1000,
            isDropped: false
        },
        {
            center: { x: 0.4, y: 0.35 },
            radius: 50,
            time: 1500,
            isDropped: false
        },
        {
            center: { x: 0.4, y: 0.5 },
            radius: 40,
            time: 2000,
            isDropped: false
        },
    ]

    const drops: InkDrop[] = []


    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);

        palette = getPallete(p, 0)
        timeStartAnimation = Date.now()
    }

    function reset() {
        drops.splice(0, drops.length)
        animatedDrops.map(a => a.isDropped = false)
    }

    function update() {
        const elapsedTime = Date.now() - timeStartAnimation

        if (elapsedTime > animationDuration) {
            if (loopAnimation) {
                timeStartAnimation = Date.now()
                reset()
            }

            return
        }

        for (const animatedDrop of animatedDrops) {
            if (animatedDrop.isDropped) continue

            if (elapsedTime < animatedDrop.time) continue

            const dropPoint = p.createVector(animatedDrop.center.x * p.width, animatedDrop.center.y * p.height)
            const radius = animatedDrop.radius
            const currentColor = getRandomElement<p5.Color>(palette.colors)


            drops.forEach(drop => drop.spreadPoints(dropPoint, radius))
            drops.push(new InkDrop(dropPoint, p.color(currentColor), { radius }))
            animatedDrop.isDropped = true
        }

        drops.forEach(drop => drop.update())
    }

    p.draw = () => {
        update()

        p.background(palette.background)

        drops.forEach(drop => {
            drop.draw(p)
        });

    }


}