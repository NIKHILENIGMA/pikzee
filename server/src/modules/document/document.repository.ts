import { and, desc, eq, sql } from 'drizzle-orm'

import { docs, drafts } from '@/core/db/schema/document'
import { DatabaseConnection } from '@/core/db/service/database.service'

import { CreateDocument, Document, DocumentVisibility } from './document.types'
import { users } from '@/core'

export interface IDocRepository {
    findAll(workspaceId: string, limit?: number, page?: number): Promise<Document[]>
    findDocById(id: string, workspaceId: string): Promise<Document | null>
    findById(id: string, workspaceId: string): Promise<DocumentWithDrafts | null>
    create(input: CreateDocument): Promise<Document>
    update(id: string, data: Partial<Document>): Promise<Document>
    delete(id: string): Promise<Document | null>
    restore(id: string, workspaceId: string): Promise<Document | null>
    share(id: string, record: { workspaceId: string; token: string | null }): Promise<string | null>
    transaction<T>(callback: (tx: DatabaseConnection) => Promise<T>): Promise<T>
    createDocumentTransaction(tx: DatabaseConnection, input: CreateDocument): Promise<Document>
    visibility(
        id: string,
        record: { workspaceId: string; visibility: 'private' | 'workspace' | 'public' }
    ): Promise<Document | null>
    getPublicDocument(
        id: string,
        options: { workspaceId: string; token: string }
    ): Promise<DocumentWithDrafts | null>
}

interface DocumentWithDrafts {
    docs: {
        id: string
        workspaceId: string
        title: string
        docImgUrl: string | null
        permission: 'private' | 'workspace' | 'public'
        shareToken: string | null
        isArchived: boolean
        archivedAt: Date | null
        createdBy: string
        createdAt: Date
        updatedAt: Date
    }
    drafts: {
        id: string
        docId: string
        title: string | null
        content: unknown
        icon: string | null
        coverImageUrl: string | null
        coverImageConfig: {
            type: 'S3' | 'URL' | 'unsplash'
            positionY: number
            focalPoint: {
                x: number
                y: number
            }
        } | null
        settings: {
            fontStyle: string
            fontSize: string
            isFullWidth: boolean
            showCover: boolean
            showIcon: boolean
            showOwner: boolean
            showLastModified: boolean
        } | null
        ownerId: string
        lastUpdatedBy: string
        createdAt: Date
        updatedAt: Date
    } | null
}

export class DocRepository implements IDocRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async findAll(workspaceId: string, limit: number = 10, page: number = 1): Promise<Document[]> {
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
            .limit(limit)
            .offset((page - 1) * limit)
    }

    async findById(id: string, workspaceId: string): Promise<DocumentWithDrafts | null> {
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

        return result
    }

    async findDocById(id: string, workspaceId: string): Promise<Document | null> {
        const [doc] = await this.db
            .select()
            .from(docs)
            .where(and(eq(docs.id, id), eq(docs.workspaceId, workspaceId)))
            .limit(1)

        return doc || null
    }

    async create(input: CreateDocument): Promise<Document> {
        const [doc] = await this.db.insert(docs).values(input).returning()
        return doc
    }

    async update(id: string, data: Partial<Document>): Promise<Document> {
        const [updated] = await this.db
            .update(docs)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(docs.id, id), eq(docs.isArchived, false)))
            .returning()

        return updated
    }

    async delete(id: string): Promise<Document | null> {
        const [doc] = await this.db
            .delete(docs)
            .where(and(eq(docs.id, id), eq(docs.isArchived, true)))
            .returning()

        return doc ? doc : null
    }

    async restore(id: string, workspaceId: string): Promise<Document | null> {
        const [doc] = await this.db
            .update(docs)
            .set({ isArchived: false, archivedAt: null, updatedAt: new Date() })
            .where(
                and(eq(docs.id, id), eq(docs.workspaceId, workspaceId), eq(docs.isArchived, true))
            )
            .returning()
        return doc ?? null
    }

    async share(
        id: string,
        record: { workspaceId: string; token: string | null }
    ): Promise<string | null> {
        const [document] = await this.db
            .update(docs)
            .set({
                shareToken: record.token ? record.token : null,
                permission: record.token !== null ? 'public' : 'workspace'
            })
            .where(and(eq(docs.id, id), eq(docs.workspaceId, record.workspaceId)))
            .returning({
                sharedToken: docs.shareToken
            })

        return document.sharedToken ?? null
    }

    async visibility(
        id: string,
        record: { workspaceId: string; visibility: DocumentVisibility }
    ): Promise<Document | null> {
        const [document] = await this.db
            .update(docs)
            .set({
                permission: record.visibility
            })
            .where(and(eq(docs.id, id), eq(docs.workspaceId, record.workspaceId)))
            .returning()

        return document ?? null
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

    async getPublicDocument(
        id: string,
        options: { workspaceId: string; token: string }
    ): Promise<DocumentWithDrafts | null> {
        const [document] = await this.db
            .select()
            .from(docs)
            .leftJoin(drafts, eq(docs.id, drafts.docId))
            .where(
                and(
                    eq(docs.id, id),
                    eq(docs.workspaceId, options.workspaceId),
                    eq(docs.shareToken, options.token),
                    eq(docs.isArchived, false)
                )
            )
            .orderBy(drafts.createdAt)
            .limit(1)
        return document ?? null
    }
}
