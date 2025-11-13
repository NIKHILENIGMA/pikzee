import { Mark, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        aiHighlights: {
            setAIHighlight: () => ReturnType
            unsetAIHighlight: () => ReturnType
        }
    }
}

export const AIHighlightMark = Mark.create({
    name: 'aiHighlight',

    addOptions() {
        return {
            HTMLAttributes: {
                class: 'ai-highlight'
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-ai-highlight]'
            }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-ai-highlight': '',
                style: 'color: #8e51ff; padding: 2px 4px; border-radius: 4px; font-weight: 500;'
            }),
            0
        ]
    },

    addCommands() {
        return {
            setAIHighlight:
                () =>
                ({ commands }) => {
                    return commands.setMark(this.name)
                },
            unsetAIHighlight:
                () =>
                ({ commands }) => {
                    return commands.unsetMark(this.name)
                }
        }
    }
})
