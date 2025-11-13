import { ChevronDown, Edit2, Save, X, Trash2, Shield, LogOut } from 'lucide-react'
import { type FC, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import MembersDialog from '@/features/workspace/components/members-dialog'

const WorkspaceSettings: FC = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [workspaceName, setWorkspaceName] = useState('Acme Co — Design')
    const [workspaceSlug, setWorkspaceSlug] = useState('design')
    // const [isAdmin, setIsAdmin] = useState(true) // Current user is admin

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
    const workspace = {
        id: 'e250c90f-13ec-4282-a6c2-31794d2477f4',
        name: "Nikhil\t's Workspace",
        slug: 'Nikhil\t-1760458402045',
        ownerId: 'user_32xk6cu6zGi6DrkikD1L3c7do16',
        workspaceLogo: '',
        members: [
            {
                id: 'member_user_32xk6cu6zGi6DrkikD1L3c7do16',
                userId: 'user_32xk6cu6zGi6DrkikD1L3c7do16',
                name: 'Nikhil',
                email: 'nikhil@example.com',
                permission: 'FULL_ACCESS'
            },
            {
                id: 'member_user_3442DKF54P6zrk4cw0KkivEZVlB',
                userId: 'user_3442DKF54P6zrk4cw0KkivEZVlB',
                name: 'John',
                email: 'john@example.com',
                permission: 'READ_ONLY'
            }
        ],
        projects: []
    }

    const [showMembers, setShowMembers] = useState<boolean>(false)

    return (
        <div className="min-h-screen bg-background p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
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

                    {/* Workspace Switcher */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-3">Current Workspace</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="w-full md:w-80 border border-border rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors">
                                    <span className="font-medium text-foreground">{workspaceName}</span>
                                    <ChevronDown
                                        size={16}
                                        className="text-muted-foreground"
                                    />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="p-2"
                                align="start">
                                <div className="flex flex-col gap-1">
                                    <Button
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={() => setWorkspaceName('Acme Co — Design')}>
                                        Acme Co — Design
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={() => setWorkspaceName('Beta Ltd — Marketing')}>
                                        Beta Ltd — Marketing
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={() => setWorkspaceName('Gamma Inc — Development')}>
                                        Gamma Inc — Development
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Editable Workspace Details */}
                    {isEditing && (
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Logo Section */}
                                <div className="flex-shrink-0">
                                    <label className="block text-sm font-medium text-foreground mb-3">Workspace Logo</label>
                                    <div className="w-24 h-24 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/workspace-logo.png"
                                            alt="Workspace logo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Name & Slug Section */}
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
                                            value={workspaceName}
                                            onChange={(e) => setWorkspaceName(e.target.value)}
                                            className="w-full border border-border rounded-lg p-2.5 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="workspace-slug"
                                            className="block text-sm font-medium text-foreground mb-2">
                                            Workspace Slug
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground px-3 py-2.5 bg-muted rounded-lg border border-border">
                                                acme.app/
                                            </span>
                                            <input
                                                id="workspace-slug"
                                                type="text"
                                                value={workspaceSlug}
                                                onChange={(e) => setWorkspaceSlug(e.target.value)}
                                                className="flex-1 border border-border rounded-lg p-2.5 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
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
                                <img
                                    src="/workspace-logo.png"
                                    alt="Workspace logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium text-foreground mb-3">{workspaceName}</p>
                                <p className="text-sm text-muted-foreground">Slug</p>
                                <p className="font-medium text-foreground">acme.app/{workspaceSlug}</p>
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
                        <Button
                            className="gap-2"
                            onClick={() => {
                                setShowMembers(true)
                            }}>
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

                {/* Section 3: Leave Workspace */}

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
            <MembersDialog
                showMembers={showMembers}
                setShowMembers={setShowMembers}
                workspace={workspace}
            />
        </div>
    )
}

export default WorkspaceSettings
