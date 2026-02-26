import { SocialAccountRecord, SocialPostRecord, Platforms } from '../smart-publish.types'

export interface IPlatformStrategy {
    getAuthUrl(userId: string): string
    verifyAuth(userId: string, code: string): Promise<void>
    publish(post: SocialPostRecord, account: SocialAccountRecord): Promise<string>
    revoke(accountId: string): Promise<void>
}

export abstract class BasePlatformStrategy implements IPlatformStrategy {
    constructor(protected readonly platform: Platforms) {}

    abstract getAuthUrl(userId: string): string
    abstract verifyAuth(userId: string, code: string): Promise<void>
    abstract publish(post: SocialPostRecord, account: SocialAccountRecord): Promise<string>
    abstract revoke(accountId: string): Promise<void>
}
