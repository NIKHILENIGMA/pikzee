import { useState, type FC, type ReactNode } from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Check, X } from 'lucide-react'

interface DisconnectPlatformProps {
    children: ReactNode
    title?: string
    description?: string
    onConfirm: () => void
}

const DisconnectPlatform: FC<DisconnectPlatformProps> = ({
    children,
    description,
    title = 'Are you sure you want to disconnect this platform?',
    onConfirm
}) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        <Check className="mr-2 h-4 w-4" /> Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DisconnectPlatform
