import z from 'zod'

export const SocialAccountParamsSchema = z.object({
    platform: z.enum(['YOUTUBE', 'TWITTER', 'LINKEDIN'])
})

export const DisconnectSocialAccountParamsSchema = z.object({
    accountId: z.string().nonempty('Social account ID is required'),
})

export const SocialAccountTokenQuerySchema = z.object({
    code: z.string().nonempty('Authorization code is required')
})

export const ListSocialAccountsQuerySchema = z.object({
    workspaceId: z.string().nonempty('Workspace ID is required')
})
