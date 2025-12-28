import { Upload } from 'lucide-react'
import { useState, type ChangeEvent, type FC, type ReactNode } from 'react'
import { toast } from 'sonner'

import { Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useUpdateProjectDetails } from '../../api/project/update-project-details'

interface ProjectSettingsProps {
    children: ReactNode
    project: {
        projectId: string
        projectName: string
        projectCoverImageUrl?: string
    }
}

const ProjectSettings: FC<ProjectSettingsProps> = ({ children, project }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [projectForm, setProjectForm] = useState({
        projectName: project.projectName,
        projectCoverImageUrl: project.projectCoverImageUrl || ''
    })
    const [error, setError] = useState<string | null>(null)
    const updateProjectDetailsMutation = useUpdateProjectDetails()

    const handleProjectFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProjectForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setProjectForm((prev) => ({
                ...prev,
                projectCoverImageUrl: url
            }))
        }
    }

    const handleSaveChange = async () => {
        try {
            await updateProjectDetailsMutation.mutateAsync({
                projectId: project.projectId,
                data: projectForm
            })

            toast.success('Project details updated successfully!')
            setOpen(false)
        } catch (error) {
            setError(`${(error as Error).message}`)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Project Settings</DialogTitle>
                    <DialogDescription>Here you can configure your project settings.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="project-name"
                            className="text-sm font-medium">
                            Name
                        </Label>
                        <Input
                            id="project-name"
                            name="projectName"
                            type="text"
                            value={projectForm.projectName}
                            onChange={handleProjectFormChange}
                            placeholder="Enter project name"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="cover-image"
                            className="text-sm text-gray-300">
                            Cover Image
                        </Label>

                        {project.projectCoverImageUrl ? (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#252836] border border-[#2f3349]">
                                <img
                                    src={projectForm.projectCoverImageUrl || '/placeholder.svg'}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    name="cover-image"
                                    className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                                    onClick={() => {
                                        setProjectForm((prev) => ({
                                            ...prev,
                                            projectCoverImageUrl: ''
                                        }))
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
                                <Input
                                    id="cover-image"
                                    name="projectCoverImageUrl"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant={'outline'}
                            size={'lg'}
                            className="w-1/3"
                            onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant={'default'}
                            size={'lg'}
                            onClick={handleSaveChange}
                            disabled={!projectForm.projectName.trim()}
                            className="w-1/3">
                            {updateProjectDetailsMutation.isPending ? (
                                <>
                                    <Loader /> Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>

                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProjectSettings
