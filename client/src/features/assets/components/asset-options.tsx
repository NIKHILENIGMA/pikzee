import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { File, Folder, FolderPlus } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

interface AssetOptionsProps {
    children: ReactNode
}

const AssetOptions: FC<AssetOptionsProps> = ({ children }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-48 p-2">
                <div className="flex flex-col">
                    <Button
                        variant={'ghost'}
                        className=" flex items-center justify-start gap-2">
                        <File /> <span>Upload File</span>
                    </Button>
                    <Button
                        variant={'ghost'}
                        className=" flex items-center justify-start gap-2">
                        <Folder /> <span>Upload Folder</span>
                    </Button>
                    <Separator />
                    <Button
                        variant={'ghost'}
                        className=" flex items-center justify-start gap-2">
                        <FolderPlus /> <span>Create Folder</span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default AssetOptions
