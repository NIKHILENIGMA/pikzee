import { z } from 'zod'

export const SendInvitationSchema = z.object({
    email: z.email({ message: 'Invalid email address' }),
    permission: z.enum(['FULL_ACCESS', 'EDIT', 'COMMENT_ONLY', 'VIEW_ONLY']),
    message: z.string().max(500, { message: 'Message cannot exceed 500 characters' }).optional()
})

export const AcceptInvitationSchema = z.object({
    token: z.string().min(1, { message: 'Invitation token is required' })
})

export const RejectInvitationSchema = z.object({
    token: z.string().min(1, { message: 'Invitation token is required' })
})

export const CancelInvitationSchema = z.object({
    params: z.object({
        invitationId: z.uuid({ message: 'Invalid invitation ID' })
    })
})
