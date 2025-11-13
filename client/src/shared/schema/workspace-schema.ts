import z from 'zod'

// Schema for creating a new workspace
export const createWorkspaceSchema = z.object({
    name: z.string().min(1, 'Workspace name is required')
})

// Schema for updating an existing workspace
export const updateWorkspaceSchema = z.object({
    name: z.string().min(1, 'Workspace name is required')
})
