import { and, desc, eq, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { drafts } from '@/core/db/schema/document'
import { DatabaseConnection } from '@/core/db/service/database.service'

import {
    CreateDraft,
    Draft,
    DraftCoverImageType,
    DraftDTO,
    DraftSettings,
    DraftSidebarDTO
} from './draft.types'
import { users } from '@/core'

export interface IDraftRepository {
    findAll(docId: string): Promise<Draft[]>
    findById(draftId: string, docId: string): Promise<DraftDTO | null>
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
    addCoverImage(draftId: string, record: { imageUrl: string }): Promise<void>
    updateCoverImage(
        draftId: string,
        record: { imageUrl: string; type: DraftCoverImageType }
    ): Promise<void>
    updateCoverImagePosition(draftId: string, positionY: number): Promise<void>
    removeCoverImage(draftId: string): Promise<void>
    updateIcon(draftId: string, record: { icon: string | null }): Promise<void>
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

    async findById(id: string, docId: string): Promise<DraftDTO | null> {
        const owner = alias(users, 'owner') // We need to alias the users table for the lastUpdatedBy join to avoid conflicts
        const lastUpdatedBy = alias(users, 'lastUpdatedBy')

        const [draft] = await this.db
            .select({
                id: drafts.id,
                docId: drafts.docId,
                title: drafts.title,
                content: drafts.content,
                icon: drafts.icon,
                coverImageUrl: drafts.coverImageUrl,
                coverImageConfig: drafts.coverImageConfig,
                settings: drafts.settings,
                createdAt: drafts.createdAt,
                updatedAt: drafts.updatedAt,
                owner: {
                    id: owner.id,
                    firstName: owner.firstName,
                    lastName: owner.lastName,
                    avatarUrl: owner.avatarUrl
                },
                lastUpdatedBy: {
                    id: lastUpdatedBy.id,
                    firstName: lastUpdatedBy.firstName,
                    lastName: lastUpdatedBy.lastName,
                    avatarUrl: lastUpdatedBy.avatarUrl
                }
            })
            .from(drafts)
            .innerJoin(owner, eq(owner.id, drafts.ownerId))
            .innerJoin(lastUpdatedBy, eq(lastUpdatedBy.id, drafts.lastUpdatedBy))
            .where(and(eq(drafts.id, id), eq(drafts.docId, docId)))
            .limit(1)

        return draft ? (draft as DraftDTO) : null
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
                ...(record.content.title !== undefined && { title: record.content.title }),
                ...(record.content.content !== undefined && {
                    content: record.content.content
                }),
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

    async addCoverImage(draftId: string, record: { imageUrl: string }): Promise<void> {
        await this.db
            .update(drafts)
            .set({
                coverImageUrl: record.imageUrl,
                coverImageConfig: {
                    type: 'unsplash',
                    positionY: 50, // Default to center
                    focalPoint: { x: 50, y: 50 }
                }
            })
            .where(eq(drafts.id, draftId))
    }

    async updateCoverImage(
        draftId: string,
        record: { imageUrl: string; type: DraftCoverImageType }
    ): Promise<void> {
        await this.db
            .update(drafts)
            .set({
                coverImageUrl: record.imageUrl,
                coverImageConfig: {
                    type: record.type,
                    positionY: 50, // Default to center
                    focalPoint: { x: 50, y: 50 }
                }
            })
            .where(eq(drafts.id, draftId))
    }

    async updateCoverImagePosition(draftId: string, positionY: number): Promise<void> {
        await this.db
            .update(drafts)
            .set({
                coverImageConfig: sql`${drafts.coverImageConfig} || ${JSON.stringify({ positionY })}::jsonb`
            })
            .where(eq(drafts.id, draftId))
    }

    async removeCoverImage(draftId: string): Promise<void> {
        await this.db
            .update(drafts)
            .set({
                coverImageUrl: null,
                coverImageConfig: null
            })
            .where(eq(drafts.id, draftId))
    }

    async updateIcon(draftId: string, record: { icon: string | null }): Promise<void> {
        await this.db.update(drafts).set({ icon: record.icon }).where(eq(drafts.id, draftId))
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
