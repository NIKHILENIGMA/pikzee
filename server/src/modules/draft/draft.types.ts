import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { drafts } from '@/core/db/schema/document'

export type Draft = InferSelectModel<typeof drafts>
export type CreateDraft = InferInsertModel<typeof drafts>
