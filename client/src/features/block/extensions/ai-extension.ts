import { mergeAttributes, Node, type CommandProps } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import AIChatbar from '../components/ai-chatbar'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        aiCommands: {
            insertChatBubble: () => ReturnType
            insertAIStreamsIntoEditor: (prompt: string) => ReturnType
            acceptAIText: (htmlInput: string) => ReturnType
        }
    }
}

export const AiExtension = Node.create({
    name: 'ai-chat-extension',
    // Add your node options here

    group: 'block', // Group the node as a block
    content: 'block*', // The content of the node can be any block content
    draggable: false,

    addOptions() {
        return {
            HTMLAttributes: {
                class: 'ai-chat-extension'
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: `div[data-type="${this.name}"]` // Match the node by its data attribute
            }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': this.name })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(AIChatbar)
    },

    addCommands() {
        return {
            insertChatBubble:
                () =>
                ({ commands }: CommandProps): boolean => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            'data-type': this.name
                        }
                    })
                },

            acceptAIText:
                (htmlInput: string) =>
                ({ commands }: CommandProps): boolean => {
                    return commands.insertContent(htmlInput)
                }
        }
    }
})
