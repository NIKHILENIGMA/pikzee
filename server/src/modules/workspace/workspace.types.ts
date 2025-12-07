import { InferEnum, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import z from 'zod'

import { subscriptionPlanEnum, workspaces } from '@/core'

import { CreateWorkspaceSchema, UpdateWorkspaceSchema } from './workspace.validator'

import { MemberPermission } from '../members'

// --------------------------------------------
// Drizzle Model types (Repository Layer Types)
// --------------------------------------------
export type WorkspaceRecord = InferSelectModel<typeof workspaces>
export type CreateWorkspaceRecord = InferInsertModel<typeof workspaces>
export type SoftDeleteRecord = {
    workspaceId: string
    ownerId: string
}

export type WorkspaceSubscriptionPlan = InferEnum<typeof subscriptionPlanEnum>

// --------------------------------------------
// DTO types (Service Layer Types)
// --------------------------------------------
export interface WorkspaceDTO {
    id: string
    name: string
    logoUrl: string | null
    ownerId: string
    subscriptionPlan?: WorkspaceSubscriptionPlan
    createdAt: Date
    members?: {
        id: string
        firstName: string
        lastName: string
        email: string
        avatarUrl: string | null
        permission: MemberPermission
    }[]
    projects?: {
        id: string
        name: string
        projectCoverUrl: string | null
    }[]
}

export interface CreateWorkspaceDTO {
    name: string
    logoUrl?: string | null
    ownerId: string
    subscriptionPlan?: WorkspaceSubscriptionPlan
}

export interface UpdateWorkspaceDTO {
    name?: string
    logoUrl?: string | null
    ownerId?: string
    subscriptionPlan?: WorkspaceSubscriptionPlan
}

export interface UpdateMemberPermissionDTO {
    memberId: string
    workspaceId: string
    permission: MemberPermission
}

export interface SoftDeleteDTO {
    workspaceId: string
    userId: string
}

// --------------------------------------------
// Controller Layer Types
// --------------------------------------------
export type CreateWorkspaceRequest = z.infer<typeof CreateWorkspaceSchema>
export type UpdateWorkspaceRequest = z.infer<typeof UpdateWorkspaceSchema>

// export type SubscriptionPlan = 'FREE' | 'CREATOR' | 'TEAM'

// export interface WorkspaceDTO {
//     id: string
//     name: string
//     logoUrl: string | null
//     owner?: {
//         id: string
//         firstName: string | null
//         lastName: string | null
//         email: string
//         avatarUrl: string | null
//     }
//     subscriptionPlan?: SubscriptionPlan
//     storageUsed?: number
//     bandwidthUsed?: number
//     createdAt?: Date
//     updatedAt?: Date
//     members?: {
//         id: string
//         firstName: string
//         lastName: string
//         email: string
//         avatarUrl: string | null
//         permission: 'FULL_ACCESS' | 'VIEW_ONLY' | 'EDIT' | 'COMMENT_ONLY'
//     }[]
//     projects?: {
//         id: string
//         name: string
//         projectCoverUrl: string | null
//     }[]
// }

// export interface UpdatedWorkspaceDTO {
//     id: string
//     name: string
//     logoUrl: string | null
//     updatedAt: Date
// }

// export interface WorkspaceUsageDTO {
//     storageUsed: number
//     storageLimit: number
//     bandwidthUsed: number
//     bandwidthLimit: number
//     memberCount: number
//     memberLimit?: number
//     projectCount?: number
//     projectLimit?: number
// }

// export interface SubscriptionLimits {
//     maxMembers: number
//     maxProjects: number
//     storageLimit: number // in bytes
//     bandwidthLimit: number // in bytes
//     maxDocuments: number
//     allowedPlatforms: string[]
// }

// export interface UpdateStorageUsageResult {
//     workspaceId: string
//     newStorageUsed: number
//     bytesAdded: number
// }

// export interface UpdateBandwidthUsageResult {
//     workspaceId: string
//     newBandwidthUsed: number
//     bytesTransferred: number
// }
