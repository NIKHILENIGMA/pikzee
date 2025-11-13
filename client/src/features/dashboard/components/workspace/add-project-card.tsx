import { Plus } from 'lucide-react'
import { useState, type FC } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddProjectCardProps {
    open: boolean
    triggerBtn: boolean
    setOpen: (open: boolean) => void
}

const AddProjectCard: FC<AddProjectCardProps> = ({ open, setOpen, triggerBtn }) => {
    const [projectName, setProjectName] = useState<string>('')
    const [file] = useState<File | null>(null)

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            {triggerBtn && (
                <DialogTrigger asChild>
                    <Button variant="default">
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent
                onEscapeKeyDown={() => setOpen(false)}
                onPointerDownOutside={() => setOpen(false)}
                className="min-w-[700px]">
                <DialogHeader className="h-12 p-2">
                    <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="w-full h-full flex">
                    <div className="w-1/2 h-full py-2">
                        <div className="p-2 h-full flex items-center justify-center">
                            {file ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="image"
                                    className="h-full object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-full h-full border-2 border-dashed border-border/50 rounded-md flex flex-col items-center justify-center">
                                    <span className="text-foreground/80 mb-4">Upload Project Cover Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 h-full py-2">
                        <div className="flex flex-col space-y-6 px-8">
                            <div className="flex flex-col space-y-2">
                                <Label
                                    htmlFor="project-name"
                                    className="text-sm font-medium text-foreground">
                                    Project Name
                                </Label>
                                <Input
                                    id="project-name"
                                    placeholder="Enter project name"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                            </div>
                            <Button variant={'default'}>Create Project</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddProjectCard
