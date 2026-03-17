import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { drafts } from '@/core/db/schema/document'
import { DraftSettingBodySchema } from './draft.validator'
import z from 'zod'

export type Draft = InferSelectModel<typeof drafts>
export type CreateDraft = InferInsertModel<typeof drafts>

export type DraftCoverImageType = 'S3' | 'URL' | 'unsplash'

export const UpdateSettingsSchema = DraftSettingBodySchema.partial().strict()

export type DraftSettings = z.infer<typeof DraftSettingBodySchema>

export type DraftSidebarDTO = {
    id: string
    title: string | null
    icon: string | null
    updatedAt: Date
}

export type DraftDTO = {
    id: string
    docId: string
    title: string
    content: string
    icon: string | null
    coverImageUrl: string | null
    coverImageConfig: object | null
    settings: DraftSettings
    createdAt: Date
    updatedAt: Date
    owner: {
        id: string
        firstName: string
        lastName: string
        avatarUrl: string | null
    }
    lastUpdatedBy: {
        id: string
        firstName: string
        lastName: string
        avatarUrl: string | null
    }
}
