import { Plus, MoreHorizontal, Users, Settings, ArrowLeftRight } from 'lucide-react'
import { useState, type FC } from 'react'
import { useNavigate } from 'react-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import AddProjectCard from '@/features/dashboard/components/workspace/add-project-card'
import ProjectCard from '@/features/workspace/components/project/project-card'

import PROJECT_CARDS from '../../../../../mock/projects.json'

import WorkspaceSetting from './workspace-setting'

type Permission = 'FULL_ACCESS' | 'COMMENT_ONLY' | 'VIEW_ONLY' | 'EDIT'

interface WorkspaceContentProps {
    id: string
    name: string
    slug: string
    ownerId: string
    workspaceLogo: string
    members: {
        userId: string
        permission: Permission
    }[]
    projects?: {
        id: string
        title: string
        image_url: string
        size: string
    }[]
}

const WorkspaceContent: FC<WorkspaceContentProps> = (workspace) => {
    const navigate = useNavigate()
    const [open, setOpen] = useState<boolean>(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
    if (!workspace) return null

    return (
        <main className="px-6 py-8">
            {/* Workspace Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">{workspace.name}</h1>
                    {/* <p className="text-slate-400 text-sm">2 Projects (1 Inactive)</p> */}
                </div>

                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-indigo-600">
                        <AvatarFallback className="bg-indigo-600">
                            <Users className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            className="w-40">
                            <div className="flex flex-col">
                                <Button
                                    variant="ghost"
                                    className="w-full text-left"
                                    onClick={() => setIsSettingsOpen(true)}>
                                    <Settings /> Settings
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-left">
                                    <ArrowLeftRight /> Change
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* YouTube Video Project */}
                {PROJECT_CARDS.projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        projectName={project.title}
                        projectStatus="Active"
                        projectCover={project.image_url}
                        fileSize={project.size}
                        onProjectCardClick={() => {
                            navigate(`/projects`)
                        }}
                    />
                ))}

                <article
                    className="bg-card text-foreground rounded-[0.8rem] overflow-hidden shadow-md w-3/3 md:h-64 cursor-pointer"
                    onClick={() => setOpen(true)}>
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="h-8 w-8 text-foreground/80" />
                            </div>
                            <p className="text-foreground/80 text-base">New Project</p>
                        </div>
                    </div>
                </article>

                <AddProjectCard
                    open={open}
                    setOpen={setOpen}
                    triggerBtn={false}
                />

                <WorkspaceSetting
                    isOpen={isSettingsOpen}
                    onSettingsChange={setIsSettingsOpen}
                />
            </div>
        </main>
    )
}

export default WorkspaceContent
