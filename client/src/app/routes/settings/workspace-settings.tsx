import { Edit2, Save, X, Trash2, Shield, LogOut, Building2Icon } from 'lucide-react'
import { type FC, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useDefaultWorkspace } from '@/features'

const members = [
    {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'Admin',
        avatar: 'JD',
        isCurrentUser: true
    },
    {
        id: 2,
        name: 'Mark Kim',
        email: 'mark@example.com',
        role: 'Member',
        avatar: 'MK',
        isCurrentUser: false
    },
    {
        id: 3,
        name: 'Asha Singh',
        email: 'asha@example.com',
        role: 'Viewer',
        avatar: 'AS',
        isCurrentUser: false
    }
]

const WorkspaceSettings: FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [workspaceDetails, setWorkspaceDetails] = useState({
        name: '',
        logoUrl: ''
    })

    const workspaceQuery = useDefaultWorkspace({
        queryConfig: {
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 15 * 60 * 1000 // 15 minutes
        }
    })
    const workspaceData = workspaceQuery.data?.data

    useEffect(() => {
        if (!workspaceData) return

        setWorkspaceDetails({
            name: workspaceData.name,
            logoUrl: workspaceData.logoUrl || ''
        })
    }, [workspaceData])

    if (workspaceQuery.isPending) {
        return <div>Loading...</div>
    }
    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Workspace Settings</h1>
                <p className="text-muted-foreground">Manage your workspace settings and members here.</p>
            </div>

            {/* Section 1: Workspace Switcher & Details */}
            <section className="mb-6 border border-border rounded-lg bg-card p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Workspace Details</h2>
                        <p className="text-sm text-muted-foreground">Update your workspace name and branding</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="gap-2">
                        {isEditing ? (
                            <>
                                <X size={16} />
                                Cancel
                            </>
                        ) : (
                            <>
                                <Edit2 size={16} />
                                Edit
                            </>
                        )}
                    </Button>
                </div>

                <Separator className="mb-6" />

                {isEditing && (
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Logo Section */}
                            <div className="flex-shrink-0">
                                <label className="block text-sm font-medium text-foreground mb-3">Workspace Logo</label>
                                <div className="w-24 h-24 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors">
                                    {workspaceDetails.logoUrl ? (
                                        <img
                                            src={workspaceDetails.logoUrl || '/workspace-logo.png'}
                                            alt="Workspace logo"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Building2Icon />
                                    )}
                                </div>
                            </div>

                            {/* Name Section */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label
                                        htmlFor="workspace-name"
                                        className="block text-sm font-medium text-foreground mb-2">
                                        Workspace Name
                                    </label>
                                    <input
                                        id="workspace-name"
                                        type="text"
                                        value={workspaceDetails.name}
                                        onChange={(e) => setWorkspaceDetails({ ...workspaceDetails, name: e.target.value })}
                                        className="w-full border border-border rounded-lg p-2.5 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button className="gap-2">
                                <Save size={16} />
                                Save Details
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {!isEditing && (
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                            {workspaceDetails.logoUrl ? (
                                <img
                                    src={workspaceDetails.logoUrl || '/workspace-logo.png'}
                                    alt="Workspace logo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building2Icon />
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium text-foreground">{workspaceDetails.name}</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Section 2: Workspace Members */}
            <section className="mb-6 border border-border rounded-lg bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">Workspace Members</h2>
                        <p className="text-sm text-muted-foreground">Manage member access and permissions</p>
                    </div>
                    {/* Todo: Add invite member functionality only for admins */}
                    <Button className="gap-2">
                        {/* <Plus size={16} /> */}
                        Invite Members
                    </Button>
                </div>

                <Separator className="mb-6" />

                <div className="space-y-3">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm flex-shrink-0">
                                    {member.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground text-sm">
                                        {member.name}
                                        {member.isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Todo: Add role change functionality only for admins */}
                                {!member.isCurrentUser ? (
                                    <>
                                        <select
                                            defaultValue={member.role}
                                            className="border border-border rounded-lg px-3 py-1.5 text-sm font-medium text-foreground bg-background hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
                                            <option>Viewer</option>
                                            <option>Member</option>
                                            <option>Admin</option>
                                        </select>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:text-destructive bg-transparent">
                                            <Trash2 size={16} />
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/20 border border-border rounded-lg">
                                        <Shield
                                            size={14}
                                            className="text-primary"
                                        />
                                        <span className="text-sm font-medium text-foreground">{member.role}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Todo: Add leave workspace functionality only for members not admin */}
            <section className="border border-destructive/30 rounded-lg bg-destructive/5 p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Leave Workspace</h2>
                        <p className="text-sm text-muted-foreground">
                            Once you leave, you won't be able to access this workspace unless invited again.
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        className="gap-2 flex-shrink-0">
                        <LogOut size={16} />
                        Leave Workspace
                    </Button>
                </div>
            </section>
        </div>
    )
}

export default WorkspaceSettings
