import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { ReactNodeViewRenderer } from '@tiptap/react'

import CodeBlockOptions from '../components/code-block-options'

export const CodeBlockExtension = CodeBlockLowlight.extend({
    name: 'codeBlock',

    addNodeView() {
        return ReactNodeViewRenderer(CodeBlockOptions)
    }
})
