export type SubscriptionPlan = 'FREE' | 'CREATOR' | 'TEAM'

export interface WorkspaceDTO {
    id: string
    name: string
    logoUrl: string | null
    owner?: {
        id: string
        firstName: string | null
        lastName: string | null
        email: string
        avatarUrl: string | null
    }
    subscriptionPlan?: SubscriptionPlan
    storageUsed?: number
    bandwidthUsed?: number
    createdAt?: Date
    updatedAt?: Date
    members?: {
        id: string
        firstName: string
        lastName: string
        email: string
        avatarUrl: string | null
        permission: 'FULL_ACCESS' | 'VIEW_ONLY' | 'EDIT' | 'COMMENT_ONLY'
    }[]
    projects?: {
        id: string
        name: string
        projectCoverUrl: string | null
    }[]
}

export interface UpdateWorkspaceInput {
    name?: string
    logoUrl?: string
}

export interface UpdatedWorkspaceDTO {
    id: string
    name: string
    logoUrl: string | null
    updatedAt: Date
}

export interface WorkspaceUsageDTO {
    storageUsed: number
    storageLimit: number
    bandwidthUsed: number
    bandwidthLimit: number
    memberCount: number
    memberLimit?: number
    projectCount?: number
    projectLimit?: number
}

export interface SubscriptionLimits {
    maxMembers: number
    maxProjects: number
    storageLimit: number // in bytes
    bandwidthLimit: number // in bytes
    maxDocuments: number
    allowedPlatforms: string[]
}

export interface UpdateStorageUsageResult {
    workspaceId: string
    newStorageUsed: number
    bytesAdded: number
}

export interface UpdateBandwidthUsageResult {
    workspaceId: string
    newBandwidthUsed: number
    bytesTransferred: number
}
