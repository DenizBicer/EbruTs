
import './src/styles/reset.css'
import './src/styles/index.css'
import './src/styles/article-image.css'
import './src/styles/article.css'
import './src/styles/button.css'
import './src/styles/text.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<a href="./dist/src/pages/inkdrop/">Ink Drop Function</a>
<a href="./dist/src/pages/tineline/">Tine Line Function</a>
`