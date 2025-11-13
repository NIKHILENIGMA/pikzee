// src/lib/suggestion-items.tsx
import type { Editor, Range } from '@tiptap/core'
import { Type, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Image, Minus, CheckSquare } from 'lucide-react'

interface SuggestionItem {
    title: string
    description: string
    searchTerms: string[]
    icon: React.ElementType
    command: (props: CommandExec) => void
}

interface CommandExec {
    editor: Editor
    range: Range
}

export const getSuggestionItems = (): SuggestionItem[] => [
    {
        title: 'Text',
        description: 'Just start with plain text.',
        searchTerms: ['p', 'paragraph'],
        icon: Type,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run()
        }
    },
    {
        title: 'Heading 1',
        description: 'Big section heading.',
        searchTerms: ['title', 'big', 'large', 'h1'],
        icon: Heading1,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        }
    },
    {
        title: 'Heading 2',
        description: 'Medium section heading.',
        searchTerms: ['subtitle', 'medium', 'h2'],
        icon: Heading2,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        }
    },
    {
        title: 'Heading 3',
        description: 'Small section heading.',
        searchTerms: ['subtitle', 'small', 'h3'],
        icon: Heading3,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
        }
    },
    {
        title: 'Bullet List',
        description: 'Create a simple bullet list.',
        searchTerms: ['unordered', 'point', 'ul'],
        icon: List,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
        }
    },
    {
        title: 'Numbered List',
        description: 'Create a list with numbering.',
        searchTerms: ['ordered', 'number', 'ol'],
        icon: ListOrdered,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        }
    },
    {
        title: 'Quote',
        description: 'Capture a quote.',
        searchTerms: ['blockquote', 'citation'],
        icon: Quote,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run()
        }
    },
    {
        title: 'Code Block',
        description: 'Capture a code snippet.',
        searchTerms: ['codeblock', 'code', 'pre'],
        icon: Code,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        }
    },
    {
        title: 'Image',
        description: 'Upload an image from your computer.',
        searchTerms: ['photo', 'picture', 'media', 'img'],
        icon: Image,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).run()
            // You can add image upload logic here
            const url = window.prompt('Enter image URL:')
            if (url) {
                editor.chain().focus().setImage({ src: url }).run()
            }
        }
    },
    {
        title: 'Divider',
        description: 'Visually divide blocks.',
        searchTerms: ['horizontal', 'rule', 'hr', 'line'],
        icon: Minus,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        }
    },
    {
        title: 'To-do List',
        description: 'Track tasks with a to-do list.',
        searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
        icon: CheckSquare,
        command: ({ editor, range }: CommandExec) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run()
        }
    }
]
