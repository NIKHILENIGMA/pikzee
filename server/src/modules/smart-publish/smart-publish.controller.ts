import { NextFunction, Request, Response } from 'express'

import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'
import { UnauthorizedError } from '@/util'

import {
    ListSocialAccountsQuerySchema,
    SocialAccountTokenQuerySchema,
    DisconnectSocialAccountParamsSchema,
    SocialAccountParamsSchema,
    UploadVideoBodySchema,
    ConfirmUploadBodySchema
} from './smart-publish.validator'

import { IPublishService } from './smart-publish.service'
import { ListSocialAccountsBody, SocialAccountDTO } from './smart-publish.types'

export class SmartPublishController extends BaseController {
    constructor(private readonly service: IPublishService) {
        super()
    }

    connectSocialAccount = (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<{ url: string }>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const params = ValidationService.validateParams(
                    req.params,
                    SocialAccountParamsSchema
                )
                await Promise.resolve() // Placeholder for any async operations needed in the future
                const url: string = this.service.getAuthUrl(userId, params.platform)

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Social account connected successfully',
                    data: { url }
                })
            }
        )
    }

    verifySocialAccountToken = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<
                SuccessResponse<{
                    success: boolean
                }>
            > => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const params = ValidationService.validateParams(
                    req.params,
                    SocialAccountParamsSchema
                )

                // Validate query parameters
                const query = ValidationService.validateQuery(
                    req.query,
                    SocialAccountTokenQuerySchema
                )

                // Verify the social account token and connect the account if valid
                await this.service.verifySocialAccountToken(userId, params.platform, query.code)

                // Return success response
                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Social account verified and connected successfully',
                    data: { success: true }
                })
            }
        )
    }

    disconnectSocialAccount = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate path parameters
            const params = ValidationService.validateParams(
                req.params,
                DisconnectSocialAccountParamsSchema
            )

            const body = ValidationService.validateBody(req.body, SocialAccountParamsSchema)

            // Revoke the tokens and mark the social account as disconnected in the database
            await this.service.disconnectSocialAccount(params.accountId, body.platform)

            // Return success response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Social account disconnected successfully',
                data: null
            })
        })
    }

    initiateVideoUploadProcess = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<{ url: string; postId: string }>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                // Validate path parameters and request body
                const params = ValidationService.validateParams(
                    req.params,
                    SocialAccountParamsSchema
                )

                // Depending on the platform, prepare the video upload process and get the upload URL or necessary details
                const body = ValidationService.validateBody(req.body, UploadVideoBodySchema)

                // Call the service method to prepare the video upload process for the specified platform
                const result = await this.service.prepareVideoForPlatform(
                    userId,
                    params.platform,
                    body
                )

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: `Video uploaded successfully on the ${params.platform} platform`,
                    data: result
                })
            }
        )
    }

    publishToSocialMedia = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<{ success: boolean }>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const body = ValidationService.validateBody(req.body, ConfirmUploadBodySchema)

                await this.service.publishVideoS3ToSocialMedia(body.postId, body.platform)

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: `Video published successfully on ${body.platform}`,
                    data: { success: true }
                })
            }
        )
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<SocialAccountDTO[]>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                // Validate body parameters
                const query: ListSocialAccountsBody = ValidationService.validateQuery(
                    req.query,
                    ListSocialAccountsQuerySchema
                )

                // Fetch the list of connected social accounts for the workspace
                const accounts: SocialAccountDTO[] = await this.service.listSocialAccounts(
                    query.workspaceId
                )

                // Return the list of accounts in the response
                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'List of connected social accounts',
                    data: accounts
                })
            }
        )
    }

    // listUploadedPosts = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<any>> => {
    //         const userId: string | undefined = req.user?.id
    //         if (!userId) {
    //             throw new UnauthorizedError('User not authenticated')
    //         }

    //         const query: ListUploadedPostsQuery = ValidationService.validateQuery(
    //             req.query,
    //             ListUploadedPostsQuerySchema
    //         )

    //         const posts = await this.service.listUploadedPosts(userId, query)

    //         return this.createResponse({
    //             statusCode: STATUS_CODE.OK,
    //             message: 'List of uploaded posts',
    //             data: posts
    //         })
    //     })
    // }
}
