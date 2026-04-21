import { Folder, ChevronRight, ChevronDown, Plus, Loader2 } from 'lucide-react'
import { useState, type FC } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useContent } from '../api/get-content'
import { cn } from '@/shared/lib/utils'

interface FolderTreeItemProps {
    projectId: string
    folderId: string | null
    name: string
    level: number
}

const FolderTreeItem: FC<FolderTreeItemProps> = ({ projectId, folderId, name, level }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const activeFolderId = searchParams.get('folderId')

    const { data, isPending } = useContent({
        projectId,
        folderId,
        queryConfig: {
            enabled: isOpen
        }
    })

    const isSelected = activeFolderId === folderId || (!activeFolderId && folderId === null)

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
    }

    const handleSelect = () => {
        if (folderId) {
            setSearchParams({ folderId })
        } else {
            setSearchParams({})
        }
    }

    return (
        <div className="flex flex-col">
            <div
                onClick={handleSelect}
                className={cn(
                    "flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent/50 rounded-sm group text-sm transition-colors",
                    isSelected && "bg-accent text-accent-foreground font-medium",
                    level === 0 && !folderId && "font-semibold mb-1"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                <div 
                    onClick={handleToggle}
                    className="p-0.5 hover:bg-accent rounded-sm transition-colors"
                >
                    {isOpen ? (
                        <ChevronDown size={14} className="text-muted-foreground" />
                    ) : (
                        <ChevronRight size={14} className="text-muted-foreground" />
                    )}
                </div>
                <Folder size={16} className={cn("shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className="truncate">{name}</span>
            </div>

            {isOpen && (
                <div className="flex flex-col">
                    {isPending ? (
                        <div className="flex items-center gap-2 py-1 px-4 text-xs text-muted-foreground" style={{ paddingLeft: `${(level + 1) * 12 + 24}px` }}>
                            <Loader2 size={12} className="animate-spin" />
                            Loading...
                        </div>
                    ) : (
                        data?.subfolders.map((subfolder) => (
                            <FolderTreeItem
                                key={subfolder.id}
                                projectId={projectId}
                                folderId={subfolder.id}
                                name={subfolder.name}
                                level={level + 1}
                            />
                        ))
                    )}
                    {!isPending && data?.subfolders.length === 0 && (
                         <div className="py-1 px-4 text-xs text-muted-foreground italic" style={{ paddingLeft: `${(level + 1) * 12 + 24}px` }}>
                            No folders
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const AssetSidebar: FC = () => {
    const { projectId } = useParams<{ projectId: string }>()

    if (!projectId) return null

    return (
        <aside
            className={cn(
                'sticky w-64 h-full border-r border-secondary overflow-y-auto flex flex-col transition-all ease-in-out bg-card/30',
                'relative'
            )}>
            <div className="p-4 border-b border-secondary">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-foreground tracking-tight">Assets</h2>
                    <button className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground">
                        <Plus size={16} />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 py-4 overflow-x-hidden">
                <FolderTreeItem 
                    projectId={projectId}
                    folderId={null}
                    name="All Assets"
                    level={0}
                />
            </div>
        </aside>
    )
}

export default AssetSidebar
