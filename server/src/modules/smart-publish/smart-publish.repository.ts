import { socialAccounts } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'
import { CreateSocialAccountRecord, Platforms, SocialAccountRecord } from './smart-publish.types'
import { and, desc, eq } from 'drizzle-orm'

export interface IPublishRepository {
    saveTokens(record: CreateSocialAccountRecord): Promise<void>
    listSocialAccounts(workspaceId: string): Promise<SocialAccountRecord[]>
    revokeTokens(id: string, platform: Platforms): Promise<void>
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

    async listSocialAccounts(workspaceId: string): Promise<SocialAccountRecord[]> {
        return await this.db
            .select()
            .from(socialAccounts)
            .where(and(eq(socialAccounts.workspaceId, workspaceId), eq(socialAccounts.status, 'CONNECTED')))
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
}
