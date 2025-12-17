export type MemberPermission = 'FULL_ACCESS' | 'EDIT' | 'COMMENT_ONLY' | 'VIEW_ONLY'

export type Member = {
    id: string
    firstName: string
    lastName: string
    email: string
    avatarUrl: string | null
    permission: MemberPermission
}
