import z from 'zod'

export const SocialAccountParamsSchema = z.object({
    platform: z.enum(['YOUTUBE', 'TWITTER', 'LINKEDIN'])
})

export const DisconnectSocialAccountParamsSchema = z.object({
    accountId: z.string().nonempty('Social account ID is required')
})

export const SocialAccountTokenQuerySchema = z.object({
    code: z.string().nonempty('Authorization code is required')
})

export const ListSocialAccountsQuerySchema = z.object({
    workspaceId: z.string().nonempty('Workspace ID is required')
})

export const UploadVideoBodySchema = z.object({
    workspaceId: z.string().nonempty('Workspace ID is required'),
    socialAccountId: z.string().nonempty('Social account ID is required'),
    title: z.string().nonempty('Video title is required'),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    visibility: z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE']).optional(),
    scheduledAt: z.string().optional(), // ISO date string for scheduling
    contentType: z.string().min(1, 'Content type is required') // Added contentType field
})

export const ConfirmUploadBodySchema = z.object({
    postId: z.string().nonempty('Post ID is required'),
    platform: z.enum(['YOUTUBE', 'TWITTER', 'LINKEDIN'])
})
