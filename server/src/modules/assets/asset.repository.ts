import { and, asc, eq, isNull, like, sql } from 'drizzle-orm'

import { assets } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'

import { AssetRecord, CreateAssetRecord } from './asset.types'

export interface IAssetRepository {
    create(data: CreateAssetRecord): Promise<AssetRecord>
    update(id: string, data: Partial<AssetRecord>): Promise<AssetRecord>
    delete(id: string): Promise<AssetRecord>
    getById(id: string): Promise<AssetRecord | null>
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
    updateChildPaths(tx: DatabaseConnection, oldPath: string, newPath: string): Promise<void>
    updateTreePathsAndDepth(
        tx: any,
        oldPath: string,
        newPath: string,
        depthDiff: number
    ): Promise<void>
    getChildrenByPath(path: string, limit?: number): Promise<AssetRecord[]>
    listAll(workspaceId: string): Promise<AssetRecord[]>
    listAssetsByParentId(parentAssetId: string | null, projectId: string): Promise<AssetRecord[]>
    getByNameAndParentId(
        assetName: string,
        parentAssetId: string | null,
        projectId: string
    ): Promise<AssetRecord | null>
    getByIdAndProjectId(id: string, projectId: string): Promise<AssetRecord | null>
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
            .set(data)
            .where(eq(assets.id, id))
            .returning()

        return updatedAsset
    }

    async delete(id: string): Promise<AssetRecord> {
        const [deletedAsset] = await this.db.delete(assets).where(eq(assets.id, id)).returning()

        return deletedAsset
    }

    async getById(id: string): Promise<AssetRecord | null> {
        const [asset] = await this.db.select().from(assets).where(eq(assets.id, id)).limit(1)

        return asset || null
    }

    async getByIdAndProjectId(id: string, projectId: string): Promise<AssetRecord | null> {
        const [asset] = await this.db
            .select()
            .from(assets)
            .where(and(eq(assets.id, id), eq(assets.projectId, projectId)))
            .limit(1)

        return asset || null
    }

    async getChildrenByPath(path: string, limit = 1000): Promise<AssetRecord[]> {
        // 1. Sanitize input: Ensure we don't have double slashes
        const searchPath = path.endsWith('/') ? path : `${path}/`

        return await this.db
            .select()
            .from(assets)
            .where(like(assets.path, `${searchPath}%`))
            // 2. Safety Valve: Never pull 'everything' unless you're sure
            .limit(limit)
            // 3. Consistency: Always order results so the UI doesn't jump around
            .orderBy(asc(assets.path))
    }

    async listAll(projectId: string): Promise<AssetRecord[]> {
        const assetList = await this.db
            .select()
            .from(assets)
            .where(eq(assets.workspaceId, projectId))
            .execute()

        return assetList
    }

    async listAssetsByParentId(
        parentAssetId: string | null,
        projectId: string
    ): Promise<AssetRecord[]> {
        const filters = [eq(assets.projectId, projectId)]

        parentAssetId === null
            ? filters.push(isNull(assets.parentAssetId))
            : filters.push(eq(assets.parentAssetId, parentAssetId))

        return await this.db
            .select()
            .from(assets)
            .where(and(...filters))
            .orderBy(asc(assets.assetName))
    }

    async getByNameAndParentId(
        assetName: string,
        parentAssetId: string | null,
        projectId: string
    ): Promise<AssetRecord | null> {
        const [asset] = await this.db
            .select()
            .from(assets)
            .where(
                and(
                    eq(assets.assetName, assetName),
                    parentAssetId === null
                        ? isNull(assets.parentAssetId)
                        : eq(assets.parentAssetId, parentAssetId),
                    eq(assets.projectId, projectId)
                )
            )
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
            .set(data)
            .where(eq(assets.id, assetId))
            .returning()

        return updatedAsset
    }

    async updateChildPaths(
        tx: DatabaseConnection,
        oldPath: string,
        newPath: string
    ): Promise<void> {
        await tx
            .update(assets)
            .set({
                path: sql`replace(${assets.path}, ${oldPath}, ${newPath})`
            }) // Update path by replacing oldPath with newPath
            .where(like(assets.path, `${oldPath}/%`)) // Only update child assets
    }

    async updateTreePathsAndDepth(
        tx: any,
        oldPath: string,
        newPath: string,
        depthDiff: number
    ): Promise<void> {
        await tx
            .update(assets)
            .set({
                // Update path string
                path: sql`replace(${assets.path}, ${oldPath}, ${newPath})`,
                // Update depth number (e.g., +2 or -1)
                depth: sql`${assets.depth} + ${depthDiff}`
            })
            .where(like(assets.path, `${oldPath}/%`))
    }
}

