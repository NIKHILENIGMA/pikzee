import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { drafts } from '@/core/db/schema/document'
import { DraftSettingBodySchema } from './draft.validator'
import z from 'zod'

export type Draft = InferSelectModel<typeof drafts>
export type CreateDraft = InferInsertModel<typeof drafts>

export type DraftCoverImageType = 'S3' | 'URL' | 'unsplash'


export const UpdateSettingsSchema = DraftSettingBodySchema.partial().strict();

export type DraftSettings = z.infer<typeof DraftSettingBodySchema>;