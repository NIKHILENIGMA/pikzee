import type { Member } from './member.types'
import type { Project } from './project.types'

export type WorkspaceSubscriptionPlan = 'FREE' | 'CREATOR' | 'TEAM'

export interface WorkspaceDTO {
    id: string
    name: string
    logoUrl: string | null
    ownerId: string
    subscriptionPlan?: WorkspaceSubscriptionPlan
    createdAt: Date
    members?: Member[]
    projects?: Project[]
}
