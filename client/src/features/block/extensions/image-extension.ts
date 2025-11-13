import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'

import CustomizedImage from '../components/customized-image'

export const ImageExtension = Image.extend({
    addAttributes() {
        return {
            src: {
                default: null
            },
            alt: {
                default: null
            },
            title: {
                default: null
            },
            width: {
                default: '100%'
            },
            height: {
                default: null
            },
            align: {
                default: 'center'
            }
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(CustomizedImage)
    }
})
