import { and, desc, eq, sql } from 'drizzle-orm'

import { drafts } from '@/core/db/schema/document'
import { DatabaseConnection } from '@/core/db/service/database.service'

import {
    CreateDraft,
    Draft,
    DraftCoverImageType,
    DraftSettings,
    DraftSidebarDTO
} from './draft.types'

export interface IDraftRepository {
    findAll(docId: string): Promise<Draft[]>
    findById(draftId: string, docId: string): Promise<Draft | null>
    create(record: CreateDraft): Promise<Draft>
    update(id: string, data: Partial<CreateDraft>): Promise<Draft>
    content(
        draftId: string,
        record: { docId: string; content: Partial<CreateDraft> }
    ): Promise<void>
    visual(
        draftId: string,
        record: {
            icon: string | null
            finalUrl: string | null
            finalType: DraftCoverImageType
            positionY?: number
        }
    ): Promise<Draft | null>
    settings(draftId: string, newSettings: DraftSettings): Promise<DraftSettings | null>
    delete(draftId: string): Promise<Draft | null>
    createDraftTransaction(tx: DatabaseConnection, input: CreateDraft): Promise<Draft>
    markAsUpdated(draftId: string, userId: string): Promise<void>
    sidebar(record: { docId: string }): Promise<DraftSidebarDTO[]>
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

    async content(
        draftId: string,
        record: { docId: string; content: Partial<CreateDraft> }
    ): Promise<void> {
        await this.db
            .update(drafts)
            .set({
                title: record.content.title,
                content: record.content.content,
                lastUpdatedBy: record.content.lastUpdatedBy,
                updatedAt: record.content.updatedAt
            })
            .where(and(eq(drafts.id, draftId), eq(drafts.docId, record.docId)))
    }

    async visual(
        draftId: string,
        record: {
            icon: string | null
            finalUrl: string | null
            finalType: DraftCoverImageType
            positionY?: number
        }
    ): Promise<Draft | null> {
        const [updatedDraft] = await this.db
            .update(drafts)
            .set({
                icon: record.icon, // Only update icon if provided
                coverImageUrl: record.finalUrl,
                coverImageConfig: {
                    type: record.finalType,
                    positionY: record.positionY ?? 50, // Default to center
                    focalPoint: { x: 50, y: record.positionY ?? 50 }
                },
                updatedAt: new Date()
            })
            .where(eq(drafts.id, draftId))
            .returning()

        return updatedDraft
    }

    async settings(draftId: string, newSettings: DraftSettings): Promise<DraftSettings | null> {
        const [updatedDraft] = await this.db
            .update(drafts)
            .set({
                settings: sql`${drafts.settings} || ${JSON.stringify(newSettings)}::jsonb`,
                updatedAt: new Date()
            })
            .where(eq(drafts.id, draftId))
            .returning({
                settings: drafts.settings
            })

        return updatedDraft.settings ? (updatedDraft.settings as DraftSettings) : null
    }

    async delete(draftId: string): Promise<Draft | null> {
        const [deletedDraft] = await this.db
            .delete(drafts)
            .where(eq(drafts.id, draftId))
            .returning()

        return deletedDraft ? deletedDraft : null
    }

    async createDraftTransaction(tx: DatabaseConnection, input: CreateDraft): Promise<Draft> {
        const [draft] = await tx.insert(drafts).values(input).returning()
        return draft
    }

    async markAsUpdated(draftId: string, userId: string): Promise<void> {
        await this.db
            .update(drafts)
            .set({
                lastUpdatedBy: userId,
                updatedAt: new Date()
            })
            .where(and(eq(drafts.id, draftId), eq(drafts.lastUpdatedBy, userId)))
    }

    async sidebar(record: { docId: string }): Promise<DraftSidebarDTO[]> {
        const sidebarDrafts = await this.db
            .select({
                id: drafts.id,
                title: drafts.title ?? null,
                icon: drafts.icon ?? null,
                updatedAt: drafts.updatedAt
            })
            .from(drafts)
            .where(eq(drafts.docId, record.docId))
            .orderBy(desc(drafts.createdAt))

        return sidebarDrafts
    }
}
