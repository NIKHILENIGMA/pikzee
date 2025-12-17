export type ProjectStatus = 'ACTIVE' | 'INACTIVE'

export type Project = {
    id: string
    name: string
    projectCoverUrl: string | null
    status: ProjectStatus
    storage: number
    createdAt: Date
    updatedAt?: Date
}
