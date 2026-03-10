export interface DocumentDTO {
    id: string
    title: string
    createdBy: string
    workspaceId: string
    image: string | null
    draftId: string
    createdAt: Date
    updatedAt: Date
}

export type DocumentVisiblity = 'private' | 'workspace' | 'public'

export type DocumentCreatedDTO = {
    id: string
    workspaceId: string
    title: string
    docImgUrl: string | null
    permission: DocumentVisiblity
    shareToken: string | null
    isArchived: boolean
    archivedAt: Date | null
    createdBy: string
    createdAt: Date
    updatedAt: Date
    initialDraftId: string
}
