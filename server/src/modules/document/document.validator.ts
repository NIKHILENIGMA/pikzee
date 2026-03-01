import z from 'zod'

// Query Schemas
export const DocumentQuerySchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required')
})

// Params Schemas
export const DocumentParamsSchema = z.object({
    id: z.string().min(1, 'Document ID is required'),
})

// Body Schemas
export const CreateDocumentBodySchema = z.object({
    title: z.string().min(1, 'Title is required')
})

export const UpdateDocumentBodySchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    title: z.string().min(1, 'Title is required').optional()
})



