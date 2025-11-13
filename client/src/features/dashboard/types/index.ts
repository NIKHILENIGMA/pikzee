import type z from 'zod'

import type { createWorkspaceSchema, updateWorkspaceSchema } from '@/shared/schema/workspace-schema'

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>

export type Workspace = {
    id: string
    name: string
    slug: string
    ownerId: string
    currentStorageBytes: number
}
