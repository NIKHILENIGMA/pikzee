export type MemberPermission = 'FULL_ACCESS' | 'EDIT' | 'COMMENT_ONLY' | 'VIEW_ONLY'

export interface MemberDTO {
    id: string
    userId: string
    workspaceId: string
    permission: MemberPermission
    joinedAt: Date
    user?: {
        id: string
        name: string | null
        email: string
        avatarUrl: string | null
    }
}

export interface UpdateMemberPermissionInput {
    permission: MemberPermission
}
