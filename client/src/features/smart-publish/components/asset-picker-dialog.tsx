import { useState, type FC, useEffect } from 'react'
import { Folder, FileVideo, ChevronLeft, Search, Loader2 } from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { useContent } from '@/features/assets/api/get-content'
import type { ProjectDTO } from '@/features/workspace/types'

interface AssetPickerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projects: ProjectDTO[]
    onSelect: (asset: { url: string; name: string }) => void
}

export const AssetPickerDialog: FC<AssetPickerDialogProps> = ({
    open,
    onOpenChange,
    projects,
    onSelect
}) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Reset state when dialog closes
    useEffect(() => {
        if (!open) {
            setSelectedProjectId(null)
            setCurrentFolderId(null)
            setSearchQuery('')
        }
    }, [open])

    const { data: content, isLoading } = useContent({
        projectId: selectedProjectId || '',
        folderId: currentFolderId,
        queryConfig: {
            enabled: !!selectedProjectId
        }
    })

    const handleProjectSelect = (projectId: string) => {
        setSelectedProjectId(projectId)
        setCurrentFolderId(null)
    }

    const handleFolderSelect = (folderId: string) => {
        setCurrentFolderId(folderId)
    }

    const handleBack = () => {
        if (currentFolderId) {
            // Finding parent folder is tricky with current API response structure
            // For simplicity, we go back to root if it's a subfolder
            // Better: use breadcrumbs from API response if available
            if (content?.breadcrumbs && content.breadcrumbs.length > 1) {
                setCurrentFolderId(content.breadcrumbs[content.breadcrumbs.length - 2].id)
            } else {
                setCurrentFolderId(null)
            }
        } else {
            setSelectedProjectId(null)
        }
    }

    const filteredProjects = projects.filter((p) =>
        p.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredFolders = content?.subfolders.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    const filteredAssets = content?.assets.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        a.mimeType.startsWith('video/')
    ) || []

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select from App Library</DialogTitle>
                    <DialogDescription>
                        Browse your projects and assets to select a video.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-4">
                    {(selectedProjectId || currentFolderId) && (
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 pr-4">
                    {!selectedProjectId ? (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredProjects.map((project) => (
                                <Button
                                    key={project.id}
                                    variant="outline"
                                    className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5"
                                    onClick={() => handleProjectSelect(project.id)}
                                >
                                    <Folder className="h-8 w-8 text-blue-500" />
                                    <span className="truncate w-full text-xs font-medium">
                                        {project.projectName}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    ) : isLoading ? (
                        <div className="h-full flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredFolders.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-3 px-1">Folders</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {filteredFolders.map((folder) => (
                                            <Button
                                                key={folder.id}
                                                variant="outline"
                                                className="h-12 flex items-center justify-start gap-3 px-4 hover:border-primary hover:bg-primary/5"
                                                onClick={() => handleFolderSelect(folder.id)}
                                            >
                                                <Folder className="h-5 w-5 text-blue-500 shrink-0" />
                                                <span className="truncate text-xs font-medium">
                                                    {folder.name}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {filteredAssets.length > 0 ? (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-3 px-1">Videos</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {filteredAssets.map((asset) => (
                                            <Button
                                                key={asset.id}
                                                variant="outline"
                                                className="h-12 flex items-center justify-start gap-3 px-4 hover:border-primary hover:bg-primary/5"
                                                onClick={() => onSelect({ url: asset.assetUrl || '', name: asset.name })}
                                            >
                                                <FileVideo className="h-5 w-5 text-purple-500 shrink-0" />
                                                <span className="truncate text-xs font-medium">
                                                    {asset.name}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ) : filteredFolders.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                                    <FileVideo className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                    <p className="text-sm text-muted-foreground">No videos found in this folder</p>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
