import { and, eq } from 'drizzle-orm'

import { drafts } from '@/core/db/schema/document'
import { DatabaseConnection } from '@/core/db/service/database.service'

import { CreateDraft, Draft } from './draft.types'

export interface IDraftRepository {
    findAll(docId: string): Promise<Draft[]>
    findById(id: string, docId: string): Promise<Draft | null>
    create(input: CreateDraft): Promise<Draft>
    update(id: string, data: Partial<CreateDraft>): Promise<Draft>
    delete(id: string): Promise<void>
}

export class DraftRepository implements IDraftRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async findAll(docId: string): Promise<Draft[]> {
        return this.db
            .select()
            .from(drafts)
            .where(eq(drafts.docId, docId))
            .orderBy(drafts.createdAt)
    }

    async findById(id: string, docId: string): Promise<Draft | null> {
        const [draft] = await this.db
            .select()
            .from(drafts)
            .where(and(eq(drafts.id, id), eq(drafts.docId, docId)))

        return draft || null
    }

    async create(input: CreateDraft): Promise<Draft> {
        const [draft] = await this.db.insert(drafts).values(input).returning()
        return draft
    }

    async update(id: string, data: Partial<CreateDraft>): Promise<Draft> {
        const [updated] = await this.db
            .update(drafts)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(drafts.id, id))
            .returning()

        return updated
    }

    async delete(id: string): Promise<void> {
        await this.db.delete(drafts).where(eq(drafts.id, id))
    }
}
