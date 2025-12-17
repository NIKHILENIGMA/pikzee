import { Plus } from 'lucide-react'
import { useState, type FC } from 'react'
import { useNavigate } from 'react-router'

import AddProjectCard from '@/features/dashboard/components/workspace/add-project-card'
import WorkspaceSetting from '@/features/dashboard/components/workspace/workspace-setting'

import type { WorkspaceDTO } from '../../types'

import ProjectCard from './project-card'

interface ProjectGridProps {
    toggleSettings: boolean
    onSettingsChange: (value: boolean) => void
    workspace: WorkspaceDTO
}

const ProjectGrid: FC<ProjectGridProps> = ({ toggleSettings, onSettingsChange, workspace }) => {
    const [open, setOpen] = useState<boolean>(false)
    const navigate = useNavigate()

    const calculateTotalStorage = (storage: number) => {
        if (storage < 1024) {
            return `${storage} MB`
        } else {
            const gb = (storage / 1024).toFixed(2)
            return `${gb} GB`
        }
    }
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* YouTube Video Project */}
            {!!workspace.projects &&
                workspace.projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        projectStatus={project.status}
                        projectName={project.name}
                        projectCover={project.projectCoverUrl || ''}
                        fileSize={calculateTotalStorage(project.storage || 0)}
                        onProjectCardClick={() => {
                            navigate(`/projects/${project.id}`)
                        }}
                    />
                ))}

            <article className="w-full h-62 rounded-xl bg-card overflow-hidden border-2 border-dashed border-border/50 hover:border-foreground/80 transition-all">
                <div className="w-full h-full flex items-center justify-center">
                    <button
                        onClick={() => setOpen(true)}
                        className="text-center cursor-pointer">
                        <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-8 w-8 text-foreground/80" />
                        </div>
                        <p className="text-foreground/80 text-base">New Project</p>
                    </button>
                </div>
            </article>

            {/* Add Project Modal */}
            <AddProjectCard
                open={open}
                setOpen={setOpen}
                triggerBtn={false}
            />

            {/* workspace settings */}
            <WorkspaceSetting
                isOpen={toggleSettings}
                onSettingsChange={onSettingsChange}
            />
        </div>
    )
}

export default ProjectGrid
