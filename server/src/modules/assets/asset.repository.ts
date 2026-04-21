import { and, eq } from 'drizzle-orm'

import { assets } from '@/core/db/schema/asset.schema'
import { DatabaseConnection } from '@/core/db/service/database.service'

import { AssetRecord, CreateAssetRecord } from './asset.types'

export interface IAssetRepository {
    create(data: CreateAssetRecord): Promise<AssetRecord>
    update(id: string, data: Partial<AssetRecord>): Promise<AssetRecord>
    delete(id: string): Promise<AssetRecord>
    getById(id: string): Promise<AssetRecord | null>
    getByIdAndProjectId(id: string, projectId: string): Promise<AssetRecord | null>
    transaction<T>(callback: (tx: DatabaseConnection) => Promise<T>): Promise<T>
    createWithTransaction(tx: DatabaseConnection, data: CreateAssetRecord): Promise<AssetRecord>
    bulkCreateWithTransaction(tx: DatabaseConnection, data: CreateAssetRecord[]): Promise<AssetRecord[]>
    updateWithTransaction(
        tx: DatabaseConnection,
        assetId: string,
        data: Partial<AssetRecord>
    ): Promise<AssetRecord>

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


}
