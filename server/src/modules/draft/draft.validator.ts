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
        fontStyle: z.enum(['sans', 'serif', 'mono']).optional(),
        fontSize: z.enum(['16px', '25px', '36px']).optional(),
        isFullWidth: z.boolean().optional(),
        showCover: z.boolean().optional(),
        showIcon: z.boolean().optional(),
        showOwner: z.boolean().optional(),
        showLastModified: z.boolean().optional()
    })
    .strict()

export const DraftContentBodySchema = z.object({
    title: z.string().min(1).max(255).optional(),
    content: z.string().optional()
})

export const GenerateContentBodySchema = z.object({
    prompt: z.string().min(3)
})
