
import './src/styles/reset.css'
import './src/styles/index.css'
import './src/styles/article-image.css'
import './src/styles/article.css'
import './src/styles/button.css'
import './src/styles/text.css'

import { inkDropPlotSketch } from './src/sketches/inkDropPlotSketch'
import { sketchManager, SketchMap } from './src/shared/manageSketches'

const sketches: SketchMap[] = [
    {
        id: 'sketch',
        sketch: inkDropPlotSketch,
    }
]

new sketchManager(sketches)