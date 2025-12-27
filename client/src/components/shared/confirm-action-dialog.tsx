import type { FC, ReactNode } from 'react'

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

import Loader from '../loader/loader' // Your custom loader

interface ConfirmActionDialogProps {
    trigger: ReactNode
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    isLoading?: boolean
    variant?: 'default' | 'destructive'
}

const ConfirmActionDialog: FC<ConfirmActionDialogProps> = ({
    trigger,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    isLoading = false,
    variant = 'destructive'
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            onConfirm()
                        }}
                        disabled={isLoading}
                        className={variant === 'destructive' ? 'bg-destructive text-white hover:bg-destructive/90' : ''}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader
                                    size="xs"
                                    color="border-white"
                                />
                                Processing...
                            </div>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmActionDialog
