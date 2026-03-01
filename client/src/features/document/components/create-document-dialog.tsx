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
}

const CreateDocumentDialog: FC<CreateDocumentDialogProps> = ({ children, workspaceId }) => {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const {
        mutateAsync: createDocumentMutation,
        isPending,
        isError
    } = useCreateDocument({
        workspaceId
    })

    const handleCreateDocument = async () => {
        const normalizedTitle = title.trim()
        if (!normalizedTitle) {
            return
        }

        try {
            await createDocumentMutation({
                title: normalizedTitle,
                workspaceId
            })
            toast.success('Document created successfully')
            setTitle('')
            setOpen(false)
        } catch (error) {
            isError && toast.error(`${error instanceof Error ? error.message : 'An unexpected error occurred.'}`)
        }
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
                        size={'default'}
                        onClick={handleCreateDocument}
                        disabled={!title.trim() || isPending}>
                        {isPending ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDocumentDialog
