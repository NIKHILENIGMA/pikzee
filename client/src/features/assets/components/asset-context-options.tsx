import { useState, type FC, type ReactNode } from 'react'
import { Download, MoveRight, TextCursor, Trash, Folder } from 'lucide-react'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from '@/components/ui/context-menu'
import { Separator } from '@/components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAsset } from '../hooks/useAsset'
import { useContent } from '../api/get-content'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AssetContextOptionsProps {
    children: ReactNode
}

const AssetContextOptions: FC<AssetContextOptionsProps> = ({ children }) => {
    const asset = useAsset()
    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const [isMoveOpen, setIsMoveOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [newName, setNewName] = useState(asset.assetName)
    
    // Fetch folders for Move dialog
    const { data: folderData } = useContent({ 
        projectId: asset.projectId, 
        folderId: null // Start from root for move
    })

    const handleRename = async () => {
        if (newName.trim() && newName !== asset.assetName) {
            await asset.rename(newName.trim())
        }
        setIsRenameOpen(false)
    }

    const handleMove = async (targetFolderId: string | null) => {
        if (targetFolderId !== asset.parentAssetId) {
            await asset.move(targetFolderId)
        }
        setIsMoveOpen(false)
    }

    const handleDelete = async () => {
        await asset.delete()
        setIsDeleteOpen(false)
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
                <ContextMenuContent className="w-40 p-2.5 space-y-1">
                    <ContextMenuItem>
                        <Download /> Download
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => setIsMoveOpen(true)}>
                        <MoveRight /> Move to
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => setIsRenameOpen(true)}>
                        <TextCursor /> Rename
                    </ContextMenuItem>
                    <Separator className="my-2" />
                    <ContextMenuItem 
                        onClick={() => setIsDeleteOpen(true)}
                        className="text-red-800 dark:text-red-300"
                    >
                        <Trash className="text-red-800 dark:text-red-300" />
                        Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            {/* Rename Dialog */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename {asset.type === 'FILE' ? 'File' : 'Folder'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
                        <Button onClick={handleRename}>Rename</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Move Dialog */}
            <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move to Folder</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-1">
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start gap-2"
                                onClick={() => handleMove(null)}
                                disabled={asset.parentAssetId === null}
                            >
                                <Folder className="h-4 w-4" /> Root
                            </Button>
                            {folderData?.subfolders
                                .filter(f => f.id !== asset.id) // Can't move into itself
                                .map((folder) => (
                                    <Button 
                                        key={folder.id}
                                        variant="ghost" 
                                        className="w-full justify-start gap-2"
                                        onClick={() => handleMove(folder.id)}
                                        disabled={asset.parentAssetId === folder.id}
                                    >
                                        <Folder className="h-4 w-4" /> {folder.name}
                                    </Button>
                                ))}
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMoveOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This {asset.type === 'FILE' ? 'file' : 'folder'} will not be retrieved once it is deleted.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default AssetContextOptions
