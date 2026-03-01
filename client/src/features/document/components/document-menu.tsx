import { Edit2, Share2, Trash2 } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface DocumentMenuProps {
    children: ReactNode
    onDelete?: () => void
    isDeleting?: boolean
}

const DocumentMenu: FC<DocumentMenuProps> = ({ children, onDelete, isDeleting }) => {
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
                    <Separator className="my-0.5" />
                    <Button
                        variant={'ghost'}
                        className=" flex items-center justify-start gap-2"
                        onClick={onDelete}
                        disabled={isDeleting}>
                        <Trash2 className="h-4 w-4" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DocumentMenu
