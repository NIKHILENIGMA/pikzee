// src/lib/content.ts
export const defaultEditorContent = {
    type: 'doc',
    content: [
        {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'My Custom Editor' }]
        },
        {
            type: 'paragraph',
            content: [
                { type: 'text', text: 'Start typing here... Press ' },
                { type: 'text', marks: [{ type: 'code' }], text: '/' },
                { type: 'text', text: ' for commands.' }
            ]
        }
    ]
}
