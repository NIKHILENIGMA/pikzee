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
