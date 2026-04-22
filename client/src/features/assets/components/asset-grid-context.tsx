import { createContext, useContext, useRef, useState, type FC, type ReactNode } from 'react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { File, FolderPlus } from 'lucide-react'

interface AssetGridContextType {
    handleCreateFolder: () => void
    handleUploadFile: () => void
}

const GridContext = createContext<AssetGridContextType | null>(null)

export const useAssetGridContext = () => {
    const context = useContext(GridContext)
    if (!context) {
        throw new Error('useAssetGridContext must be used within an AssetGridContext provider')
    }
    return context
}

interface AssetGridContextProps {
    children: ReactNode
    onCreateFolder?: (folderName: string) => Promise<void> | void
    onUploadFile?: () => void
}

const AssetGridContext: FC<AssetGridContextProps> = ({ children, onCreateFolder, onUploadFile }) => {
    const [open, setOpen] = useState(false)
    const [folderName, setFolderName] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleCreateFolder = () => {
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    const handleConfirmCreate = async () => {
        if (folderName.trim()) {
            await onCreateFolder?.(folderName.trim())
            setFolderName('')
            setOpen(false)
        }
    }

    const handleUploadFile = () => {
        onUploadFile?.()
    }

    return (
        <GridContext.Provider value={{ handleCreateFolder, handleUploadFile }}>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
                <ContextMenuContent className="w-40 p-2.5 space-y-1">
                    <ContextMenuItem onSelect={handleUploadFile}>
                        <File /> <span>Upload File</span>
                    </ContextMenuItem>
                    <Separator className="my-2" />
                    <ContextMenuItem onSelect={handleCreateFolder}>
                        <FolderPlus /> <span>Create Folder</span>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Folder</DialogTitle>
                    </DialogHeader>
                    <Input
                        ref={inputRef}
                        placeholder="Folder name"
                        value={folderName}
                        onChange={e => setFolderName(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleConfirmCreate()
                        }}
                    />
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmCreate} disabled={!folderName.trim()}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </GridContext.Provider>
    )
}

export default AssetGridContext
