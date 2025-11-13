// src/tiptap/components/SlashMenu.tsx
import type { Editor, Range } from '@tiptap/core'
import React, { useRef } from 'react'

export type SlashItem = {
    label: string
    hint?: string
    run: (editor: Editor, range: Range) => void
}

export interface SlashMenuProps {
    items: SlashItem[]
    selectedIndex: number
    editor: Editor
    range: Range
}

export const SlashMenu: React.FC<SlashMenuProps> = ({ items, selectedIndex, editor, range }) => {
    const ref = useRef<HTMLDivElement>(null)

    if (!items.length) return null

    return (
        <div
            ref={ref}
            className="p-2 overflow-y-auto text-sm shadow-lg rounded-sm bg-secondary w-72 max-h-60 minimal-scrollbar">
            {items.map((it, i) => (
                <button
                    key={i}
                    onMouseDown={(e) => {
                        e.preventDefault()
                        it.run(editor, range)
                    }}
                    className={[
                        'w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left',
                        i === selectedIndex ? 'bg-accent' : 'hover:bg-accent/80'
                    ].join(' ')}>
                    <span className="font-medium">{it.label}</span>
                    {it.hint && <span className="text-secondary-foreground">{it.hint}</span>}
                </button>
            ))}
        </div>
    )
}
