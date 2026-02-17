import { NextFunction, Request, Response } from 'express'

import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'
import { UnauthorizedError } from '@/util'

import {
    ConnectSocialAccountParamsSchema,
    ListSocialAccountsBodySchema,
    VerifySocialAccountTokenBodySchema
} from './smart-publish.validator'
import { smartPublishService } from './smart-publish.module'
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
                    ConnectSocialAccountParamsSchema
                )
                await Promise.resolve() // Placeholder for any async operations needed in the future
                const url: string = smartPublishService.getAuthUrl(userId, params.platform)

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Social account connected successfully',
                    data: { url }
                })
            }
        )
    }

    verifySocialAccountToken = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const body = ValidationService.validateBody(
                req.body,
                VerifySocialAccountTokenBodySchema
            )

            await smartPublishService.verifyYoutubeAccountCode(userId, body.code)

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Social account verified and connected successfully',
                data: null
            })
        })
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
                const body: ListSocialAccountsBody = ValidationService.validateBody(req.body, ListSocialAccountsBodySchema)

                // Fetch the list of connected social accounts for the workspace
                const accounts: SocialAccountDTO[] = await this.service.listSocialAccounts(
                    body.workspaceId
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
}
