import { BookCopy, CopyCheck, Download, MoveRight, TextCursor, Trash } from 'lucide-react'
import type { FC, ReactNode } from 'react'

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Separator } from '@/components/ui/separator'

interface AssetContextOptionsProps {
    children: ReactNode
}

const AssetContextOptions: FC<AssetContextOptionsProps> = ({ children }) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-40 p-2.5 space-y-1">
                <ContextMenuItem>
                    <Download /> Download
                </ContextMenuItem>
                <ContextMenuItem>
                    <CopyCheck /> Copy to
                </ContextMenuItem>
                <ContextMenuItem>
                    <MoveRight /> Move to
                </ContextMenuItem>
                <ContextMenuItem>
                    <BookCopy /> Duplicate
                </ContextMenuItem>
                <ContextMenuItem>
                    <TextCursor /> Rename
                </ContextMenuItem>
                <Separator className="my-2" />
                <ContextMenuItem className="text-red-800 dark:text-red-300">
                    <Trash className="text-red-800 dark:text-red-300" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default AssetContextOptions
