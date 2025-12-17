export type WorkspaceSubscriptionPlan = 'FREE' | 'CREATOR' | 'TEAM'

export type MemberPermission = 'FULL_ACCESS' | 'EDIT' | 'COMMENT_ONLY' | 'VIEW_ONLY'

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
        status: 'ACTIVE' | 'INACTIVE'
        storage: number
        createdAt: Date
        updatedAt?: Date
    }[]
}
