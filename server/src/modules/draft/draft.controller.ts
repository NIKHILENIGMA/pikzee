import { NextFunction, Request, Response } from 'express'
import { BaseController, ValidationService } from '@/lib'

import { IDraftService } from './draft.service'
import {
    DraftContentBodySchema,
    DraftEmojiBodySchema,
    DraftListParamsSchema,
    DraftParamsSchema,
    DraftQuerySchema,
    DraftRepositionBodySchema,
    DraftSettingBodySchema,
    DraftUpdateCoverImageBodySchema,
    GenerateContentBodySchema
} from './draft.validator'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { Draft, DraftDTO, DraftSidebarDTO } from './draft.types'
import { InternalServerError, UnauthorizedError } from '@/util'
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
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<DraftDTO>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new Error('User not authenticated')
            }
            const params = ValidationService.validateParams(req.params, DraftParamsSchema)

            const draft: DraftDTO = await this.service.findById(params.draftId, params.docId)

            return this.createResponse({
                statusCode: 200,
                message: 'Draft retrieved successfully',
                data: draft
            })
        })
    }

    getSidebar = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<DraftSidebarDTO[]>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const params = ValidationService.validateParams(req.params, DraftListParamsSchema)

                const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

                const sidebarData = await this.service.getSidebar({
                    userId,
                    workspaceId: query.workspaceId,
                    docId: params.docId
                })

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Draft sidebar data retrieved successfully',
                    data: sidebarData
                })
            }
        )
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

    addCoverImage = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            // Validate request parameters, body, and query
            const params = ValidationService.validateParams(req.params, DraftParamsSchema)
            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

            // Fetch a random photo from Unsplash based on a theme (e.g., nature)
            const theme: string[] = ['nature', 'technology', 'abstract', 'city', 'space']
            const randomTheme: string = theme[Math.floor(Math.random() * theme.length)]

            const photo = await this.unsplash.getRandomPhoto(randomTheme)
            if (!photo) {
                throw new InternalServerError('Failed to fetch cover image from Unsplash')
            }

            const imageUrl =
                photo.urls.regular ??
                'https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww'

            // Perform add cover image operation
            await this.service.addCoverImage(params.draftId, {
                userId,
                workspaceId: query.workspaceId,
                imageUrl
            })

            // Return standardized response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft cover image added successfully',
                data: null
            })
        })
    }

    updateCoverImage = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            // Validate request parameters, body, and query
            const params = ValidationService.validateParams(req.params, DraftParamsSchema)
            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)
            const body = ValidationService.validateBody(req.body, DraftUpdateCoverImageBodySchema)

            // Perform update cover image operation
            await this.service.updateCoverImage(params.draftId, {
                userId,
                workspaceId: query.workspaceId,
                imageUrl: body.coverImageUrl,
                type: body.type
            })

            // Return standardized response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft cover image updated successfully',
                data: null
            })
        })
    }

    updateCoverImagePosition = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            // Validate request parameters, body, and query
            const params = ValidationService.validateParams(req.params, DraftParamsSchema)
            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)
            const body = ValidationService.validateBody(req.body, DraftRepositionBodySchema)

            // Perform update cover image position operation
            await this.service.updateCoverImagePosition(params.draftId, {
                userId,
                workspaceId: query.workspaceId,
                positionY: body.positionY
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft cover image position updated successfully',
                data: null
            })
        })
    }

    removeCoverImage = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            // Validate request parameters and query
            const params = ValidationService.validateParams(req.params, DraftParamsSchema)
            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

            // Perform remove cover image operation
            await this.service.removeCoverImage(params.draftId, {
                userId,
                workspaceId: query.workspaceId
            })

            // Return standardized response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft cover image removed successfully',
                data: null
            })
        })
    }

    addIcon = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            const params = ValidationService.validateParams(req.params, DraftParamsSchema)

            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

            const body = ValidationService.validateBody(req.body, DraftEmojiBodySchema)

            await this.service.addIcon(params.draftId, {
                userId,
                workspaceId: query.workspaceId,
                icon: body.icon
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft icon added successfully',
                data: null
            })
        })
    }

    updateIcon = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            const params = ValidationService.validateParams(req.params, DraftParamsSchema)
            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)
            const body = ValidationService.validateBody(req.body, DraftEmojiBodySchema)

            await this.service.updateIcon(params.draftId, {
                userId,
                workspaceId: query.workspaceId,
                icon: body.icon
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft icon updated successfully',
                data: null
            })
        })
    }

    removeIcon = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            const params = ValidationService.validateParams(req.params, DraftParamsSchema)
            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)

            await this.service.removeIcon(params.draftId, {
                userId,
                workspaceId: query.workspaceId
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft icon removed successfully',
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
