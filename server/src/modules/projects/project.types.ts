import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { projects } from '@/core/db/schema/project.schema'
import z from 'zod'
import {
    ChangeProjectStatusSchema,
    CreateProjectSchema,
    GetProjectSchema,
    UpdateProjectSchema
} from './project.validator'

export type ProjectRecord = InferSelectModel<typeof projects>
export type NewProjectRecord = InferInsertModel<typeof projects>

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

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>
export type UpdateProjectDTO = z.infer<typeof UpdateProjectSchema>
export type GetProjectDTO = z.infer<typeof GetProjectSchema>
export type ChangeProjectStatusDTO = z.infer<typeof ChangeProjectStatusSchema> & { userId: string }
