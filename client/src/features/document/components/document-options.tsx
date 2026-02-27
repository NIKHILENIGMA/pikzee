import { Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { useState, type FC } from 'react'
import { toast } from 'sonner'

import { ConfirmActionDialog } from '@/components'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useDeleteDocument, useUpdateDocument } from '../api'

interface DocumentOptionsProps {
    workspaceId: string
    documentId: string
    title: string
}

const DocumentOptions: FC<DocumentOptionsProps> = ({ workspaceId, documentId, title }) => {
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [nextTitle, setNextTitle] = useState(title)

    const updateDocumentMutation = useUpdateDocument()
    const deleteDocumentMutation = useDeleteDocument()

    const handleUpdate = async () => {
        const normalizedTitle = nextTitle.trim()
        if (!normalizedTitle) {
            return
        }

        await updateDocumentMutation.mutateAsync({
            workspaceId,
            documentId,
            title: normalizedTitle
        })

        toast.success('Document updated successfully')
        setIsUpdateDialogOpen(false)
    }

    const handleDelete = async () => {
        await deleteDocumentMutation.mutateAsync({ workspaceId, documentId })
        toast.success('Document deleted successfully')
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="px-2 py-1 rounded-sm cursor-pointer hover:bg-accent transition-colors"
                        onClick={(event) => event.stopPropagation()}>
                        <Ellipsis className="h-4 w-4" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="w-44 p-1.5">
                    <div className="flex flex-col gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                            onClick={() => setIsUpdateDialogOpen(true)}>
                            <Pencil className="w-4 h-4" /> Update
                        </Button>
                        <ConfirmActionDialog
                            title="Delete Document"
                            description="Are you sure you want to delete this document? This action cannot be undone."
                            confirmText="Delete"
                            cancelText="Cancel"
                            variant="destructive"
                            isLoading={deleteDocumentMutation.isPending}
                            onConfirm={handleDelete}
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start text-destructive hover:text-destructive">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </Button>
                            }
                        />
                    </div>
                </PopoverContent>
            </Popover>

            <Dialog
                open={isUpdateDialogOpen}
                onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Document</DialogTitle>
                        <DialogDescription>Change the title of your document.</DialogDescription>
                    </DialogHeader>

                    <Input
                        value={nextTitle}
                        onChange={(event) => setNextTitle(event.target.value)}
                        placeholder="Enter title"
                    />

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsUpdateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={!nextTitle.trim() || updateDocumentMutation.isPending}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DocumentOptions
