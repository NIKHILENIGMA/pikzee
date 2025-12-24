import type { Project, ProjectView } from '../../types'
import { columns } from '../columns'

import { NewProjectCard } from './new-project-card'
import ProjectCard from './project-card'
import ProjectTable from './project-table'

interface ProjectGridProps {
    projects?: Project[]
    view: ProjectView
}

export default function ProjectGrid({ projects, view }: ProjectGridProps) {
    return (
        <div className="w-full px-8">
            {view === 'GRID' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                    {projects &&
                        projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                projectCover={project.projectCoverUrl || ''}
                                projectName={project.name}
                                projectStatus={project.status}
                                fileSize="2.5 MB"
                            />
                        ))}

                    <NewProjectCard />
                </div>
            ) : (
                <div className="space-y-2 mt-8">
                    <ProjectTable<Project, unknown>
                        data={projects || []}
                        columns={columns}
                    />
                </div>
            )}
        </div>
    )
}
