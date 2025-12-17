import { CheckCheck, ChevronDown, X } from 'lucide-react'
import { useState, type ChangeEvent, type FC, type KeyboardEvent } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { type WorkspaceDTO } from '@/features/workspace/types'

interface MembersDialogProps {
    showMembers: boolean
    setShowMembers: (show: boolean) => void
    workspace: WorkspaceDTO
}

const PermissionPalette = [
    { label: 'Full Access', value: 'FULL_ACCESS', description: 'Can view, comment, edit, and manage settings' },
    { label: 'Edit', value: 'EDIT', description: 'Can edit content and comment' },
    { label: 'View Only', value: 'VIEW_ONLY', description: 'Can view content' },
    { label: 'Comment Only', value: 'COMMENT_ONLY', description: 'Can view and comment on content' }
]

interface SelectedEmail {
    id: string
    email: string
}

const MembersDialog: FC<MembersDialogProps> = ({ showMembers, setShowMembers, workspace }) => {
    const [inviteEmail, setInviteEmail] = useState<string>('')
    const [selectedEmail, setSelectedEmail] = useState<SelectedEmail[]>([])
    const [error, setError] = useState<string>('')

    const handleInviteEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError('')
        setInviteEmail(e.target.value)
    }

    const handleEmailKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            const email = inviteEmail.trim()
            if (email.length > 0 && !selectedEmail.some((e) => e.email === email)) {
                if (selectedEmail.length >= 5) {
                    setError('You can only invite up to 5 members.')
                    return
                }
                const id = Date.now().toString()
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                if (!isValidEmail) {
                    setError('Please enter a valid email address.')
                    return
                }

                setSelectedEmail((prev) => [...prev, { id, email }])
                setInviteEmail('')
            }
        }
    }

    const handleSendInvite = () => {
        if (selectedEmail.length === 0) {
            setError('Please enter an email address.')
            return
        }
        // Send invite logic here
        // todo: integrate with backend API

        // Clear selected emails after sending invites
        setSelectedEmail([])
        setInviteEmail('')

        // Show success toast
        toast.success('Invitations sent successfully!', {
            description: <span className="text-foreground/80">Invites sent to: {selectedEmail.map((e) => e.email).join(', ')}</span>,
            duration: 5000,
            action: {
                label: 'Close',
                onClick: () => toast.dismiss()
            }
        })
    }

    return (
        <Dialog
            open={showMembers}
            onOpenChange={() => {
                setShowMembers(!showMembers)
            }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Members</DialogTitle>
                    <div className="flex flex-col space-y-2 mt-4">
                        <div className="invite-member flex items-end space-x-2">
                            <div className="flex flex-col flex-1 space-y-2">
                                <Label htmlFor="user-email">Email: </Label>
                                <Input
                                    id="user-email"
                                    type="email"
                                    value={inviteEmail}
                                    autoComplete="off"
                                    placeholder="Enter email to invite (e.g. jane@company.com)"
                                    aria-label="Invite member email"
                                    onChange={handleInviteEmailChange}
                                    onKeyDown={handleEmailKeydown}
                                />
                            </div>
                            <Button
                                variant="default"
                                type="button"
                                disabled={selectedEmail.length === 0}
                                onClick={handleSendInvite}>
                                Send Invite
                            </Button>
                        </div>
                        {selectedEmail.length > 0 && (
                            <div className="w-full flex flex-wrap items-start gap-2 px-2 py-1">
                                {selectedEmail.map((mail) => (
                                    <Badge
                                        key={mail.id}
                                        variant={'secondary'}
                                        className="flex items-center">
                                        {mail.email}{' '}
                                        <button
                                            // prevent parent handlers from firing and improve accessibility
                                            type="button"
                                            aria-label={`Remove ${mail.email}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedEmail((prev) => prev.filter((e) => e.id !== mail.id))
                                                if (error) setError('')
                                            }}
                                            className="cursor-pointer z-20 h-4 w-4 inline-flex items-center justify-center">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                        {/* Members List */}
                        <div className="members flex space-x-2 border-t border-border mt-4 flex-col">
                            {!!workspace.members &&
                                workspace.members.map((member) => (
                                    <div className="w-full flex items-center justify-between p-2 border-b border-border">
                                        <div className="flex flex-1 items-center justify-start">
                                            <img
                                                src={member.avatarUrl || '/placeholder.svg'}
                                                alt={`${member.firstName + ' ' + member.lastName}'s avatar`}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col ml-3">
                                                <span className="font-semibold">{member.firstName + ' ' + member.lastName}</span>
                                                <span className="text-sm text-muted-foreground">{member.email}</span>
                                            </div>
                                        </div>

                                        {member.permission === 'FULL_ACCESS' ? (
                                            <div className="flex items-center gap-2 text-sm px-2 py-1.5">FULL ACCESS</div>
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger className="flex items-center gap-2 text-sm px-2 py-1.5 hover:bg-secondary">
                                                    <div className="flex items-center gap-2">
                                                        {member.permission.replace('_', ' ')} <ChevronDown size={14} />
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent align="end">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">Change Permission</span>
                                                        <div className="flex flex-col space-y-1">
                                                            {PermissionPalette.map((permission) => (
                                                                <button
                                                                    key={permission.label}
                                                                    type="button"
                                                                    className="w-full flex justify-between items-center hover:bg-secondary/90 p-2 rounded cursor-pointer pointer-events-auto text-left">
                                                                    <div className="flex flex-col">
                                                                        <span>{permission.label}</span>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {permission.description}{' '}
                                                                        </span>
                                                                    </div>
                                                                    {member.permission === permission.value ? (
                                                                        <CheckCheck
                                                                            size={20}
                                                                            className="text-primary"
                                                                        />
                                                                    ) : null}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                ))}
                        </div>
                        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default MembersDialog
