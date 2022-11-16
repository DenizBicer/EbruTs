import '../../styles/reset.css'
import '../../styles/index.css'
import '../../styles/article-image.css'
import '../../styles/article.css'
import '../../styles/button.css'
import '../../styles/text.css'

import { tineLineSketch } from './sketch/tineLineSketch'
import { sketchManager, SketchMap } from '../../Shared/manageSketches'

const sketches: SketchMap[] = [
    {
        id: 'sketch-01',
        sketch: tineLineSketch,
    },
]

new sketchManager(sketches)