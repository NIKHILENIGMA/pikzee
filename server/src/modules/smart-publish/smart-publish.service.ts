import { DatabaseError } from '@/util/StandardError'

import { IPublishRepository } from './smart-publish.repository'
import {
    Platforms,
    SocialAccountDTO,
    SocialAccountRecord,
    UploadVideoBody
} from './smart-publish.types'

import Uploader from '../uploader/uploader.service'
import { getVideoPublishQueue } from '@/core/queue/video-publish.queue'
import { StrategyFactory } from './strategies/strategy.factory'

export interface IPublishService {
    getAuthUrl(userId: string, platform: Platforms): string
    verifySocialAccountToken(userId: string, platform: Platforms, code: string): Promise<void>
    listSocialAccounts(workspaceId: string): Promise<SocialAccountDTO[]>
    disconnectSocialAccount(accountId: string, platform: Platforms): Promise<void>
    prepareVideoForPlatform(
        userId: string,
        platform: Platforms,
        body: UploadVideoBody
    ): Promise<{ url: string; postId: string }>
    publishVideoS3ToSocialMedia(postId: string, platform: Platforms): Promise<void>
    processVideoPublish(videoPostId: string, platform: Platforms): Promise<void>
}

/**
 * Service for handling smart publishing to social platforms.
 */

export class SmartPublishService implements IPublishService {
    constructor(
        private readonly smartPublishRepository: IPublishRepository,
        private readonly strategyFactory: StrategyFactory
    ) {}

    /**
     * Returns the authentication URL for a given user and platform.
     */

    public getAuthUrl(userId: string, platform: Platforms): string {
        return this.strategyFactory.get(platform).getAuthUrl(userId)
    }

    /**
     * Verifies the social account token for a user and platform.
     */

    public async verifySocialAccountToken(
        userId: string,
        platform: Platforms,
        code: string
    ): Promise<void> {
        await this.strategyFactory.get(platform).verifyAuth(userId, code)
    }

    /**
     * Disconnects a social account from a platform.
     */

    public async disconnectSocialAccount(accountId: string, platform: Platforms): Promise<void> {
        await this.strategyFactory.get(platform).revoke(accountId)
    }

    /**
     * Lists all social accounts for a workspace.
     */

    public async listSocialAccounts(workspaceId: string): Promise<SocialAccountDTO[]> {
        const accounts = await this.smartPublishRepository.listSocialAccounts(workspaceId)

        return accounts.map((account: SocialAccountRecord) => ({
            id: account.id,
            status: account.status,
            platform: account.platform,
            platformUserId: account.platformUserId,
            avatarUrl: account.avatarUrl,
            coverUrl: account.coverUrl,
            accountName: account.accountName,
            createdAt: account.createdAt
        }))
    }

    /**
     * Prepares a video for upload to a social media platform by generating a presigned S3 URL and creating a database record for the upload.
     */
    async prepareVideoForPlatform(
        userId: string,
        platform: Platforms,
        body: UploadVideoBody
    ): Promise<{ url: string; postId: string }> {
        // Generate a unique S3 key for the video
        const key = `${platform.toLowerCase()}-uploads/${userId}/${Date.now()}`

        const { uploadUrl } = await Uploader('S3').getPresignedUrl({
            bucket: 'private',
            key,
            contentType: body.contentType,
            expiresIn: 900
        })

        // Store the video metadata in the database
        const post = await this.smartPublishRepository.createPostUpload({
            userId,
            workspaceId: body.workspaceId,
            platform: platform,
            platformPostId: key, // Storing the S3 key here temporarily
            socialAccountId: body.socialAccountId,
            title: body.title,
            description: body.description,
            visibility: body.visibility!,
            status: 'DRAFT'
        })

        return { url: uploadUrl, postId: post.id }
    }

    /**
     * Publishes a video from S3 to the specified social media platform by adding a job to the video publish queue. The actual publishing logic is handled in the processVideoPublish method, which is executed by a worker consuming the queue. 
     */
    public async publishVideoS3ToSocialMedia(postId: string, platform: Platforms): Promise<void> {
        await getVideoPublishQueue().add(
            'publish-video',
            {
                videoPostId: postId,
                platform: platform
            },
            {
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                },
                removeOnComplete: true,
                removeOnFail: false
            }
        )
    }

    /**
     * Processes the publishing of a video to a social media platform.
     *  
     */
    public async processVideoPublish(videoPostId: string, platform: Platforms): Promise<void> {
        const post = await this.smartPublishRepository.getSocialPostById(videoPostId)
        if (!post) {
            throw new DatabaseError('Video post not found', 'VIDEO_POST_NOT_FOUND')
        }

        const account = await this.smartPublishRepository.getAccountById(post.socialAccountId)
        if (!account) {
            throw new DatabaseError('Social account not found', 'SOCIAL_ACCOUNT_NOT_FOUND')
        }

        try {
            // Update status to UPLOADING before starting the publish process
            await this.smartPublishRepository.updatePostUpload({
                postId: videoPostId,
                updates: {
                    status: 'UPLOADING'
                }
            })

            // Publish the video to the social media platform
            const platformPostId = await this.strategyFactory.get(platform).publish(post, account)

            // Update the post record with the new status and platform post ID
            await this.smartPublishRepository.updatePostUpload({
                postId: videoPostId,
                updates: {
                    status: 'PUBLISHED',
                    platformPostId: platformPostId
                }
            })
        } catch (error) {
            await this.smartPublishRepository.updatePostUpload({
                postId: videoPostId,
                updates: {
                    status: 'FAILED'
                }
            })
            throw error // Re-throw for BullMQ retries
        }
    }
}
