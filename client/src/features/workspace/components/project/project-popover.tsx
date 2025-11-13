import { Cog, Ellipsis, ShieldBan, Trash2 } from 'lucide-react'
import { type FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

import ProjectAccessDialog from '../project/project-access-dialog'

const ProjectPopover: FC = () => {
    const navigate = useNavigate()
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="px-2 py-1 rounded-sm cursor-pointer">
                    <Ellipsis />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-52 p-1.5">
                <div className="flex flex-col space-y-1.5">
                    <div className="border-b border-border pb-2.5">
                        <p className="text-sm text-start p-1.5 font-medium text-foreground/70">Project Options</p>
                    </div>
                    <ProjectAccessDialog />
                    <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="text-start hover:bg-secondary rounded-sm justify-start"
                        onClick={() => navigate('/settings/project')}>
                        <Cog /> <span>Project Settings</span>
                    </Button>
                    <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="text-start hover:bg-secondary rounded-sm justify-start"
                        onClick={() => navigate('/settings/project')}>
                        <ShieldBan /> <span>Mark Inactive</span>
                    </Button>
                    <Separator />
                    <Button
                        size={'sm'}
                        // variant={'destructive'}
                        className="w-full text-start border border-destructive/30 rounded-lg bg-destructive/20 text-foreground justify-start hover:bg-destructive hover:text-white">
                        <Trash2 /> <span className="text-start">Delete Project</span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default ProjectPopover
