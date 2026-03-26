// src/tiptap/components/EditorRoot.tsx
import { DragHandle } from '@tiptap/extension-drag-handle-react'
import { Editor, EditorContent } from '@tiptap/react'
import { type FC } from 'react'

import { useEditorInstance } from '../hooks/use-editor-instance'

import { BubbleTools } from './bubble-tools'
// import { useDraftStore } from '@/features/drafts/store/draft.store'

interface EditorRootProps {
    value: string
    onChange: (value: string) => void
}

export const EditorRoot: FC<EditorRootProps> = ({ value, onChange }) => {
    const { editor, isActive } = useEditorInstance({
        placeholder: 'Write something awesome...',
        content: value ? (typeof value === 'string' ? JSON.parse(value) : value) : '',
        onUpdate: ({ editor }: { editor: Editor }) => {
            onChange(JSON.stringify(editor.getJSON()))
        }
    })

    // Sync editor content with draft content from context when it changes (e.g., on initial load or external updates)
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
