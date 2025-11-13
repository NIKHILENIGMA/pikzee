import css from 'highlight.js/lib/languages/css.js'
import js from 'highlight.js/lib/languages/javascript.js'
import ts from 'highlight.js/lib/languages/typescript.js'
import html from 'highlight.js/lib/languages/xml.js'
import { all, createLowlight } from 'lowlight'

const lowlight = createLowlight(all)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export { lowlight as lowlightConfig }
