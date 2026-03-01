export interface DocumentDTO {
    id: string
    title: string
    createdBy: string
    workspaceId: string
    image: string | null
    createdAt: Date
    updatedAt: Date
}
