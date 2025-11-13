import type { SlashItem } from '../components/slash-menu'

export const slashCommands = (): SlashItem[] => {
    return [
        {
            label: 'Ask AI',
            hint: '%ai',
            run: (editor, range) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range) // remove the typed "/ai"
                    .insertChatBubble()
                    .run()
            }
        },
        {
            label: 'Heading 1',
            hint: 'h1',
            run: (editor, range) => {
                editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
            }
        },
        {
            label: 'Heading 2',
            hint: 'h2',
            run: (editor, range) => {
                editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
            }
        },
        {
            label: 'Heading 3',
            hint: 'h3',
            run: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
        },
        {
            label: 'Bullet List',
            hint: 'ul',
            run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
        {
            label: 'Numbered List',
            hint: 'ol',
            run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
        {
            label: 'Todo List',
            hint: 'todo',
            run: (editor, range) => editor.chain().focus().deleteRange(range).toggleTaskList().run()
        },
        {
            label: 'Quote',
            hint: '>',
            run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run()
        },
        {
            label: 'Code Block',
            hint: '```',
            run: (editor, range) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
        {
            label: 'Divider',
            hint: '---',
            run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
        {
            label: 'Add Image',
            hint: '<image_url>',
            run: (editor, range) => editor.chain().focus().deleteRange(range).insertImagePlaceholder().run()
        }
    ]
}
