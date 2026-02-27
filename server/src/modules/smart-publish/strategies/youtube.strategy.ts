import { google } from 'googleapis'

import { googleConfig } from '@/config/google'
import { BadRequestError, DatabaseError, InternalServerError } from '@/util/StandardError'
import { decrypt, encrypt } from '@/lib/encrypt-decrypt'
import { SECRETE_KEY } from '@/config'
import Uploader from '../../uploader/uploader.service'

import { SocialAccountRecord, SocialPostRecord } from '../smart-publish.types'
import { IPublishRepository } from '../smart-publish.repository'
import { IWorkspaceRepository } from '../../workspace/workspace.repository'
import { BasePlatformStrategy } from './platform.strategy'

type OAuth2Client = InstanceType<typeof google.auth.OAuth2>

export class YouTubeStrategy extends BasePlatformStrategy {
    constructor(
        private readonly smartPublishRepository: IPublishRepository,
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly config: typeof googleConfig
    ) {
        super('YOUTUBE')
    }

    getAuthUrl(userId: string): string {
        const oauth2Client = this.getOAuthClient()

        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [...this.config.youtube.scopes],
            state: userId,
            prompt: 'consent'
        })
    }

    async verifyAuth(userId: string, code: string): Promise<void> {
        const oauth2Client = this.getOAuthClient()
        // console.log(`Exchanging code for tokens for user ${userId} on YouTube`)
        const { tokens } = await oauth2Client.getToken(code)
        if (!tokens.access_token) {
            throw new InternalServerError('Token exchange failed', 'TOKEN_EXCHANGE_FAILED')
        }

        oauth2Client.setCredentials(tokens)

        const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

        const response = await youtube.channels.list({
            part: ['snippet', 'contentDetails', 'brandingSettings'],
            mine: true
        })

        // console.log(`Fetched channel details for user ${userId} on YouTube: ${JSON.stringify(response.data)}`)

        const channel = response.data.items?.[0]
        if (!channel) {
            throw new BadRequestError('Channel not found', 'YOUTUBE_CHANNEL_FETCH_FAILED')
        }

        const activeWorkspace = await this.workspaceRepository.getActiveWorkspace(userId)
        if (!activeWorkspace) {
            throw new DatabaseError('Active workspace not found for user', 'WORKSPACE_NOT_FOUND')
        }

        const encryptedRefreshToken = encrypt(tokens.refresh_token || '', SECRETE_KEY)

        await this.smartPublishRepository.saveTokens({
            workspaceId: activeWorkspace.id,
            platform: 'YOUTUBE',
            platformUserId: channel.id ?? 'unknown-id',
            avatarUrl:
                channel.snippet?.thumbnails?.high?.url ||
                channel.snippet?.thumbnails?.default?.url ||
                null,
            coverUrl: channel.brandingSettings?.image?.bannerExternalUrl || '',
            accountName: channel.snippet?.title ?? 'Unknown Channel',
            accessToken: tokens.access_token || '',
            refreshToken: encryptedRefreshToken,
            accessTokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
            userId: userId
        })
        // console.log(`Successfully connected YouTube account for user ${userId}, channel: ${channel.snippet?.title}`)
    }

    async publish(post: SocialPostRecord, account: SocialAccountRecord): Promise<string> {
        const oauth2Client = await this.getAuthenticatedClient(account)
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

        const streams = await Uploader('S3').s3Stream(post.platformPostId!)

        try {
            const response = await youtube.videos.insert({
                part: ['snippet', 'status'],
                requestBody: {
                    snippet: {
                        title: post.title,
                        description: post.description || '',
                        tags: (post.tags as string[]) || []
                    },
                    status: {
                        privacyStatus: post.visibility.toLowerCase()
                    }
                },
                media: {
                    mimeType: 'video/mp4',
                    body: streams
                }
            })

            if (!response.data.id) {
                throw new InternalServerError('YouTube upload failed', 'YOUTUBE_UPLOAD_FAILED')
            }

            return response.data.id
        } finally {
            if (streams && typeof (streams as any).destroy === 'function') {
                ;(streams as any).destroy()
            }
        }
    }

    async revoke(accountId: string): Promise<void> {
        await this.smartPublishRepository.revokeTokens(accountId, 'YOUTUBE')
    }

    private async getAuthenticatedClient(account: SocialAccountRecord): Promise<OAuth2Client> {
        const oauth2Client = this.getOAuthClient()

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken
                ? decrypt(account.refreshToken, SECRETE_KEY)
                : undefined
        })

        // Check if token is expired or will expire in the next 5 minutes
        const isExpired = account.accessTokenExpiresAt
            ? new Date(account.accessTokenExpiresAt).getTime() < Date.now() + 5 * 60 * 1000
            : true

        if (isExpired) {
            const { credentials } = await oauth2Client.refreshAccessToken()

            await this.smartPublishRepository.updateTokens(account.id, {
                accessToken: credentials.access_token || '',
                accessTokenExpiresAt: credentials.expiry_date
                    ? new Date(credentials.expiry_date)
                    : null
            })

            oauth2Client.setCredentials(credentials)
        }

        return oauth2Client
    }

    private getOAuthClient() {
        return new google.auth.OAuth2(
            this.config.youtube.clientId,
            this.config.youtube.clientSecret,
            this.config.youtube.redirectUri
        )
    }
}
