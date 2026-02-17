import z from 'zod'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { socialAccounts } from '@/core'
import { ListSocialAccountsBodySchema } from './smart-publish.validator'

export type CreateSocialAccountRecord = InferInsertModel<typeof socialAccounts>
export type SocialAccountRecord = InferSelectModel<typeof socialAccounts>

export type Platforms = 'YOUTUBE' | 'TWITTER' | 'LINKEDIN'

export type SocialAccountDTO = {
    id: string
    workspaceId: string
    status: 'CONNECTED' | 'EXPIRED' | 'REVOKED'
    platform: Platforms
    platformUserId: string
    accountName: string
    createdAt: Date
}


export type ListSocialAccountsBody = z.infer<typeof ListSocialAccountsBodySchema>