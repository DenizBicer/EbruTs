
import './src/styles/reset.css'
import './src/styles/index.css'
import './src/styles/article-image.css'
import './src/styles/article.css'
import './src/styles/button.css'
import './src/styles/text.css'

import { animatedDropSketch } from "./src/sketches/inkdrop/animatedDropSketch"
import { explanatoryDropSketch } from "./src/sketches/inkdrop/explanatoryDropSketch"
import { inkDropSketch } from "./src/sketches/inkdrop/inkDropSketch"
import { tineLineSketch } from './src/sketches/tineline/tineLineSketch'
import { sketchManager, SketchMap } from './src/shared/manageSketches'

const sketches: SketchMap[] = [
    {
        id: 'sketch-01',
        sketch: animatedDropSketch,
    },
    {
        id: 'sketch-02',
        sketch: explanatoryDropSketch
    }
    ,
    {
        id: 'sketch-03',
        sketch: inkDropSketch
    },
    {
        id: 'sketch-04',
        sketch: tineLineSketch
    }
]

new sketchManager(sketches)