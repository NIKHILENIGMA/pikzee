import { z } from 'zod'

export const CreateDraftBodySchema = z.object({
    docId: z.uuid({ message: 'Invalid document ID' }),
    workspaceId: z.uuid({ message: 'Invalid workspace ID' }),
    ownerId: z.uuid({ message: 'Invalid owner ID' }),
    lastUpdatedBy: z.uuid({ message: 'Invalid last updated by ID' })
})

export const ListDraftsParamsSchema = z.object({
    docId: z.uuid({ message: 'Invalid document ID' })
})

export const DraftByIdParamsSchema = z.object({
    id: z.uuid({ message: 'Invalid draft ID' }),
    docId: z.uuid({ message: 'Invalid document ID' })
})

export const UpdateDraftBodySchema = z.object({
    title: z.string().min(3).max(255).optional(),
    content: z.string().optional(),
    coverImage: z.url().optional(),
    icon: z.string().optional(),
    lastUpdatedBy: z.uuid({ message: 'Invalid last updated by ID' }).optional()
})

export const GenerateContentBodySchema = z.object({
    prompt: z.string().min(3)
})
