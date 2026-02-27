import z from 'zod'

export const CreateDocumentBodySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    createdBy: z.string().min(1, 'Creator ID is required')
})

export const UpdateDocumentParamsSchema = z.object({
    id: z.string().min(1, 'Document ID is required')
})

export const UpdateDocumentBodySchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    title: z.string().min(1, 'Title is required').optional()
})

export const DeleteDocumentParamsSchema = z.object({
    id: z.string().min(1, 'Document ID is required'),
    workspaceId: z.string().min(1, 'Workspace ID is required')
})

export const ListDocumentsQuerySchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required')
})
