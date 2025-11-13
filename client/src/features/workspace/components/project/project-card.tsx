import { type FC } from 'react'

import { Badge } from '@/components/ui/badge'
import ProjectPopover from '@/features/workspace/components/project/project-popover'

interface ProjectCardProps {
    projectName: string
    projectCover: string
    fileSize: string
    projectStatus: 'Active' | 'Inactive'
    onProjectCardClick?: () => void
}

const ProjectCard: FC<ProjectCardProps> = ({ projectName, projectStatus, projectCover, fileSize = '0 MB', onProjectCardClick }) => {
    function truncateText(text: string, maxLength: number = 17): string {
        if (text.length <= maxLength) {
            return text
        }
        return text.slice(0, maxLength) + '...'
    }

    return (
        <div className="w-full h-62 rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <button
                type="button"
                className="card-content w-full h-[90%] p-1.5 rounded-lg cursor-pointer "
                onClick={onProjectCardClick}>
                {projectCover !== '' ? (
                    <div className="relative w-full h-full hover:opacity-85 transition-opacity">
                        <img
                            src={projectCover || '/placeholder.svg'}
                            alt={projectName + ' Cover'}
                            className="w-full h-full object-cover rounded-lg z-0"
                        />
                        <div className="w-full">
                            <span className="absolute bottom-2 left-2 text-white text-lg z-20 font-medium tracking-wide">
                                {truncateText(projectName)}
                            </span>
                        </div>
                        <div className="absolute top-1 left-2 h-10 z-10">
                            {projectStatus === 'Active' ? <Badge variant={'secondary'}>Active</Badge> : <Badge variant={'secondary'}>Inactive</Badge>}
                        </div>
                        {/* soft dark gradient from bottom + subtle color tint */}
                        <div className="absolute inset-0 rounded-lg pointer-events-none z-10">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/8 to-transparent mix-blend-overlay" />
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-l from-yellow-500 to-indigo-600 w-full h-full flex items-center justify-center rounded-lg">
                        <div className="relative w-full h-full hover:opacity-85 transition-opacity">
                            <div className="bg-gradient-to-t from-black/50 to-transparent w-full h-full rounded-lg" />
                            <div className="w-full">
                                <span className="absolute bottom-2 left-2 text-white text-lg z-20 font-medium tracking-wide truncate">
                                    {truncateText(projectName)}
                                </span>
                            </div>
                            <div className="absolute top-1 left-2 h-10 z-10">
                                {projectStatus === 'Active' ? (
                                    <Badge variant={'secondary'}>Active</Badge>
                                ) : (
                                    <Badge variant={'secondary'}>Inactive</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </button>
            <div className="card-footer h-[10%] flex justify-between items-center px-5 py-2 rounded-b-xl text-foreground/40">
                <span className="font-medium">{fileSize}</span>
                <ProjectPopover />
            </div>
        </div>
    )
}

export default ProjectCard
