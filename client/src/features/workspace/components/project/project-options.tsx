import { Cog, ShieldBan, Trash2 } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

import ProjectAccessDialog from '../project/project-access-dialog'

import type { ProjectStatus } from '../../types'
import { useUpdateProjectStatus } from '../../api/project/update-project-status'
import { useDeleteProject } from '../../api/project/delete-project'

const ProjectOptions: FC<{ children: ReactNode; projectId: string; status: ProjectStatus }> = ({ children, projectId, status }) => {
    const updateProjectStatusMutation = useUpdateProjectStatus()
    const deleteProjectMutation = useDeleteProject()

    const handleStatusChange = async () => {
        const newStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        await updateProjectStatusMutation.mutateAsync({
            projectId,
            status: newStatus
        })
    }

    const handleProjectDeletion = async (id: string) => {
        await deleteProjectMutation.mutateAsync(id)
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
                        <p className="text-sm text-start p-1.5 font-medium text-foreground/70">Project Options</p>
                    </div>
                    <ProjectAccessDialog />
                    <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="text-start hover:bg-secondary rounded-sm justify-start"
                        onClick={handleStatusChange}>
                        {status === 'ACTIVE' ? (
                            <span>
                                <Cog /> Mark Inactive
                            </span>
                        ) : (
                            <span>
                                <ShieldBan /> Mark Active
                            </span>
                        )}
                    </Button>
                    <Separator />
                    <Button
                        size={'sm'}
                        onClick={() => handleProjectDeletion(projectId)}
                        className="w-full text-start border border-destructive/30 rounded-lg bg-destructive/20 text-foreground justify-start hover:bg-destructive hover:text-white">
                        <Trash2 /> <span className="text-start">Delete Project</span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default ProjectOptions
