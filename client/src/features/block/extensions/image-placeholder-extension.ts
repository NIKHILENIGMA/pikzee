/* eslint-disable @typescript-eslint/no-explicit-any */
import { type CommandProps, Editor, mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import ImagePlaceholder from '../components/image-placeholder'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        imagePlaceholder: {
            insertImagePlaceholder: () => ReturnType
        }
    }
}

interface ImagePlaceholderOptions {
    HTMLAttributes: Record<string, any>
    onDrop: (files: File[], editor: Editor) => void
    onDragOver: (event: DragEvent) => void
    onEmbed: (url: string, editor: Editor) => void
    allowedMimeTypes?: Record<string, string[]>
    maxFiles?: number
    maxSize?: number
}

/**
 * ImagePlaceholder extension for TipTap editor that provides drag-and-drop image upload functionality.
 *
 * This extension creates a placeholder block that allows users to upload images through
 * drag-and-drop interactions or embedding. It supports file type validation, size limits,
 * and customizable event handlers for various upload scenarios.
 *
 * @example
 * ```typescript
 * const editor = new Editor({
 *   extensions: [
 *     ImagePlaceholderExtension.configure({
 *       allowedMimeTypes: ['image/jpeg', 'image/png'],
 *       maxSize: 2 * 1024 * 1024, // 2MB
 *       onDrop: (files) => handleFileUpload(files),
 *     }),
 *   ],
 * });
 * ```
 *
 * @public
 */

export const ImagePlaceholderExtension = Node.create<ImagePlaceholderOptions>({
    name: 'image-placeholder',
    group: 'block',

    /**
     * Defines the default options for the ImagePlaceholder extension.
     *
     * @returns The default configuration object containing:
     *   - HTMLAttributes: Custom HTML attributes to apply to the image placeholder element
     *   - onDrop: Callback function triggered when files are dropped onto the placeholder
     *   - onDragOver: Callback function triggered when files are dragged over the placeholder
     *   - onEmbed: Callback function triggered when an image is embedded
     *   - allowedMimeTypes: Object defining which MIME types are permitted for upload
     *   - maxFiles: Maximum number of files that can be uploaded simultaneously (default: 1)
     *   - maxSize: Maximum file size in bytes (default: 1MB)
     */

    addOptions() {
        return {
            HTMLAttributes: {},
            onDrop: () => {},
            onDragOver: () => {},
            onEmbed: () => {},
            allowedMimeTypes: {},
            maxFiles: 1,
            maxSize: 1024 * 1024
        }
    },

    /**
     * Defines HTML parsing rules for the image placeholder extension.
     *
     * This method specifies how HTML elements should be parsed and converted
     * into the corresponding ProseMirror node. It looks for div elements with
     * a specific data-type attribute that matches the extension name.
     *
     * @returns An array of parsing rule objects that define which HTML elements
     *   should be converted to this node type. Each rule specifies the tag
     *   selector to match against.
     */
    parseHTML() {
        return [
            {
                tag: `div[data-type="${this.name}"]`
            }
        ]
    },

    /**
     * Renders the HTML representation of the image placeholder node.
     *
     * @param options - The rendering options object
     * @param options.HTMLAttributes - The HTML attributes to be merged with the rendered element
     * @returns A tuple containing the tag name and merged attributes for the HTML element
     */
    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes)]
    },

    /**
     * Adds a custom node view for the image placeholder using React renderer.
     *
     * This method returns a ReactNodeViewRenderer that wraps the ImagePlaceholder
     * component, allowing it to be rendered as a custom node view within the editor.
     *
     * @returns The React node view renderer for the ImagePlaceholder component.
     */
    addNodeView() {
        return ReactNodeViewRenderer(ImagePlaceholder)
    },

    /**
     * Adds commands for the ImagePlaceholder extension.
     *
     * @returns An object containing the insertImagePlaceholder command that allows
     *   inserting an image placeholder node into the editor content.
     */
    addCommands() {
        return {
            insertImagePlaceholder: () => (props: CommandProps) => {
                return props.commands.insertContent({
                    type: this.name
                })
            }
        }
    }
})
