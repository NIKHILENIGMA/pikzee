import { Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useCreateProject } from '../../api/project/create-project'
import { useWorkspaceContext } from '../../hooks/use-workspace-context'

interface CreateProjectDialogProps {
    children: React.ReactNode
}

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [createProjectData, setCreateProjectData] = useState<{
        title: string
        coverImage: File | null
        previewUrl: string
    }>({
        title: '',
        coverImage: null,
        previewUrl: ''
    })
    const [error, setError] = useState<string | null>(null)

    const { id } = useWorkspaceContext()
    const createProjectMutation = useCreateProject()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setCreateProjectData({
                ...createProjectData,
                coverImage: file
            })
            const url = URL.createObjectURL(file)
            setCreateProjectData({
                ...createProjectData,
                previewUrl: url
            })
        }
    }

    const handleCreateProject = async () => {
        try {
            await createProjectMutation.mutateAsync({
                projectName: createProjectData.title,
                workspaceId: id,
                projectCoverImageUrl: createProjectData.previewUrl || undefined
            })

            setOpen(false)
            setCreateProjectData({
                title: '',
                coverImage: null,
                previewUrl: ''
            })

            toast.success('Project created successfully')
        } catch (error) {
            setError(`${(error as Error).message}`)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-background border-border text-foreground max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Create New Project</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new project.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Project Title */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="title"
                            className="text-sm text-gray-300">
                            Project Title
                        </Label>
                        <Input
                            id="title"
                            value={createProjectData?.title || ''}
                            onChange={(e) =>
                                setCreateProjectData({
                                    ...createProjectData,
                                    title: e.target.value
                                })
                            }
                            placeholder="Enter project title"
                            className="bg-background border-border"
                        />
                    </div>

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="cover-image"
                            className="text-sm text-gray-300">
                            Cover Image
                        </Label>

                        {createProjectData?.previewUrl ? (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#252836] border border-[#2f3349]">
                                <img
                                    src={createProjectData?.previewUrl || '/placeholder.svg'}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                                    onClick={() => {
                                        setCreateProjectData({
                                            ...createProjectData,
                                            coverImage: null,
                                            previewUrl: ''
                                        })
                                    }}>
                                    Change
                                </Button>
                            </div>
                        ) : (
                            <label
                                htmlFor="cover-image"
                                className="flex flex-col items-center justify-center aspect-video w-full rounded-lg border-2 border-dashed border-[#2f3349] hover:border-indigo-600/50 cursor-pointer transition-colors bg-[#252836]">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-[#1a1d29] flex items-center justify-center">
                                        <Upload className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-300">Click to upload cover image</p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                    </div>
                                </div>
                                <input
                                    id="cover-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />
                            </label>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1 border-[#2f3349] text-gray-300 hover:bg-[#252836] hover:text-white">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateProject}
                            disabled={!createProjectData?.title}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                            Create Project
                        </Button>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
            </DialogContent>
        </Dialog>
    )
}
