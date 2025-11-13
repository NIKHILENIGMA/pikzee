// src/tiptap/components/BubbleTools.tsx
import type { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/react/menus'
import { Bold, Code, Italic, Strikethrough, Underline } from 'lucide-react'
import { EditorState, NodeSelection } from 'prosemirror-state'
import React from 'react'

import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import ColorSelection from './color-selection'
import { LinkDialog } from './link-dialog'

interface BubbleToolsProps {
    editor: Editor
    active: (name: string) => boolean
}

export const BubbleTools: React.FC<BubbleToolsProps> = ({ editor, active }) => {
    if (!editor) return null

    const shouldShow = ({ editor, state }: { editor: Editor; state: EditorState }) => {
        // Check if the editor is focused then render the bubble menu
        if (!editor.isFocused) return false

        // Get the current selection
        const { from, to } = state.selection
        const isTextSelection = from !== to

        const parent = state.selection.$from.parent
        const isNodeSelection = state.selection instanceof NodeSelection

        const isImageNode = isNodeSelection && (state.selection as NodeSelection).node.type.name === 'image-placeholder'

        return parent.type.name !== 'codeBlock' && !isImageNode && isTextSelection
    }

    return (
        <BubbleMenu
            editor={editor}
            shouldShow={shouldShow}
            options={{ placement: 'bottom', offset: 8 }}
            className="p-2 border rounded-lg shadow-md bg-background border-accent">
            <div className="flex items-center gap-1 space-x-2">
                <ToggleGroup
                    type="multiple"
                    className="flex items-center gap-1">
                    <ToggleGroupItem
                        value="bold"
                        aria-label="Toggle bold"
                        onClick={() => editor.chain().focus().toggleMark('bold').run()}
                        className={`p-2 flex-1 rounded-md border-none shadow-none transition-colors ${
                            active('bold') ? 'bg-primary! text-accent!' : ''
                        }`}>
                        <Bold className="w-4 h-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="italic"
                        aria-label="Toggle italic"
                        onClick={() => editor.chain().focus().toggleMark('italic').run()}
                        className={`px-2 py-1 text-sm rounded-md ${active('italic') ? 'bg-primary! text-accent!' : ''}`}>
                        <Italic className="w-4 h-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="underline"
                        aria-label="Toggle underline"
                        onClick={() => editor.chain().focus().toggleMark('underline').run()}
                        className={`px-2 py-1 text-sm rounded-md ${active('underline') ? 'bg-primary' : ''}`}>
                        <Underline className="w-4 h-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="strike"
                        aria-label="Toggle strike"
                        onClick={() => editor.chain().focus().toggleMark('strike').run()}
                        className={editor.isActive('strike') ? 'is-active' : ''}>
                        <Strikethrough className="w-4 h-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="code"
                        aria-label="Toggle code"
                        onClick={() => editor.chain().focus().toggleMark('code').run()}
                        className={editor.isActive('code') ? 'is-active' : ''}>
                        <Code className="w-4 h-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
                <Separator
                    orientation="vertical"
                    className="h-6 border border-border"
                />
                <LinkDialog editor={editor} />
                <Separator
                    orientation="vertical"
                    className="h-6 border border-border"
                />
                <ColorSelection editor={editor} />
            </div>
        </BubbleMenu>
    )
}
