// src/tiptap/components/EditorRoot.tsx
import { DragHandle } from '@tiptap/extension-drag-handle-react'
import { EditorContent } from '@tiptap/react'
import { useEffect, type FC } from 'react'

import { useEditorInstance } from '../hooks/use-editor-instance'

import { BubbleTools } from './bubble-tools'
// import { Node as ProseMirrorNode } from "prosemirror-model";

interface EditorRootProps {
    content?: string
    onContentChange: (content: string) => void
}

export const EditorRoot: FC<EditorRootProps> = ({ content, onContentChange }) => {
    const { editor, isActive } = useEditorInstance({
        placeholder: 'Write something awesome...',
        content // initialize editor with content if provided
    })

    // Track content changes and notify parent
    useEffect(() => {
        if (!editor) return

        const handler = () => {
            // Send content as JSON string to parent for better structure (can be parsed back to ProseMirror Node if needed)
            onContentChange(JSON.stringify(editor.getJSON()))
        }
        editor.on('update', handler)
        return () => {
            editor.off('update', handler)
        }
    }, [editor, onContentChange])

    // If the content prop changes (from parent), update the editor content
    useEffect(() => {
        if (!editor) return
        if (content) {
            try {
                const parsed = JSON.parse(content)
                editor.commands.setContent(parsed)
            } catch {
                // fallback: set as HTML if not JSON
                editor.commands.setContent(content)
            }
        }
    }, [content, editor])

    if (!editor) return null

    return (
        <div className="bg-background w-full rounded-2xl">
            {/* <Toolbar editor={editor} /> */}
            <div className="min-h-[70vh] p-6 border-none rounded-md shadow-none">
                {/* Drag handle */}

                <DragHandle editor={editor}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-grip-vertical-icon lucide-grip-vertical">
                        <circle
                            cx="9"
                            cy="12"
                            r="1"
                        />
                        <circle
                            cx="9"
                            cy="5"
                            r="1"
                        />
                        <circle
                            cx="9"
                            cy="19"
                            r="1"
                        />
                        <circle
                            cx="15"
                            cy="12"
                            r="1"
                        />
                        <circle
                            cx="15"
                            cy="5"
                            r="1"
                        />
                        <circle
                            cx="15"
                            cy="19"
                            r="1"
                        />
                    </svg>
                </DragHandle>

                <EditorContent
                    editor={editor}
                    className="border-none shadow-none"
                />
            </div>
            <BubbleTools
                editor={editor}
                active={isActive}
            />
        </div>
    )
}
