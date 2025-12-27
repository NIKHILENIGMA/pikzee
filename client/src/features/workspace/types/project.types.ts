export type ProjectView = 'LIST' | 'GRID'

export type ProjectStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

export interface ProjectDTO {
    id: string
    workspaceId: string
    projectName: string
    projectCoverImageUrl: string | null
    projectOwnerId: string
    storageUsed: number
    status: ProjectStatus
    isAccessRestricted: boolean
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
}
