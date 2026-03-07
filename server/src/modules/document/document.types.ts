import { docs } from '@/core/db/schema/document'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import z from 'zod'
import { CreateDocumentBodySchema, DocumentQuerySchema } from './document.validator'

export type Document = InferSelectModel<typeof docs>
export type CreateDocument = InferInsertModel<typeof docs>

export type CreateDocumentInput = z.infer<typeof CreateDocumentBodySchema> &
    z.infer<typeof DocumentQuerySchema> & { createdBy: string }
export type CreateDocumentDTO = Document & { initialDraftId: string }
export type DocumentDTO = {
    id: string;
    createdBy: string;
    workspaceId: string;
    defaultDraftId: string;
}

export type ShareAction = 'generate' | 'revoke'
export type DocumentVisibility = 'private' | 'workspace' | 'public'