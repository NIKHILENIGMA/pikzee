import { google } from 'googleapis'

import { googleConfig } from '@/config/google'
import { BadRequestError, DatabaseError, InternalServerError } from '@/util/StandardError'

import { IPublishRepository } from './smart-publish.repository'
import { Platforms, SocialAccountDTO, SocialAccountRecord } from './smart-publish.types'

import { IWorkspaceRepository } from '../workspace/workspace.repository'

export interface IPublishService {
    getAuthUrl(userId: string, platform: Platforms): string
    generateYoutubeAuthUrl(userId: string): string
    verifyYoutubeAccountCode(userId: string, code: string): Promise<void>
    listSocialAccounts(workspaceId: string): Promise<SocialAccountDTO[]>
}

export class SmartPublishService implements IPublishService {
    constructor(
        private readonly smartPublishRepository: IPublishRepository,
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly config: typeof googleConfig
    ) {}

    getAuthUrl(userId: string, platform: Platforms): string {
        switch (platform) {
            case 'YOUTUBE': {
                return this.generateYoutubeAuthUrl(userId)
            }
            // case 'TWITTER':
            //     return this.generateTwitterAuthUrl(userId)
            // case 'LINKEDIN':
            //     return this.generateLinkedInAuthUrl(userId)
            default:
                throw new BadRequestError('Unsupported platform', 'UNSUPPORTED_PLATFORM')
        }
    }

    generateYoutubeAuthUrl(userId: string): string {
        const oauth2Client = this.getOAuthClient()

        return oauth2Client.generateAuthUrl({
            access_type: 'offline', // Request refresh token
            scope: [...this.config.youtube.scopes],
            state: userId,
            prompt: 'consent' // Force consent screen to ensure refresh token is received
        })
    }

    async verifyYoutubeAccountCode(userId: string, code: string): Promise<void> {
        const oauth2Client = this.getOAuthClient()

        // Exchange the authorization code for access and refresh tokens
        const { tokens } = await oauth2Client.getToken(code)
        if (!tokens.access_token)
            throw new InternalServerError('Token exchange failed', 'TOKEN_EXCHANGE_FAILED')

        // Authorize the client with the obtained tokens to get user info
        oauth2Client.setCredentials(tokens)

        // Initialize YouTube API client to fetch channel info (to get platformUserId and accountName)
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

        const response = await youtube.channels.list({
            part: ['snippet', 'contentDetails'],
            mine: true // Fetch the authenticated user's channel
        })

        const channel = response.data.items?.[0]
        if (!channel) {
            throw new BadRequestError('Channel not found', 'YOUTUBE_CHANNEL_FETCH_FAILED')
        }

        const activeWorkspace = await this.workspaceRepository.getActiveWorkspace(userId)
        if (!activeWorkspace) {
            throw new DatabaseError('Active workspace not found for user', 'WORKSPACE_NOT_FOUND')
        }

        await this.smartPublishRepository.saveTokens({
            workspaceId: activeWorkspace.id,
            platform: 'YOUTUBE',
            platformUserId: channel.id ?? 'unknown-id',
            platformAvatarUrl:
                channel.snippet?.thumbnails?.high?.url ||
                channel.snippet?.thumbnails?.default?.url ||
                '',
            accountName: channel.snippet?.title ?? 'Unknown Channel',
            accessToken: tokens.access_token || '',
            refreshToken: tokens.refresh_token || '',
            accessTokenExpiresAt: tokens.expiry_date ? tokens.expiry_date : null,
            createdBy: userId
        })
    }

    async listSocialAccounts(workspaceId: string): Promise<SocialAccountDTO[]> {
        const accounts = await this.smartPublishRepository.listSocialAccounts(workspaceId)

        return accounts.map((account: SocialAccountRecord) => ({
            id: account.id,
            workspaceId: account.workspaceId,
            status: account.status,
            platform: account.platform,
            platformUserId: account.platformUserId,
            accountName: account.accountName,
            createdAt: account.createdAt
        }))
    }

    private getOAuthClient() {
        return new google.auth.OAuth2(
            this.config.youtube.clientId,
            this.config.youtube.clientSecret,
            this.config.youtube.redirectUri
        )
    }
}

// Todo: Remember to implement token storage and refreshing logic for YouTube API access tokens.
// const youtube = google.youtube({
//     version: 'v3',
//     auth: oauth2Client
// })

// youtube.videos.insert({
//     part: ['snippet,status'],
//     requestBody: {
//         snippet: {
//             title: 'Test Video',
//             description: 'This is a test video upload from the Smart Publish Service'
//         },
//         status: {
//             privacyStatus: 'private'
//         }
//     },
//     media: {
//         body: Buffer.from('Test video content')
//     }
// })
