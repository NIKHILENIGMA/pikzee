import { File, Folder, FolderPlus } from 'lucide-react'
import type { FC, ReactNode } from 'react'

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Separator } from '@/components/ui/separator'

interface AssetGridContextProps {
    children: ReactNode
}

const AssetGridContext: FC<AssetGridContextProps> = ({ children }) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-40 p-2.5 space-y-1">
                <ContextMenuItem>
                    <File /> <span>Upload File</span>
                </ContextMenuItem>
                <ContextMenuItem>
                    <Folder /> <span>Upload Folder</span>
                </ContextMenuItem>

                <Separator className='my-2'/>
                <ContextMenuItem>
                    <FolderPlus /> <span>Create Folder</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default AssetGridContext
