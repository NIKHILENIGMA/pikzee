import { MemberPermission } from '../members/member.types'

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED'

export enum InvitationType {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED'
}

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

export interface SendInvitationInput {
    email: string
    permission: MemberPermission
    customMessage?: string
}

export interface AcceptInvitationInput {
    token: string
}

export enum InvitationType {
    SIGNUP = 'SIGNUP',
    LOGIN = 'LOGIN'
}
