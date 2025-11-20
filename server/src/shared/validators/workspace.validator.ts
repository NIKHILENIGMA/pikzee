import z from 'zod'

export const createWorkspaceSchema = z.object({
    name: z.string().min(3).max(50),
    logoUrl: z.url().optional()
})

export const updateWorkspaceSchema = z.object({
    name: z.string().min(3).max(50).optional(),
    logoUrl: z.url().optional()
})

export const WorkspaceIdSchema = z.object({
    workspaceId: z.uuid().nonempty()
})
