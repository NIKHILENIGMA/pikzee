import { and, eq, isNull, sql } from 'drizzle-orm'

import { assets, folders } from '@/core/db/schema/asset.schema'
import { DatabaseConnection } from '@/core/db/service/database.service'

import { AssetRecord, CreateAssetRecord } from './asset.types'

export interface IAssetRepository {
    create(data: CreateAssetRecord): Promise<AssetRecord>
    update(id: string, data: Partial<AssetRecord>): Promise<AssetRecord>
    softDelete(id: string): Promise<AssetRecord>
    getById(id: string): Promise<AssetRecord | null>
    getByIdAndProjectId(id: string, projectId: string): Promise<AssetRecord | null>
    transaction<T>(callback: (tx: DatabaseConnection) => Promise<T>): Promise<T>
    createWithTransaction(tx: DatabaseConnection, data: CreateAssetRecord): Promise<AssetRecord>
    bulkCreateWithTransaction(
        tx: DatabaseConnection,
        data: CreateAssetRecord[]
    ): Promise<AssetRecord[]>
    updateWithTransaction(
        tx: DatabaseConnection,
        assetId: string,
        data: Partial<AssetRecord>
    ): Promise<AssetRecord>
    getSubFolders(
        projectId: string,
        folderId: string | null
    ): Promise<
        {
            id: string
            projectId: string
            parentId: string | null
            name: string
            createdAt: Date
            updatedAt: Date
        }[]
    >
    getAssetsInFolder(projectId: string, folderId: string | null): Promise<AssetRecord[]>
    getBreadcrumbs(folderId: string): Promise<{ id: string; name: string }[]>
    createFolder(data: {
        projectId: string
        parentId: string | null
        name: string
    }): Promise<{ id: string }>
    getFolderById(id: string): Promise<{ id: string; projectId: string; parentId: string | null; name: string } | null>
    updateFolder(id: string, data: any): Promise<any>
    softDeleteFolder(id: string): Promise<any>
    isDescendant(folderId: string, potentialParentId: string): Promise<boolean>
}

export class AssetRepository implements IAssetRepository {
    constructor(private db: DatabaseConnection) {}

    async create(data: CreateAssetRecord): Promise<AssetRecord> {
        const [newAsset] = await this.db.insert(assets).values(data).returning()

        return newAsset
    }

    async update(id: string, data: Partial<AssetRecord>): Promise<AssetRecord> {
        const [updatedAsset] = await this.db
            .update(assets)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(assets.id, id))
            .returning()

        return updatedAsset
    }

    async softDelete(id: string): Promise<AssetRecord> {
        const [deletedAsset] = await this.db
            .update(assets)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(assets.id, id))
            .returning()

        return deletedAsset
    }

    async getById(id: string): Promise<AssetRecord | null> {
        const [asset] = await this.db
            .select()
            .from(assets)
            .where(and(eq(assets.id, id), isNull(assets.deletedAt)))
            .limit(1)

        return asset || null
    }

    async getSubFolders(
        projectId: string,
        folderId: string | null
    ): Promise<
        {
            id: string
            projectId: string
            parentId: string | null
            name: string
            createdAt: Date
            updatedAt: Date
        }[]
    > {
        const folderQuery = folderId
            ? and(eq(folders.projectId, projectId), eq(folders.parentId, folderId), isNull(folders.deletedAt))
            : and(eq(folders.projectId, projectId), isNull(folders.parentId), isNull(folders.deletedAt))

        const subfolders = await this.db.select().from(folders).where(folderQuery)

        return subfolders
    }

    async createFolder(data: { projectId: string; parentId: string | null; name: string }): Promise<{ id: string }> {
        const [newFolder] = await this.db.insert(folders).values(data).returning()

        return newFolder
    }

    async getFolderById(id: string): Promise<{ id: string; projectId: string; parentId: string | null; name: string } | null> {
        const [folder] = await this.db
            .select()
            .from(folders)
            .where(and(eq(folders.id, id), isNull(folders.deletedAt)))
            .limit(1)

        return folder || null
    }

    async updateFolder(id: string, data: any): Promise<any> {
        const [updatedFolder] = await this.db
            .update(folders)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(folders.id, id))
            .returning()

        return updatedFolder
    }

    async softDeleteFolder(id: string): Promise<any> {
        const [deletedFolder] = await this.db
            .update(folders)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(folders.id, id))
            .returning()

        return deletedFolder
    }

    async isDescendant(folderId: string, potentialParentId: string): Promise<boolean> {
        const result = await this.db.execute(sql`
            WITH RECURSIVE folder_tree AS (
                SELECT id, parent_id
                FROM folders
                WHERE id = ${potentialParentId}
                UNION ALL
                SELECT f.id, f.parent_id
                FROM folders f
                INNER JOIN folder_tree ft ON ft.id = f.parent_id
            )
            SELECT 1 FROM folder_tree WHERE id = ${folderId} LIMIT 1;
        `)
        return result.rows.length > 0
    }

    async getAssetsInFolder(projectId: string, folderId: string | null): Promise<AssetRecord[]> {
        const assetQuery = folderId
            ? and(eq(assets.projectId, projectId), eq(assets.folderId, folderId), isNull(assets.deletedAt))
            : and(eq(assets.projectId, projectId), isNull(assets.folderId), isNull(assets.deletedAt))

        const folderAssets = await this.db.select().from(assets).where(assetQuery)

        return folderAssets
    }

    async getBreadcrumbs(folderId: string): Promise<{ id: string; name: string }[]> {
        const breadcrumbResult = await this.db.execute(sql`
            WITH RECURSIVE folder_tree AS (
                SELECT id, name, parent_id
                FROM folders
                WHERE id = ${folderId}
                UNION ALL
                SELECT f.id, f.name, f.parent_id
                FROM folders f
                INNER JOIN folder_tree ft ON ft.parent_id = f.id
            )
            SELECT id, name FROM folder_tree;
            `)
        const result = breadcrumbResult.rows.reverse() as { id: string; name: string }[]

        return result
    }

    async getByIdAndProjectId(id: string, projectId: string): Promise<AssetRecord | null> {
        const [asset] = await this.db
            .select()
            .from(assets)
            .where(and(eq(assets.id, id), eq(assets.projectId, projectId), isNull(assets.deletedAt)))
            .limit(1)

        return asset || null
    }

    async transaction<T>(callback: (tx: DatabaseConnection) => Promise<T>): Promise<T> {
        return this.db.transaction(callback)
    }

    async createWithTransaction(
        tx: DatabaseConnection,
        data: CreateAssetRecord
    ): Promise<AssetRecord> {
        const [newAsset] = await tx.insert(assets).values(data).returning()

        return newAsset
    }

    async bulkCreateWithTransaction(
        tx: DatabaseConnection,
        data: CreateAssetRecord[]
    ): Promise<AssetRecord[]> {
        if (data.length === 0) return []

        const BATCH_SIZE = 500
        const createdAssets: AssetRecord[] = []

        for (let i = 0; i < data.length; i += BATCH_SIZE) {
            const batch = data.slice(i, i + BATCH_SIZE)
            const insertedAssets = await tx.insert(assets).values(batch).returning()
            createdAssets.push(...insertedAssets)
        }

        return createdAssets
    }

    async updateWithTransaction(
        tx: DatabaseConnection,
        assetId: string,
        data: Partial<AssetRecord>
    ): Promise<AssetRecord> {
        const [updatedAsset] = await tx
            .update(assets)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(assets.id, assetId))
            .returning()

        return updatedAsset
    }
}
