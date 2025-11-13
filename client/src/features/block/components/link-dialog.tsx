import type { Editor } from '@tiptap/core'
import { Link } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent, type FC } from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/shared/lib/utils'

interface LinkDialogProps {
    editor: Editor
}

interface LinkData {
    text: string
    url: string
}

function getTheSelectedText(editor: Editor): string {
    const { from, to } = editor.state.selection
    return editor.state.doc.textBetween(from, to, ' ')
}

const linkSchema = z.object({
    url: z.url('Invalid URL format')
})

/**
 * A dialog component for creating and editing links in a TipTap editor.
 *
 * This component provides a popover interface that allows users to:
 * - Set link text (anchor name)
 * - Set link URL
 * - Create links from selected text or insert new linked text
 *
 * The dialog automatically captures the current editor selection when opened
 * and restores it when applying the link. It supports both creating links from
 * existing selected text and inserting new text with links.
 *
 * @example
 * ```tsx
 * <LinkDialog editor={tiptapEditor} />
 * ```
 *
 * @param props - The component props
 * @param props.editor - The TipTap editor instance used for text manipulation and link creation
 * @returns A popover component with form inputs for link creation
 */
export const LinkDialog: FC<LinkDialogProps> = ({ editor }) => {
    const [linkData, setLinkData] = useState<LinkData>({
        text: getTheSelectedText(editor),
        url: ''
    })
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const modelRef = useRef<HTMLDivElement | null>(null)
    const savedRange = useRef<{ from: number; to: number } | null>(null)

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setLinkData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDialog = () => {
        const { from, to } = editor.state.selection
        savedRange.current = { from, to }

        setLinkData((prev) => ({
            ...prev,
            text: editor.state.doc.textBetween(from, to, ' ')
        }))

        setIsOpen(true)
    }

    // Function to validate the link
    const isValidLink = (url: string): boolean => {
        try {
            linkSchema.parse({ url })
            return true
        } catch {
            return false
        }
    }

    // Function to handle setting the link
    const handleSetLink = () => {
        if (!linkData.url && !linkData.text) return

        // Validate URL first
        if (!isValidLink(linkData.url)) {
            setError('Invalid URL format')
            return
        } else {
            setError(null)
        }

        // Restore the selection if stored
        if (savedRange.current) {
            editor.commands.setTextSelection(savedRange.current)
        }

        // Check selection from and to are not equal (declare only once)
        const hasSelection = editor.state.selection.from !== editor.state.selection.to

        // Focus the editor
        editor.chain().focus()

        if (!hasSelection && linkData.text) {
            // If no selection, insert the text as a link
            editor.chain().insertContent(linkData.text).run()

            // Select the inserted text
            const { from } = editor.state.selection
            editor.commands.setTextSelection({
                from: from - linkData.text.length,
                to: from
            })

            editor
                .chain()
                .extendMarkRange('link')
                .setLink({
                    href: linkData.url,
                    target: '_blank',
                    rel: 'noopener noreferrer'
                })
                .run()

            setIsOpen(false)
            return
        }

        editor
            .chain()
            .focus()
            .insertContentAt(editor.state.selection, {
                type: 'text',
                text: linkData.text,
                marks: [{ type: 'link', attrs: { href: linkData.url } }]
            })
            .run()
        setIsOpen(false)
        if (!linkData.url && !linkData.text) return

        // Validate URL first
        if (!isValidLink(linkData.url)) {
            setError('Invalid URL format')
            return
        } else {
            setError(null)
        }

        // Restore the selection if stored
        if (savedRange.current) {
            editor.commands.setTextSelection(savedRange.current)
        }

        // Check selection from and to are not equal
        // removed duplicate declaration

        // Focus the editor
        editor.chain().focus()

        if (!hasSelection && linkData.text) {
            // If no selection, insert the text as a link
            editor.chain().insertContent(linkData.text).run()

            // Select the inserted text
            const { from } = editor.state.selection
            editor.commands.setTextSelection({
                from: from - linkData.text.length,
                to: from
            })

            editor
                .chain()
                .extendMarkRange('link')
                .setLink({
                    href: linkData.url,
                    target: '_blank',
                    rel: 'noopener noreferrer'
                })
                .run()

            setIsOpen(false)
            return
        }

        editor
            .chain()
            .focus()
            .insertContentAt(editor.state.selection, {
                type: 'text',
                text: linkData.text,
                marks: [{ type: 'link', attrs: { href: linkData.url } }]
            })
            .run()
        setIsOpen(false)
    }

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        const handleOutsideClick = (event: MouseEvent) => {
            if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    return (
        <Popover
            onOpenChange={(open) => {
                if (open) {
                    handleDialog()
                } else {
                    setIsOpen(false)
                }
            }}
            open={isOpen}>
            <PopoverTrigger
                className="flex space-x-2 border-none bg-none hover:bg-transparent"
                onMouseDown={(e) => {
                    e.preventDefault() // keeps editor selection intact
                    setIsOpen(true)
                }}>
                <Link /> <span>Link</span>
            </PopoverTrigger>
            <PopoverContent
                ref={modelRef}
                className="p-4 mt-5 w-80">
                <div className="flex flex-col w-full p-4">
                    <div className="flex flex-col">
                        <Label htmlFor="link-text">Anchor name</Label>
                        <Input
                            id="link-text"
                            name="text"
                            type="text"
                            autoComplete="off"
                            value={linkData?.text}
                            onChange={(e) => handleOnChange(e)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <Label htmlFor="link-url">URL</Label>
                        <Input
                            type="text"
                            id="link-url"
                            name="url"
                            autoComplete="off"
                            value={linkData.url}
                            onChange={(e) => handleOnChange(e)}
                            className={cn(error && 'border-red-500')}
                        />
                    </div>
                    {error && <span className="p-1 my-2 text-red-500">{error}</span>}

                    <Button
                        type="button"
                        className="mt-2"
                        onClick={handleSetLink}>
                        <Link className="mr-2" /> Create Link
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
