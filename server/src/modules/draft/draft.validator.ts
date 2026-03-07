import { z } from 'zod'

// Params schema
export const DraftParamsSchema = z.object({
    id: z.uuid({ message: 'Invalid document ID' }),
    draftId: z.uuid({ message: 'Invalid draft ID' })
})

// Query schema
export const DraftQuerySchema = z.object({
    workspaceId: z.uuid({ message: 'Invalid workspace ID' })
})

// Body schema
export const CreateDraftBodySchema = z.object({
    docId: z.uuid({ message: 'Invalid document ID' }),
    workspaceId: z.uuid({ message: 'Invalid workspace ID' }),
    ownerId: z.uuid({ message: 'Invalid owner ID' }),
    lastUpdatedBy: z.uuid({ message: 'Invalid last updated by ID' })
})

export const DraftVisualBodySchema = z.object({
    icon: z.string().optional(),
    type: z.enum(['S3', 'URL', 'unsplash']).optional(),
    coverImageUrl: z.url({ message: 'Invalid cover image URL' }).optional(),
    coverImageConfig: z
        .object({
            x: z.number().optional(),
            y: z.number().optional()
        })
        .optional()
})

export const DraftSettingBodySchema = z.object({
    fontStyle: z.enum(['inter', 'serif', 'mono']).default('inter'),
    fontSize: z.enum(['10px', '16px', '24px']).default('16px'),
    isFullWidth: z.boolean().default(false),
    showCover: z.boolean().default(true),
    showIcon: z.boolean().default(true),
    showOwner: z.boolean().default(true),
    showLastModified: z.boolean().default(true)
}).strict()

export const DraftContentBodySchema = z.object({
    title: z.string().min(1).max(255).optional(),
    content: z.string().optional()
})

export const GenerateContentBodySchema = z.object({
    prompt: z.string().min(3)
})
