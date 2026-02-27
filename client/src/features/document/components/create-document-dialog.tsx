import { useState, type FC, type ReactNode } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useCreateDocument } from '../api'

interface CreateDocumentDialogProps {
    children: ReactNode
    workspaceId: string
    createdBy: string
}

const CreateDocumentDialog: FC<CreateDocumentDialogProps> = ({ children, workspaceId, createdBy }) => {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')

    const createDocumentMutation = useCreateDocument()

    const handleCreate = async () => {
        const normalizedTitle = title.trim()
        if (!normalizedTitle) {
            return
        }

        await createDocumentMutation.mutateAsync({
            title: normalizedTitle,
            workspaceId,
            createdBy
        })

        toast.success('Document created successfully')
        setTitle('')
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Document</DialogTitle>
                    <DialogDescription>Give your document a clear title to get started.</DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <Label htmlFor="document-title">Title</Label>
                    <Input
                        id="document-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Enter document title"
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!title.trim() || createDocumentMutation.isPending}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDocumentDialog
