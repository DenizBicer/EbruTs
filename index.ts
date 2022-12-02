
import './src/styles/reset.css'
import './src/styles/index.css'
import './src/styles/article-image.css'
import './src/styles/article.css'
import './src/styles/button.css'
import './src/styles/text.css'

import { animatedDropSketch } from './src/sketches/animatedDropSketch'
import { explanatoryDropSketch } from './src/sketches/explanatoryDropSketch'
import { inkDropSketch } from './src/sketches/inkDropSketch'
import { tineLineSketch } from './src/sketches/tineLineSketch'
import { wavyPatternSketch } from './src/sketches/wavyPatternSketch'
import { circularTineLineSketch } from './src/sketches/circularTineLineSketch'
import { stylizedDropSketch } from './src/sketches/stylizedDropSketch'
import { sketchManager, SketchMap } from './src/shared/manageSketches'

const sketches: SketchMap[] = [
    {
        id: 'sketch',
        sketch: stylizedDropSketch,
    },
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
    },
    {
        id: 'sketch-05',
        sketch: wavyPatternSketch
    },
    {
        id: 'sketch-06',
        sketch: circularTineLineSketch
    }
]

new sketchManager(sketches)