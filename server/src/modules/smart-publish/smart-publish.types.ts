import z from 'zod'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { socialAccounts, socialPosts } from '@/core/db/schema'
import { ListSocialAccountsQuerySchema, UploadVideoBodySchema } from './smart-publish.validator'

export type CreateSocialAccountRecord = InferInsertModel<typeof socialAccounts>
export type SocialAccountRecord = InferSelectModel<typeof socialAccounts>
export type CreateSocialPostRecord = InferInsertModel<typeof socialPosts>
export type SocialPostRecord = InferSelectModel<typeof socialPosts>

export type Platforms = 'YOUTUBE' | 'TWITTER' | 'LINKEDIN'

export type SocialAccountDTO = {
    id: string
    status: 'CONNECTED' | 'EXPIRED' | 'REVOKED'
    platform: Platforms
    platformUserId: string
    avatarUrl?: string | null
    coverUrl?: string | null
    accountName: string
    createdAt: Date
}

export type ListSocialAccountsBody = z.infer<typeof ListSocialAccountsQuerySchema>

export type UploadVideoBody = z.infer<typeof UploadVideoBodySchema>
