export type ProjectStatus = 'All' | 'Active' | 'Inactive'

export interface Workspace {
    id: string
    name: string
    slug: string
    ownerId: string
    workspaceLogo: string
    members: {
        id: string
        userId: string
        avatar?: string
        name: string
        email: string
        permission: string
    }[]
    projects: Project[]
}

export type Project = {
    id: string
    projectName: string
    projectCoverImage?: string
    status: 'Active' | 'Inactive'
    lastUpdated: string
    createdAt: string
    storage: number
}
