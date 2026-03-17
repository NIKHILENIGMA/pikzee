import { z } from 'zod'

// Params schema
export const DraftParamsSchema = z.object({
    docId: z.uuid({ message: 'Invalid document ID' }),
    draftId: z.uuid({ message: 'Invalid draft ID' })
})

export const DraftListParamsSchema = z.object({
    docId: z.uuid({ message: 'Invalid document ID' })
})

// Query schema
export const DraftQuerySchema = z.object({
    workspaceId: z.uuid({ message: 'Invalid workspace ID' })
})

// Body schema
export const DraftUpdateCoverImageBodySchema = z.object({
    coverImageUrl: z.url({ message: 'Invalid cover image URL' }),
    type: z.enum(['S3', 'URL', 'unsplash'])
})

export const DraftRepositionBodySchema = z.object({
    positionY: z.number().min(0).max(100)
})

export const DraftEmojiBodySchema = z.object({
    icon: z.string({ message: 'Invalid emoji or icon' })
})

export const DraftSettingBodySchema = z
    .object({
        fontStyle: z.enum(['inter', 'serif', 'mono']).default('inter'),
        fontSize: z.enum(['10px', '16px', '24px']).default('16px'),
        isFullWidth: z.boolean().default(false),
        showCover: z.boolean().default(true),
        showIcon: z.boolean().default(true),
        showOwner: z.boolean().default(true),
        showLastModified: z.boolean().default(true)
    })
    .strict()

export const DraftContentBodySchema = z.object({
    title: z.string().min(1).max(255).optional(),
    content: z.string().optional()
})

export const GenerateContentBodySchema = z.object({
    prompt: z.string().min(3)
})
