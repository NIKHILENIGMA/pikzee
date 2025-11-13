// src/tiptap/hooks/useEditorInstance.ts
import { useEditor, Editor } from '@tiptap/react'
import { useMemo } from 'react'

import type { UseEditorInstanceOptions } from '../types/blocks'
import { defaultExtensions } from '../util/default-extensions'

/**
 * Custom hook that creates and manages a TipTap editor instance with default configuration.
 *
 * This hook initializes a TipTap editor with predefined extensions, styling, and event handlers.
 * It returns a memoized object containing the editor instance and utility methods for
 * interacting with the editor.
 *
 * @param opts - Optional configuration options for the editor instance
 * @param opts.content - Initial content for the editor (defaults to empty string)
 * @param opts.placeholder - Placeholder text shown when editor is empty (defaults to "Start typing…")
 * @param opts.onUpdate - Callback function called when editor content changes, receives JSON and HTML content
 *
 * @returns An object containing:
 *   - editor: The TipTap Editor instance or null if not initialized
 *   - isActive: Function to check if a specific node/mark is active with optional attributes
 *   - chain: Function that returns a chained command builder with focus applied
 *
 * @example
 * ```typescript
 * const { editor, isActive, chain } = useEditorInstance({
 *   content: '<p>Hello world</p>',
 *   placeholder: 'Enter your text here...',
 *   onUpdate: (json, html) => console.log('Content updated:', json)
 * });
 * ```
 */

export function useEditorInstance(opts?: UseEditorInstanceOptions) {
    const editor = useEditor({
        extensions: defaultExtensions, //[...defaultExtensions, ...aiExtensions]
        content: opts?.content ?? '',
        // onCreate: ({ editor }) => {
        //   editor.registerPlugin(blockIdPlugin());
        // },
        onUpdate: ({ editor }) => {
            opts?.onUpdate?.(editor.getJSON(), editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor prose max-w-none prose-p:m-0 prose-headings:mt-0 prose-headings:mb-1 focus:outline-hidden'
            }
        }
    })

    return useMemo(
        () => ({
            editor: editor as Editor | null,
            isActive: (name: string, attrs?: Record<string, unknown>) => !!editor?.isActive(name, attrs),
            chain: () => editor?.chain().focus()
        }),
        [editor]
    )
}
