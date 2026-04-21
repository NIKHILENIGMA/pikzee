import { format } from 'date-fns'
import { EllipsisVertical, FileText, Lock, Share2, ShieldHalf } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import DocumentMenu from './document-menu'

import type { DocumentDTO } from '../types'
import { useArchiveDocument } from '../api/archive-document'

interface DocumentCardProps {
    document: DocumentDTO
    workspaceId: string
    onDocumentClick: () => void
}

export default function DocumentCard({ document, workspaceId, onDocumentClick }: DocumentCardProps) {
    const {
        mutateAsync: archiveDocument,
        isPending,
        isError
    } = useArchiveDocument({
        workspaceId
    })

    // TODO: Add share functionality - This will likely involve opening a dialog where you can enter the email address of the person you want to share with, and then calling an API to send the invitation
    // const handleShareDocument = () => {}

    // TODO: Add rename functionality - This will likely involve opening a dialog with an input field to enter the new name, and then calling an API to update the document title
    // const handleRenameDocument = () => {}

    const handleArchiveDocument = async () => {
        try {
            await archiveDocument({
                workspaceId,
                documentId: document.id
            })
            toast.success('Document archived successfully.')
        } catch (error) {
            toast.error(isError ? `${(error as Error).message}` : 'Failed to archive document.')
            throw error
        }
    }

    return (
        <div 
            className="group relative overflow-hidden rounded-md bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:scale-102 cursor-pointer"
            onClick={onDocumentClick}
        >
            {/* Image Container - 75% of space */}
            <div className="relative h-0 pb-[120%] overflow-hidden bg-primary/5">
                {document.docImgUrl ? (
                    <img
                        src={document.docImgUrl}
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
                <div className="absolute top-4 left-2.5">
                    {document.permission === 'private' ? (
                        <div className="text-sm text-muted-foreground/70 flex items-center space-x-1.5 bg-secondary px-1.5 py-0.5 rounded-sm">
                            <Lock /> <span>private</span>
                        </div>
                    ) : document.permission === 'workspace' ? (
                        <div className="text-sm text-muted-foreground/70 flex items-center space-x-1.5 bg-secondary px-1.5 py-0.5 rounded-sm">
                            <Share2 /> <span>public</span>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground/70 flex items-center space-x-1.5 bg-secondary px-1.5 py-0.5 rounded-sm">
                            <ShieldHalf /> <span>workspace</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Container - 25% of space */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card/95 to-transparent px-4 py-3"
            >
                {/* Title */}
                <h3 className="truncate text-sm font-semibold text-foreground line-clamp-2">{document.title}</h3>

                {/* Metadata */}
                <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                    <p className="truncate">{format(document.updatedAt, 'MMM d, yyyy')}</p>
                    <p className="truncate">By {document.createdBy}</p>
                </div>
            </div>

            {/* Menu Button */}
            <div onClick={(e) => e.stopPropagation()}>
                <DocumentMenu
                    onArchive={handleArchiveDocument}
                    isArchive={isPending}>
                    <Button
                        variant={'ghost'}
                        size={'icon'}
                        className="absolute right-3 top-3">
                        <EllipsisVertical className="text-muted-foreground " />
                    </Button>
                </DocumentMenu>
            </div>
        </div>
    )
}
