import { type FC, type ReactNode } from 'react'
import { Building } from 'lucide-react'
import { toast } from 'sonner'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useWorkspaces } from '../api/get-workspaces'
import { useSwitchWorkspace } from '../api/switch-workspace'
import { useWorkspaceContext } from '../hooks/use-workspace-context'

const Switcher: FC<{ children: ReactNode }> = ({ children }) => {
    const { id } = useWorkspaceContext()
    const workspacesQuery = useWorkspaces()
    const workspaces = workspacesQuery.data?.data || []

    const switchWorkspaceMutation = useSwitchWorkspace({
        mutationConfig: {
            onSuccess: () => {
                toast.success('Switched workspace successfully!')
            }
        }
    })

    const handleWorkspaceSwitch = (id: string) => {
        console.log('Switching to workspace ID:', id)
        switchWorkspaceMutation.mutate(id)
    }

    return (
        <div className="text-md text-muted-foreground pt-1.5">
            <Popover>
                <PopoverTrigger asChild>{children}</PopoverTrigger>
                <PopoverContent
                    side="bottom"
                    className="md:mr-56 mt-2">
                    <span className="text-sm font-medium text-foreground/70 mb-2 block">Your Workspaces</span>
                    {!!workspaces &&
                        workspaces.map((workspace) => (
                            <div
                                key={workspace.id}
                                className="flex justify-start space-x-1.5 p-2 items-center hover:bg-accent rounded-md cursor-pointer">
                                <button
                                    className="w-full flex justify-start space-x-1.5"
                                    onClick={() => handleWorkspaceSwitch(workspace.id)}>
                                    {workspace.logoUrl !== null ? (
                                        <img
                                            src={workspace.logoUrl}
                                            alt={`${workspace.name} logo`}
                                            className="w-5.5 h-5.5 object-cover rounded-sm"
                                        />
                                    ) : (
                                        <Building className="w-5.5 h-5.5" />
                                    )}
                                    <div className="flex items-center">
                                        <span className="text-md">{workspace.name}</span>
                                        <span>{workspace.id === id ? <span className="text-xs text-green-500 ml-1">(Current)</span> : null}</span>
                                    </div>
                                </button>
                            </div>
                        ))}
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default Switcher
