import { useState, type FC, type ReactNode } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useCreateDocument } from '../api'
import { useNavigate } from 'react-router'

interface CreateDocumentDialogProps {
    children: ReactNode
    workspaceId: string
}

interface CreateDocumentData {
    title: string
    visibility: 'private' | 'workspace' | 'public'
}

const CreateDocumentDialog: FC<CreateDocumentDialogProps> = ({ children, workspaceId }) => {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState<CreateDocumentData>({
        title: '',
        visibility: 'workspace'
    })
    const {
        mutateAsync: createDocumentMutation,
        isPending,
        isError
    } = useCreateDocument({
        workspaceId
    })

    const navigate = useNavigate()

    const handleCreateDocument = async () => {
        const normalizedTitle = formData.title.trim()
        if (!normalizedTitle) {
            return
        }

        try {
            const response = await createDocumentMutation({
                title: normalizedTitle,
                workspaceId,
                visibility: formData.visibility
            })

            navigate(`/documents/${response.id}/drafts/${response.initialDraftId}`)
            toast.success('Document created successfully')
            setFormData({
                title: '',
                visibility: 'workspace'
            })
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

                <div className="space-y-4">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label
                                htmlFor="document-title"
                                className="text-xs mb-1.5 block">
                                Title
                            </Label>
                            <Input
                                id="document-title"
                                value={formData.title}
                                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                                placeholder="e.g. Project Plan"
                                className="h-9 text-sm"
                            />
                        </div>
                        <div className="flex-0">
                            <Label
                                htmlFor="document-visibility"
                                className="text-xs mb-1.5 block">
                                Visibility
                            </Label>
                            <Select
                                value={formData.visibility}
                                onValueChange={(value: 'private' | 'workspace' | 'public') => setFormData({ ...formData, visibility: value })}>
                                <SelectTrigger className="bg-muted/50 border-border/60 h-9">
                                    <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover text-popover-foreground w-auto min-w-[160px]">
                                    <SelectItem value="private">
                                        <span className="font-medium">Private</span>
                                    </SelectItem>
                                    <SelectItem value="workspace">
                                        <span className="font-medium">Workspace</span>
                                    </SelectItem>
                                    <SelectItem value="public">
                                        <span className="font-medium">Public</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
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
                        disabled={!formData.title.trim() || isPending}>
                        {isPending ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDocumentDialog
