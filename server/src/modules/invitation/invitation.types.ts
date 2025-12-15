import { InferEnum, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { MemberPermission } from '../members/member.types'
import { invitations, invitationStatusEnum } from '@/core'
import z from 'zod'
import { AcceptInvitationSchema, SendInvitationSchema } from './invitation.validator'

// --------------------------------------------
// Drizzle Model types (Repository Layer Types)
// --------------------------------------------
export type InvitationRecord = InferSelectModel<typeof invitations>
export type CreateInvitationRecord = InferInsertModel<typeof invitations>
export type GetPendingInvitationRecord = {
    workspaceId: string
    inviteeEmail: string
}
export type InvitationStatus = InferEnum<typeof invitationStatusEnum>

// --------------------------------------------
// DTO types (Service Layer Types)
// --------------------------------------------

export interface InvitationDTO {
    id: string
    workspaceId: string
    inviterUserId: string
    inviteeEmail: string
    permission: MemberPermission
    token: string
    status: InvitationStatus
    expiresAt: Date
    createdAt: Date
    inviter: {
        name: string | null
        email: string
    }
    workspace: {
        name: string
    }
}

export interface SendInvitationDTO {
    workspaceId: string
    userId: string
    email: string
    permission: MemberPermission
    customMessage?: string
}

export interface AcceptInvitationDTO {
    token: string
    userId: string
}

export interface RejectInvitationDTO {
    token: string
    userId: string
}

export interface CancelInvitationDTO {
    token: string
    userId: string
}

export enum InvitationType {
    SIGNUP = 'SIGNUP',
    LOGIN = 'LOGIN'
}

export interface CreateInvitationPayloadDTO {
    workspaceName: string
    invitedBy: string
    invitationLink: string
    userExist: boolean
    message?: string
}

// --------------------------------------------
// Controller Layer Types
// --------------------------------------------
export type SendInvitationRequest = z.infer<typeof SendInvitationSchema>
export type AcceptInvitationRequest = z.infer<typeof AcceptInvitationSchema>
