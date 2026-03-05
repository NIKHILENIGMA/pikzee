import { and, desc, eq, sql } from 'drizzle-orm'

import { docs, drafts } from '@/core/db/schema/document'
import { DatabaseConnection } from '@/core/db/service/database.service'

import { CreateDocument, Document } from './document.types'
import { users } from '@/core'
import { Draft } from '../draft/draft.types'

export interface IDocRepository {
    findAll(workspaceId: string): Promise<Document[]>
    findById(id: string, workspaceId: string): Promise<Document | null>
    findWithDrafts(id: string, workspaceId: string): Promise<any>
    create(input: CreateDocument): Promise<Document>
    update(id: string, data: Partial<Document>): Promise<Document>
    delete(id: string): Promise<void>
    transaction<T>(callback: (tx: DatabaseConnection) => Promise<T>): Promise<T>
    createDocumentTransaction(tx: DatabaseConnection, input: CreateDocument): Promise<Document>
}

export class DocRepository implements IDocRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async findAll(workspaceId: string): Promise<Document[]> {
        return this.db
            .select({
                id: docs.id,
                createdAt: docs.createdAt,
                updatedAt: docs.updatedAt,
                workspaceId: docs.workspaceId,
                title: docs.title,
                docImgUrl: docs.docImgUrl,
                permission: docs.permission,
                shareToken: docs.shareToken,
                isArchived: docs.isArchived,
                archivedAt: docs.archivedAt,
                createdBy: sql<string>`${users.firstName} || ' ' || ${users.lastName}`
            })
            .from(docs)
            .innerJoin(users, eq(docs.createdBy, users.id))
            .where(and(eq(docs.workspaceId, workspaceId), eq(docs.isArchived, false)))
            .orderBy(desc(docs.updatedAt))
    }

    async findById(id: string, workspaceId: string): Promise<(Document & Draft) | null> {
        const [result] = await this.db
            .select()
            .from(docs)
            .leftJoin(drafts, eq(docs.id, drafts.docId))
            .where(
                and(eq(docs.id, id), eq(docs.workspaceId, workspaceId), eq(docs.isArchived, false))
            )
            .orderBy(drafts.createdAt) // Ensure we get the earliest draft first
            .limit(1) // We only need the document with its initial draft

        if (!result) {
            return null
        }

        return { ...result.docs, ...(result.drafts || {}) } as Document & Draft
    }

    async findWithDrafts(id: string, workspaceId: string) {
        const doc = await this.findById(id, workspaceId)
        const docDrafts = await this.db
            .select()
            .from(drafts)
            .where(eq(drafts.docId, id))
            .orderBy(drafts.createdAt)

        return { ...doc, drafts: docDrafts }
    }

    async create(input: CreateDocument): Promise<Document> {
        const [doc] = await this.db.insert(docs).values(input).returning()
        return doc
    }

    async update(id: string, data: Partial<Document>): Promise<Document> {
        const [updated] = await this.db
            .update(docs)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(docs.id, id))
            .returning()

        return updated
    }

    async delete(id: string): Promise<void> {
        await this.db.delete(docs).where(eq(docs.id, id))
    }

    async transaction<T>(callback: (tx: DatabaseConnection) => Promise<T>): Promise<T> {
        return this.db.transaction(callback)
    }

    async createDocumentTransaction(
        tx: DatabaseConnection,
        input: CreateDocument
    ): Promise<Document> {
        const [doc] = await tx.insert(docs).values(input).returning()

        return doc
    }
}
