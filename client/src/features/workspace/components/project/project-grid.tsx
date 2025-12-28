import { Link } from 'react-router'
import { useWorkspaceContext } from '../../hooks/use-workspace-context'
import type { ProjectDTO, ProjectView } from '../../types'
import { columns } from '../columns'

import { NewProjectCard } from './new-project-card'
import ProjectCard from './project-card'
import ProjectTable from './project-table'

interface ProjectGridProps {
    view: ProjectView
}

export const ProjectGrid = ({ view }: ProjectGridProps) => {
    const { projects } = useWorkspaceContext()

    return (
        <div className="w-full px-8">
            {view === 'GRID' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
                    {projects &&
                        projects.map((project) => (
                            <Link
                                to={`/workspace/projects/${project.id}`}
                                className="block">
                                <ProjectCard
                                    key={project.id}
                                    projectId={project.id}
                                    projectCover={project.projectCoverImageUrl || ''}
                                    projectName={project.projectName}
                                    projectStatus={project.status}
                                    fileSize={project.storageUsed}
                                />
                            </Link>
                        ))}

                    <NewProjectCard />
                </div>
            ) : (
                <div className="space-y-2 mt-8">
                    <ProjectTable<ProjectDTO, unknown>
                        data={projects || []}
                        columns={columns}
                    />
                </div>
            )}
        </div>
    )
}
