import z from 'zod'

// Query Schemas
export const DocumentQuerySchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required')
})

export const DocumentShareQuerySchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    token: z.string().min(1, 'Share token is required')
})
// Params Schemas
export const DocumentParamsSchema = z.object({
    id: z.string().min(1, 'Document ID is required')
})


// Body Schemas
export const CreateDocumentBodySchema = z.object({
    title: z.string().min(1, 'Title is required')
})

export const UpdateDocumentBodySchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    title: z.string().min(1, 'Title is required').optional()
})

export const SharedDocumentBodySchema = z.object({
    action: z.enum(['generate', 'revoke'], {
        message: 'Action must be either "generate" or "revoke"'
    })
})

export const ChangeVisibilityBodySchema = z.object({
    visibility: z.enum(['private', 'workspace', 'public'], {
        message: 'Visibility must be either "private", "workspace", or "public"'
    })
})