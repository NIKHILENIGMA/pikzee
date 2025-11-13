import { ChevronDown, Folder, FolderOpen, Plus, File } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
// import { FcDocument } from 'react-icons/fc'
import { cn } from '@/shared/lib/utils'

type Node = {
    name: string
    folders?: Node[]
}

const folders: Node[] = [
    {
        name: 'Home',
        folders: [
            {
                name: 'Movies',
                folders: [
                    {
                        name: 'Avengers',
                        folders: [
                            { name: 'Endgame', folders: [{ name: 'timetravel.mp4' }, { name: 'finalbattle.mp4' }] },
                            { name: 'Infinity War', folders: [] }
                        ]
                    },
                    { name: 'Inception', folders: [] },
                    { name: 'Interstellar', folders: [] }
                ]
            },
            {
                name: 'Music',
                folders: [
                    { name: 'Rock', folders: [{ name: 'Classic Rock', folders: [] }] },
                    { name: 'Pop', folders: [] },
                    { name: 'Hip Hop', folders: [] }
                ]
            },
            {
                name: 'Audio',
                folders: [
                    { name: 'Podcasts', folders: [] },
                    {
                        name: 'Audiobooks',
                        folders: [
                            { name: 'Fiction', folders: [] },
                            { name: 'Non-Fiction', folders: [] }
                        ]
                    }
                ]
            },
            {
                name: 'Documents',
                folders: [
                    { name: 'Work', folders: [] },
                    { name: 'Personal', folders: [] }
                ]
            }
        ]
    }
]

export function SidebarNav() {
    return (
        <aside className="hidden w-[260px] shrink-0 border-r border-border bg-sidebar-accent text-sidebar-foreground md:block">
            <div className="flex h-14 items-center justify-between px-3">
                <div className="text-sm font-medium">Assets</div>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Add">
                    <Plus className="size-4" />
                </Button>
            </div>

            <nav className="space-y-1 px-2 pb-3">
                <ul className="ml-4 pl-3 border-l">
                    {folders.map((folder) => (
                        <Folders
                            key={folder.name}
                            folder={folder}
                        />
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

function Folders({ folder }: { folder: Node }) {
    const [isFolderOpen, setIsFolderOpen] = useState<boolean>(false)
    const hasChildrens = folder.folders && folder.folders.length > 0
    return (
        <li
            key={folder.name}
            className="my-1.5">
            <span className="flex items-center gap-1.5">
                {hasChildrens && (
                    <button onClick={() => setIsFolderOpen(!isFolderOpen)}>
                        <ChevronDown
                            className={cn('size-4', isFolderOpen ? 'rotate-[-90deg] transition-transform' : 'rotate-[0deg] transition-transform')}
                        />
                    </button>
                )}
                {hasChildrens ? (
                    isFolderOpen ? (
                        <FolderOpen className={cn(!hasChildrens && 'ml-2')} />
                    ) : (
                        <Folder className={cn(!hasChildrens && 'ml-2 transform transition-all')} />
                    )
                ) : (
                    <File className="" />
                )}{' '}
                {folder.name}
            </span>
            {isFolderOpen && folder.folders && folder.folders.length > 0 && (
                <ul className="ml-2 border-l border-border pl-3">
                    {folder.folders.map((subfolder) => (
                        <Folders
                            key={subfolder.name}
                            folder={subfolder}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
}
