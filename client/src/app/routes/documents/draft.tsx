import { ChevronLeft } from 'lucide-react'
import { useState, type FC } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EditorRoot } from '@/features/block/components/editor-root'

interface DraftPageProps {
    isSidebarOpen: boolean
    onSidebarToggle: (open: boolean) => void
}

interface DraftPageState {
    title: string
    content: string
    icon: string | null
    coverImageUrl: string | null
}

const DraftPage: FC<DraftPageProps> = ({ isSidebarOpen, onSidebarToggle }) => {
    const [draft, setDraft] = useState<DraftPageState>({
        title: 'Untitled',
        content: '',
        icon: null,
        coverImageUrl: null
    })
    return (
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
            {/* Scrollable Content Section (includes gradient header) */}
            <div className="flex-1 bg-background/70 relative overflow-y-auto minimal-scrollbar">
                {/* Top Gradient Header */}
                <div className="h-64 relative">
                    {!isSidebarOpen && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 left-4 h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10"
                            onClick={() => onSidebarToggle(true)}>
                            <ChevronLeft className="h-4 w-4 rotate-180" />
                        </Button>
                    )}
                </div>
                <div className="flex flex-col items-start px-6 md:px-12 lg:px-24 max-w-4xl mx-auto pt-8">
                    {/* Emoji Icon */}
                    <div
                        className="w-16 h-16 bg-card rounded-full flex items-center justify-center text-5xl mb-4"
                        style={{ marginLeft: '-1.5rem' }}>
                        {draft.icon !== null ? draft.icon : ''}
                    </div>

                    {/* Title */}
                    <h1
                        className="w-full text-4xl md:text-5xl font-bold text-foreground mb-6 border-none  p-2"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onInput={(e) => setDraft((prev) => ({ ...prev, title: (e.target as HTMLHeadingElement).innerText }))}>
                        {draft.title}
                    </h1>

                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-8">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg?height=24&width=24" />
                            <AvatarFallback className="bg-blue-600 text-white text-xs">AS</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-400">Abhay Sharma</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">Last updated Today at 8:49 pm</span>
                    </div>

                    {/* Editor Input */}
                    <EditorRoot />
                </div>
            </div>
        </div>
    )
}

export default DraftPage
