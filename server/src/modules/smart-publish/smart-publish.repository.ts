import { socialAccounts } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'
import { CreateSocialAccountRecord, SocialAccountRecord } from './smart-publish.types'
import { and, desc, eq } from 'drizzle-orm'

export interface IPublishRepository {
    saveTokens(record: CreateSocialAccountRecord): Promise<void>
    listSocialAccounts(workspaceId: string): Promise<SocialAccountRecord[]>
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
            createdBy: record.createdBy
        })
    }

    async listSocialAccounts(workspaceId: string): Promise<SocialAccountRecord[]> {
        return await this.db
            .select()
            .from(socialAccounts)
            .where(and(eq(socialAccounts.workspaceId, workspaceId)))
            .orderBy(desc(socialAccounts.createdAt))
    }
}
