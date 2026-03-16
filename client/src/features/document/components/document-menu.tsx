import { Edit2, LockKeyholeOpen, Share2, Trash2 } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface DocumentMenuProps {
    children: ReactNode
    onArchive?: () => void
    isArchive?: boolean
}

const DocumentMenu: FC<DocumentMenuProps> = ({ children, onArchive, isArchive }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-40 p-2">
                <div className="flex flex-col">
                    <Button
                        variant={'ghost'}
                        className=" flex items-center justify-start gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                    <Button
                        variant={'ghost'}
                        className=" flex items-center justify-start gap-2">
                        <Edit2 className="h-4 w-4" />
                        Rename
                    </Button>
                    <Button
                        variant={'ghost'}
                        className=" flex items-center justify-start gap-2">
                        <LockKeyholeOpen className="h-4 w-4" />
                        Visibility
                    </Button>
                    <Separator className="my-0.5" />
                    <Button
                        variant={'ghost'}
                        className=" flex items-center justify-start gap-2"
                        onClick={onArchive}
                        disabled={isArchive}>
                        <Trash2 className="h-4 w-4" />
                        {isArchive ? 'Archiving...' : 'Archive'}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DocumentMenu
