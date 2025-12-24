export type MemberPermission = 'FULL_ACCESS' | 'EDIT' | 'COMMENT_ONLY' | 'VIEW_ONLY'

export type MemberDTO = {
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
