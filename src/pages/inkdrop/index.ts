
import '../../styles/reset.css'
import '../../styles/index.css'
import '../../styles/article-image.css'
import '../../styles/article.css'
import '../../styles/button.css'
import '../../styles/text.css'

import { animatedDropSketch } from "./Sketch/animatedDropSketch"
import { explanatoryDropSketch } from "./Sketch/explanatoryDropSketch"
import { inkDropSketch } from "./Sketch/inkDropSketch"
import { sketchManager, SketchMap } from '../../Shared/manageSketches'


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
    }
]

new sketchManager(sketches)