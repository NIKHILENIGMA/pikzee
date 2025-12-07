import { InferEnum, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import z from 'zod'

import { memberPermissionEnum, workspaceMembers } from '@/core'

import { AddMemberSchema, UpdateMemberPermissionSchema } from './member.validator'

// --------------------------------------------
// Drizzle Model types (Repository Layer Types)
// --------------------------------------------
export type MemberRecord = InferSelectModel<typeof workspaceMembers>
export type CreateMemberRecord = InferInsertModel<typeof workspaceMembers>
export type MemberPermission = InferEnum<typeof memberPermissionEnum>
export type DeleteMemberRecord = {
    workspaceId: string
    memberId: string
}
export type MemberDetailRecord = MemberRecord & User

export type User = {
    firstName: string | null
    lastName: string | null
    email: string
    avatarUrl: string | null
}

// --------------------------------------------
// DTO types (Service Layer Types)
// --------------------------------------------
export interface MemberDTO {
    id: string
    workspaceId: string
    permission: MemberPermission
    joinedAt: Date
    user?: {
        id: string
        firstName: string
        lastName: string | null
        email: string
        avatarUrl: string | null
    }
}

export interface CreateMemberDTO {
    userId: string
    workspaceId: string
    permission: MemberPermission
}

export type UpdateMemberDTO = Partial<MemberDTO>

export interface UpdateMemberPermissionDTO {
    memberId: string
    workspaceId: string
    permission: MemberPermission
}

// --------------------------------------------
// Controller Layer Types
// --------------------------------------------
export type CreateWorkspaceMemberRequest = z.infer<typeof AddMemberSchema>
export type UpdateMemberPermissionRequest = z.infer<typeof UpdateMemberPermissionSchema>

// export interface MemberDTO {
//     id: string
//     userId: string
//     workspaceId: string
//     permission: MemberPermission
//     joinedAt: Date
//     user?: {
//         id: string
//         name: string | null
//         email: string
//         avatarUrl: string | null
//     }
// }

// export interface UpdateMemberPermissionInput {
//     permission: MemberPermission
// }

// export interface InsertMember {
//     userId: string
//     workspaceId: string
//     inviteeUserId: string
//     permission: MemberPermission
// }
