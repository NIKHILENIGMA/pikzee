import { useUser } from '@clerk/clerk-react'
import { Plus, Users } from 'lucide-react'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import MembersDialog from './members-dialog'
import { CreateProjectDialog } from './project/create-project-dialog'
import { useWorkspaceContext } from '../hooks/useWorkspaceContext'

export function Header() {
    const { user } = useUser()
    const { id, name, logoUrl } = useWorkspaceContext()

    return (
        <header className="border-b border-border bg-background flex-shrink-0">
            {/* Account header */}
            <div className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 bg-orange-500 text-white font-semibold flex items-center justify-center">
                        {logoUrl !== null ? (
                            <img
                                src={logoUrl}
                                alt={`${name} logo`}
                                className="w-12 h-12 object-cover rounded-full"
                            />
                        ) : (
                            <div className="text-xl">{name ? name.charAt(0).toUpperCase() : user?.firstName?.charAt(0).toUpperCase()}</div>
                        )}
                    </Avatar>
                    <h1 className="text-2xl font-semibold text-foreground">{name}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <MembersDialog>
                        <Button
                            variant="ghost"
                            size="icon">
                            <Users className="h-5 w-5" />
                        </Button>
                    </MembersDialog>

                    <CreateProjectDialog>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            New Project
                        </Button>
                    </CreateProjectDialog>
                </div>
            </div>
        </header>
    )
}
