import { z } from 'zod'

export const SendInvitationSchema = z.object({
    workspaceId: z.uuid({ message: 'Invalid workspace ID' }),
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
    token: z.string().min(1, { message: 'Invitation token is required' })
})

export const ListPendingInvitationSchema = z.object({
    workspaceId: z.uuid({ message: 'Invalid workspace ID' }),
    limit: z.number().min(1).max(100).optional(),
    offset: z.number().min(0).optional()
})
