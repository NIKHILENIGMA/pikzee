import { format } from 'date-fns'
import { EllipsisVertical, FileText } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import DocumentMenu from './document-menu'

import type { DocumentDTO } from '../types'
import { useDeleteDocument } from '../api'

interface DocumentCardProps {
    document: DocumentDTO
    workspaceId: string
}

export default function DocumentCard({ document, workspaceId }: DocumentCardProps) {
    const { mutateAsync: deleteDocument, isPending } = useDeleteDocument({
        workspaceId
    })

    // TODO: Add share functionality - This will likely involve opening a dialog where you can enter the email address of the person you want to share with, and then calling an API to send the invitation
    // const handleShareDocument = () => {}

    // TODO: Add rename functionality - This will likely involve opening a dialog with an input field to enter the new name, and then calling an API to update the document title
    // const handleRenameDocument = () => {}

    const handleDeleteDocument = async () => {
        try {
            await deleteDocument({
                workspaceId,
                documentId: document.id
            })
            toast.success('Document deleted successfully.')
        } catch (error) {
            toast.error('Failed to delete document. Please try again.')
            throw error
        }
    }

    return (
        <div className="group relative overflow-hidden rounded-md bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:scale-102 cursor-pointer">
            {/* Image Container - 75% of space */}
            <div className="relative h-0 pb-[120%] overflow-hidden bg-primary/5">
                {document.image ? (
                    <img
                        src={document.image}
                        alt={document.title}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <FileText className="h-32 w-32" />
                    </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Content Container - 25% of space */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card/95 to-transparent px-4 py-3">
                {/* Title */}
                <h3 className="truncate text-sm font-semibold text-foreground line-clamp-2">{document.title}</h3>

                {/* Metadata */}
                <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                    <p className="truncate">{format(document.updatedAt, 'MMM d, yyyy')}</p>
                    <p className="truncate">By {document.createdBy}</p>
                </div>
            </div>

            {/* Menu Button */}
            <DocumentMenu
                onDelete={handleDeleteDocument}
                isDeleting={isPending}>
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    className="absolute right-3 top-3">
                    <EllipsisVertical className="text-muted-foreground " />
                </Button>
            </DocumentMenu>
        </div>
    )
}
