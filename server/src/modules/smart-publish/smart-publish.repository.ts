import { socialAccounts, socialPosts } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'
import {
    CreateSocialAccountRecord,
    CreateSocialPostRecord,
    Platforms,
    SocialAccountRecord,
    SocialPostRecord
} from './smart-publish.types'
import { and, desc, eq } from 'drizzle-orm'

export interface IPublishRepository {
    saveTokens(record: CreateSocialAccountRecord): Promise<void>
    updateTokens(id: string, updates: Partial<SocialAccountRecord>): Promise<void>
    listSocialAccounts(workspaceId: string): Promise<SocialAccountRecord[]>
    revokeTokens(id: string, platform: Platforms): Promise<void>
    createPostUpload(params: CreateSocialPostRecord): Promise<SocialPostRecord>
    getSocialPostById(postId: string): Promise<SocialPostRecord | null>
    getAccountById(accountId: string): Promise<SocialAccountRecord | null>
    updatePostUpload(params: {
        postId: string
        updates: Partial<SocialPostRecord>
    }): Promise<SocialPostRecord>
}

export class SmartPublishRepository implements IPublishRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async saveTokens(record: CreateSocialAccountRecord): Promise<void> {
        await this.db.insert(socialAccounts).values({
            workspaceId: record.workspaceId,
            platform: record.platform,
            platformUserId: record.platformUserId,
            accountName: record.accountName,
            accessToken: record.accessToken,
            refreshToken: record.refreshToken,
            accessTokenExpiresAt: record.accessTokenExpiresAt,
            userId: record.userId,
            avatarUrl: record.avatarUrl,
            coverUrl: record.coverUrl,
            status: 'CONNECTED'
        })
    }

    async updateTokens(id: string, updates: Partial<SocialAccountRecord>): Promise<void> {
        await this.db.update(socialAccounts).set(updates).where(eq(socialAccounts.id, id))
    }

    async listSocialAccounts(workspaceId: string): Promise<SocialAccountRecord[]> {
        return await this.db
            .select()
            .from(socialAccounts)
            .where(
                and(
                    eq(socialAccounts.workspaceId, workspaceId),
                    eq(socialAccounts.status, 'CONNECTED')
                )
            )
            .orderBy(desc(socialAccounts.createdAt))
    }

    async revokeTokens(id: string, platform: Platforms): Promise<void> {
        await this.db
            .update(socialAccounts)
            .set({
                status: 'REVOKED'
            })
            .where(and(eq(socialAccounts.id, id), eq(socialAccounts.platform, platform)))
    }

    async getAccountById(accountId: string): Promise<SocialAccountRecord | null> {
        const result = await this.db
            .select()
            .from(socialAccounts)
            .where(eq(socialAccounts.id, accountId))
        return result[0] || null
    }

    async createPostUpload(params: CreateSocialPostRecord): Promise<SocialPostRecord> {
        const result = await this.db
            .insert(socialPosts)
            .values({
                workspaceId: params.workspaceId,
                platform: params.platform,
                userId: params.userId,
                socialAccountId: params.socialAccountId,
                title: params.title,
                visibility: params.visibility,
                status: params.status
            })
            .returning()

        return result[0]
    }

    async getSocialPostById(postId: string): Promise<SocialPostRecord | null> {
        const result = await this.db
            .select()
            .from(socialPosts)
            .where(and(eq(socialPosts.id, postId), eq(socialPosts.status, 'DRAFT')))

        return result[0] || null
    }

    async updatePostUpload(params: {
        postId: string
        updates: Partial<SocialPostRecord>
    }): Promise<SocialPostRecord> {
        const result = await this.db
            .update(socialPosts)
            .set(params.updates)
            .where(eq(socialPosts.id, params.postId))
            .returning()
        return result[0]
    }
}
