import { LoaderCircle, Mail, MessageSquare, Send, Shield, Users } from 'lucide-react'
import { useState, type FC } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { useCreateInvitation } from '../api/invitation/create-invitation'
import { useGetMembers } from '../api/member/get-members'
import { useWorkspaceContext } from '../hooks/use-workspace-context'
import type { MemberPermission } from '../types'

interface CreateMemberForm {
    email: string
    permission: MemberPermission
    message: string
}

interface MembersDialogProps {
    children: React.ReactNode
}

const MembersDialog: FC<MembersDialogProps> = ({ children }) => {
    const { id } = useWorkspaceContext()
    const [open, setOpen] = useState<boolean>(false)
    const [formData, setFormData] = useState<CreateMemberForm>({
        email: '',
        permission: 'VIEW_ONLY',
        message: ''
    })
    const [error, setError] = useState<string>('')

    const { data: members, isPending } = useGetMembers({
        workspaceId: id!,
        queryConfig: { enabled: !!id && open }
    })

    const createInviteMutation = useCreateInvitation({
        mutationConfig: {
            onSuccess: () => {
                // toast.success('Invitation sent successfully!')
                setFormData({
                    email: '',
                    permission: 'VIEW_ONLY',
                    message: ''
                })
            }
        }
    })

    const handleSendInvite = async () => {
        try {
            if (!id) {
                return
            }

            await createInviteMutation.mutateAsync({
                email: formData.email,
                workspaceId: id,
                permission: formData.permission,
                customMessage: formData.message
            })

            toast.success('Invitation sent successfully!')
            setOpen(false) // Close dialog after sending invite
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unexpected error occurred.')
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={() => setOpen(!open)}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-card border border-border/50 shadow-lg">
                <DialogHeader className="space-y-2.5 pb-4 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-background rounded-lg">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold">Invite Members</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1">Add team members to your workspace</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3 py-1">
                    {/* Email + Permission Fields */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex-[2] justify-end space-y-2">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <Label className="text-sm font-medium text-foreground">Email Address</Label>
                            </div>
                            <Input
                                type="email"
                                placeholder="jane@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-muted/50 border-border/60 h-10"
                            />
                        </div>

                        <div className="flex-1 justify-end space-y-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-muted-foreground" />
                                <Label className="text-sm font-medium text-foreground">Permission Level</Label>
                            </div>
                            <Select
                                value={formData.permission}
                                onValueChange={(value: MemberPermission) => setFormData({ ...formData, permission: value })}>
                                <SelectTrigger className="bg-muted/50 border-border/60 p-4 py-4.5">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VIEW_ONLY">
                                        <span className="font-medium">Viewer</span>
                                    </SelectItem>
                                    <SelectItem value="EDIT">
                                        <span className="font-medium">Editor</span>
                                    </SelectItem>
                                    <SelectItem value="FULL_ACCESS">
                                        <span className="font-medium">Admin</span>
                                    </SelectItem>
                                    <SelectItem value="COMMENT_ONLY">
                                        <span className="font-medium">Commentor</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Custom Message Field */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            <Label className="text-sm font-medium text-foreground">
                                Custom Message <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                            </Label>
                        </div>
                        <Textarea
                            placeholder="Add a personal message to the invitation..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="bg-muted/50 border-border/60 resize-none h-24"
                        />
                    </div>
                </div>

                {/* Action Button */}
                <div className="py-1">
                    <Button
                        onClick={handleSendInvite}
                        disabled={!formData.email || !formData.permission}
                        className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                        {createInviteMutation.isPending ? (
                            <div className="flex items-center justify-center">
                                <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> Sending Invite...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Send /> Send Invitation
                            </div>
                        )}
                    </Button>
                </div>
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

                <Separator />

                {isPending ? (
                    <div>Loading...</div>
                ) : (
                    <div className="members flex space-x-2 mt-1 flex-col">
                        {!!members &&
                            members.data?.map((member) => (
                                <div
                                    key={member.id}
                                    className="w-full flex items-center justify-between p-2 border-b border-border">
                                    <div className="flex flex-1 items-center justify-start">
                                        <img
                                            src={member.user?.avatarUrl || '/placeholder.svg'}
                                            alt={`${member.user?.firstName + ' ' + member.user?.lastName}'s avatar`}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col ml-3">
                                            <span className="font-semibold">{member.user?.firstName + ' ' + member.user?.lastName}</span>
                                            <span className="text-sm text-muted-foreground">{member.user?.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-muted-foreground">{member.permission.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default MembersDialog
