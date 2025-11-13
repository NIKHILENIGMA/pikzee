import { NodeViewContent, NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { Check, Ellipsis } from 'lucide-react'
import { useState, type FC } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/shared/lib/utils'

const LANGS = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'json', label: 'JSON' },
    { id: 'bash', label: 'Bash' },
    { id: 'java', label: 'Java' }
    // add more as needed
]

const CodeBlockOptions: FC<ReactNodeViewProps> = ({ node, updateAttributes }) => {
    const language = (node.attrs.language as string) || 'plaintext'
    const [isOpen, setIsOpen] = useState(false)

    return (
        <NodeViewWrapper className="relative">
            <div
                className="absolute top-0 end-2 px-2 py-1 mt-2"
                contentEditable={false}>
                <Popover
                    open={isOpen}
                    onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <button
                            onClick={() => setIsOpen((v) => !v)}
                            className="h-8 w-8 p-0 bg-transparent hover:bg-accent">
                            <Ellipsis />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-42 p-0">
                        <div className="max-h-32 p-4 text-start overflow-y-auto scrollbar">
                            <h2 className="font-semibold">Language</h2>
                            {LANGS.map((lang) => (
                                <button
                                    key={lang.id}
                                    type="button"
                                    className={cn(
                                        'flex w-full cursor-pointer text-left px-2 py-1 rounded hover:bg-accent hover:text-secondary-foreground/90 justify-between',
                                        language === lang.id && 'bg-accent font-normal'
                                    )}
                                    onClick={() => {
                                        updateAttributes({ language: lang.id })
                                        setIsOpen(false)
                                    }}
                                    aria-pressed={language === lang.id}>
                                    <span>{lang.label}</span> <span>{language === lang.id && <Check />}</span>
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <pre className="my-0 p-3 overflow-x-auto rounded-lg hljs">
                {/* IMPORTANT: let Lowlight own the <code> node */}
                <NodeViewContent className="block" />
            </pre>
        </NodeViewWrapper>
    )
}
export default CodeBlockOptions
