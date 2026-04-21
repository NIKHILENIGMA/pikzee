import { type FC } from 'react'
import { useParams } from 'react-router'
import { DragHandle } from '@tiptap/extension-drag-handle-react'
import { Editor, EditorContent } from '@tiptap/react'

import { useAutoSave } from '@/features/drafts/hooks/use-auto-save'
import { useWorkspaceContext } from '@/features/workspace'

import { BubbleTools } from './bubble-tools'
import { useEditorInstance } from '../hooks/use-editor-instance'

interface EditorRootProps {
    value: string
}

export const EditorRoot: FC<EditorRootProps> = ({ value }) => {
    const { id: workspaceId } = useWorkspaceContext()
    const { documentId, pageId } = useParams<{ documentId: string; pageId: string }>()
    const { debouncedSave } = useAutoSave(
        workspaceId,
        documentId ?? '',
        pageId ?? '',
        1800 // Auto-save every 1.8 seconds
    )
    const { editor, isActive } = useEditorInstance({
        placeholder: 'Write something awesome...',
        content: value ? (typeof value === 'string' ? JSON.parse(value) : value) : '',
        onUpdate: ({ editor }: { editor: Editor }) => {
            const jsonContent = editor.getJSON()
            const stringContent = JSON.stringify(jsonContent)
            debouncedSave({ content: stringContent })
        }
    })

    // Sync editor content with draft content from context when it changes (e.g., on initial load or external updates)
    if (!editor) return null

    return (
        <div className="bg-background w-full">
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
