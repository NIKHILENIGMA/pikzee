import { NextFunction, Request, Response } from 'express'
import { BaseController, ValidationService } from '@/lib'

import { IDraftService } from './draft.service'
import {
    DraftContentBodySchema,
    DraftListParamsSchema,
    DraftParamsSchema,
    DraftQuerySchema,
    DraftSettingBodySchema,
    DraftVisualBodySchema,
    GenerateContentBodySchema
} from './draft.validator'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { Draft } from './draft.types'
import { UnauthorizedError } from '@/util'
import { IUnsplashService } from '@/config/unsplash/unsplash'

export class DraftController extends BaseController {
    constructor(
        private readonly service: IDraftService,
        private readonly unsplash: IUnsplashService
    ) {
        super()
    }

    findALl = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<Draft[]>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new Error('User not authenticated')
            }

            const params = ValidationService.validateParams(req.params, DraftListParamsSchema)

            const drafts = await this.service.findAll(params.docId)

            // Return standardized response
            return this.createResponse({
                statusCode: 200,
                message: 'Drafts retrieved successfully',
                data: drafts
            })
        })
    }

    findById = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<Draft>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new Error('User not authenticated')
            }
            const params = ValidationService.validateParams(req.params, DraftParamsSchema)

            const draft = await this.service.findById(params.draftId, params.draftId)

            return this.createResponse({
                statusCode: 200,
                message: 'Draft retrieved successfully',
                data: draft
            })
        })
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<Draft>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new Error('User not authenticated')
            }

            // Validate request parameters, and query
            const params = ValidationService.validateParams(req.params, DraftListParamsSchema)

            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

            // Call the service to create the draft
            const draft = await this.service.create(userId, query.workspaceId, {
                docId: params.docId,
                ownerId: userId,
                lastUpdatedBy: userId
            })

            // Return standardized response
            return this.createResponse({
                statusCode: STATUS_CODE.CREATED,
                message: 'Draft created successfully',
                data: draft
            })
        })
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            const params = ValidationService.validateParams(req.params, DraftParamsSchema)

            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

            await this.service.delete(params.draftId, {
                userId,
                docId: params.docId,
                workspaceId: query.workspaceId
            })

            return this.createResponse({
                statusCode: STATUS_CODE.NO_CONTENT,
                message: 'Draft deleted successfully',
                data: null
            })
        })
    }

    content = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            // Validate request parameters, body, and query
            const params = ValidationService.validateParams(req.params, DraftParamsSchema)

            const body = ValidationService.validateBody(req.body, DraftContentBodySchema)

            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

            // Perform content update
            await this.service.content(params.draftId, {
                userId,
                workspaceId: query.workspaceId,
                docId: params.docId,
                content: {
                    title: body.title,
                    content: body.content,
                    lastUpdatedBy: userId
                }
            })

            // Return standardized response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft content updated successfully',
                data: null
            })
        })
    }

    visual = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            // Validate request parameters, body, and query
            const params = ValidationService.validateParams(req.params, DraftParamsSchema)

            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

            const body = ValidationService.validateBody(req.body, DraftVisualBodySchema)

            let finalUrl = body.coverImageUrl
            let finalType = body.type ?? 'unsplash'

            // If user wants a cover but didn't provide a URL, fetch a random one
            if (!finalUrl && !body.icon) {
                // TODO: Replace with your actual Unsplash API service call
                finalUrl =
                    (await this.unsplash.getRandomPhoto('nature'))?.urls.regular ??
                    'https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww'
            }

            await this.service.visual(params.draftId, {
                userId,
                workspaceId: query.workspaceId,
                icon: body.icon ?? null,
                finalUrl: finalUrl ?? null,
                finalType: finalType,
                positionY: body.coverImageConfig?.y
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft visuals updated successfully',
                data: null
            })
        })
    }

    settings = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            // Validate request parameters, body, and query
            const params = ValidationService.validateParams(req.params, DraftParamsSchema)

            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

            const body = ValidationService.validateBody(req.body, DraftSettingBodySchema)

            await this.service.setting(
                params.draftId,
                {
                    userId,
                    workspaceId: query.workspaceId
                },
                body
            )

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft settings updated successfully',
                data: null
            })
        })
    }

    generateContent = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<string | null>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new Error('User not authenticated')
                }

                const { prompt } = ValidationService.validateBody(
                    req.body,
                    GenerateContentBodySchema
                )

                const content = await this.service.generateContent(prompt)

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Content generated successfully',
                    data: content
                })
            }
        )
    }
}
