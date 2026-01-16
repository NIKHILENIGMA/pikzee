import { Ellipsis } from 'lucide-react'
import { type FC } from 'react'

import { Badge } from '@/components/ui/badge'

import ProjectOptions from './project-options'
import { GRADIENTS } from '@/shared/constants/gradients'

interface ProjectCardProps {
    projectId: string
    projectName: string
    projectCover: string
    fileSize: number
    projectStatus: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    onProjectCardClick: () => void
}

function truncateText(text: string, maxLength: number = 17): string {
    if (text.length <= maxLength) {
        return text
    }
    return text.slice(0, maxLength) + '...'
}

const calculateFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
        return `${sizeInBytes} Bytes`
    } else if (sizeInBytes < 1048576) {
        return `${(sizeInBytes / 1024).toFixed(2)} KB`
    } else if (sizeInBytes < 1073741824) {
        return `${(sizeInBytes / 1048576).toFixed(2)} MB`
    } else {
        return `${(sizeInBytes / 1073741824).toFixed(2)} GB`
    }
}

const ProjectCard: FC<ProjectCardProps> = ({ projectId, projectName, projectStatus, projectCover, fileSize = 0, onProjectCardClick }) => {
    return (
        <div className="w-full h-62 rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div
                role="button"
                tabIndex={0}
                onClick={onProjectCardClick}
                className="card-content w-full h-[90%] p-1.5 rounded-lg cursor-pointer">
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
                            {projectStatus === 'ACTIVE' ? <Badge variant={'secondary'}>Active</Badge> : <Badge variant={'secondary'}>Inactive</Badge>}
                        </div>
                        {/* soft dark gradient from bottom + subtle color tint */}
                        <div className="absolute inset-0 rounded-lg pointer-events-none z-10">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/8 to-transparent mix-blend-overlay" />
                        </div>
                    </div>
                ) : (
                    <div className={`${GRADIENTS[3].backgroundColor} w-full h-full flex items-center justify-center rounded-lg`}>
                        <div className="relative w-full h-full hover:opacity-85 transition-opacity">
                            <div className="bg-gradient-to-t from-black/50 to-transparent w-full h-full rounded-lg" />
                            <div className="w-full">
                                <span className="absolute bottom-2 left-2 text-white text-lg z-20 font-medium tracking-wide truncate">
                                    {truncateText(projectName)}
                                </span>
                            </div>
                            <div className="absolute top-1 left-2 h-10 z-10">
                                {projectStatus === 'ACTIVE' ? (
                                    <Badge variant={'secondary'}>Active</Badge>
                                ) : (
                                    <Badge variant={'secondary'}>Inactive</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="card-footer h-[10%] flex justify-between items-center px-5 py-3 rounded-b-xl text-foreground/40 z-40">
                <span className="font-medium">{calculateFileSize(fileSize)}</span>

                <ProjectOptions
                    projectId={projectId}
                    status={projectStatus}
                    projectName={projectName}
                    projectCoverImageUrl={projectCover}>
                    <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 rounded-sm cursor-pointer hover:bg-gray-700/30 transition-colors">
                        <Ellipsis />
                    </button>
                </ProjectOptions>
            </div>
        </div>
    )
}

export default ProjectCard
