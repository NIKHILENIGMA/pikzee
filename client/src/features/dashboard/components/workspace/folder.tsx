import { MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

// Mock types for demonstration
const useFileManager = () => ({
    navigateToFolder: (id: string) => {
        return id
    },
    deleteItem: (id: string) => {
        return id
    }
})
// const WindowsFolderProps = {} // Mock props type

interface FolderProps {
    id: string
    title: string
    items?: number
    preview?: string[]
    locked?: boolean
}

export function Folder({ id, title }: FolderProps) {
    const { navigateToFolder, deleteItem } = useFileManager()
    const [showMenu, setShowMenu] = useState(false)

    const handleClick = () => {
        navigateToFolder(id)
    }

    return (
        <div className="relative group">
            {/* Main folder container */}
            <div
                onClick={handleClick}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95">
                {/* Folder tab (top-left corner) */}
                <div className="relative">
                    <div className="absolute -top-6 left-0 w-24 h-6 bg-accent rounded-t-lg border-2 border-accent shadow-sm" />

                    {/* Main folder body */}
                    <div className="bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg border-2 border-blue-600 shadow-lg p-8 pt-12 min-h-32 flex flex-col items-center justify-center relative overflow-hidden group-hover:shadow-xl transition-shadow">
                        {/* Folder shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                        {/* Folder icon (large) */}
                        <svg
                            className="w-16 h-16 text-white mb-3 relative z-10"
                            fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                        </svg>

                        {/* Folder name */}
                        <p className="text-white font-semibold text-center text-sm break-words max-w-24 relative z-10">{title}</p>
                    </div>
                </div>
            </div>

            {/* Delete button - appears on hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(!showMenu)
                    }}
                    className="bg-white/90 hover:bg-white shadow-md">
                    <MoreVertical className="w-4 h-4" />
                </Button>
                {showMenu && (
                    <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-lg shadow-lg z-30">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteItem(id)
                                setShowMenu(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
