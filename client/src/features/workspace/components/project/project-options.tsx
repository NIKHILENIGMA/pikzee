import { Cog, Settings2Icon, ShieldBan, Trash2 } from 'lucide-react'
import { type FC, type ReactNode } from 'react'
import { toast } from 'sonner'

import { ConfirmActionDialog } from '@/components'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

import { useDeleteProject } from '../../api/project/delete-project'
import { useUpdateProjectStatus } from '../../api/project/update-project-status'
import type { ProjectStatus } from '../../types'
import ProjectAccessDialog from '../project/project-access-dialog'

import ProjectSettings from './project-settings'

const ProjectOptions: FC<{ children: ReactNode; projectId: string; status: ProjectStatus; projectName: string; projectCoverImageUrl: string }> = ({
    children,
    projectId,
    status,
    projectName,
    projectCoverImageUrl
}) => {
    const updateProjectStatusMutation = useUpdateProjectStatus()
    const deleteProjectMutation = useDeleteProject()

    const handleStatusChange = async () => {
        const newStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        await updateProjectStatusMutation.mutateAsync({
            projectId,
            status: newStatus
        })
        toast.success(`Project marked as ${newStatus.toLowerCase()}`)
    }

    const handleProjectDeletion = async (id: string) => {
        await deleteProjectMutation.mutateAsync(id)
        toast.success('Project deleted successfully')
    }

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-52 p-1.5"
                key={projectId}>
                <div className="flex flex-col space-y-1.5">
                    <div className="border-b border-border pb-2.5">
                        <p className="text-sm text-start px-2.5 pt-0.5 font-medium text-foreground/70">Project Options</p>
                    </div>
                    <ProjectSettings project={{ projectId, projectName, projectCoverImageUrl }}>
                        <Button
                            variant={'ghost'}
                            size={'sm'}
                            className="text-start hover:bg-secondary rounded-sm justify-start gap-2">
                            <>
                                <Settings2Icon className="w-4 h-4" /> Project Settings
                            </>
                        </Button>
                    </ProjectSettings>
                    <ProjectAccessDialog />
                    <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="text-start hover:bg-secondary rounded-sm justify-start gap-2"
                        onClick={handleStatusChange}>
                        {status === 'ACTIVE' ? (
                            <>
                                <Cog className="w-4 h-4" /> Mark Inactive
                            </>
                        ) : (
                            <>
                                <ShieldBan className="w-4 h-4" /> Mark Active
                            </>
                        )}
                    </Button>
                    <Separator />
                    <ConfirmActionDialog
                        title="Delete Project"
                        description="Are you sure you want to delete this project? All the data will be permanently lost and this action cannot be undone. Please make sure you want to proceed."
                        confirmText="Delete"
                        cancelText="Cancel"
                        variant="destructive"
                        isLoading={deleteProjectMutation.isPending}
                        onConfirm={() => handleProjectDeletion(projectId)}
                        trigger={
                            <Button
                                size="default"
                                className="w-full text-start border border-destructive/30 rounded-lg bg-destructive/20 text-foreground justify-start hover:bg-destructive hover:text-white">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Project
                            </Button>
                        }
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default ProjectOptions
