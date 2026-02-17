import z from 'zod'

export const ConnectSocialAccountParamsSchema = z.object({
    platform: z.enum(['YOUTUBE', 'TWITTER', 'LINKEDIN'])
})

export const VerifySocialAccountTokenBodySchema = z.object({
    code: z.string().nonempty('Authorization code is required')
})

export const ListSocialAccountsBodySchema = z.object({
    workspaceId: z.string().nonempty('Workspace ID is required')
})