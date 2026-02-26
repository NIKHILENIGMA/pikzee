import { NextFunction, Request, Response } from 'express'
import { BaseController, ValidationService } from '@/lib'

import { IDraftService } from './draft.service'
import {
    CreateDraftBodySchema,
    DraftByIdParamsSchema,
    GenerateContentBodySchema,
    ListDraftsParamsSchema,
    UpdateDraftBodySchema
} from './draft.validator'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { Draft } from './draft.types'

export class DraftController extends BaseController {
    constructor(private readonly draftService: IDraftService) {
        super()
    }

    findALl = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<Draft[]>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new Error('User not authenticated')
            }

            const params = ValidationService.validateParams(req.params, ListDraftsParamsSchema)

            // TODO: Add authorization check to ensure user has access to the document
            const drafts = await this.draftService.findAll(params.docId)

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
            const params = ValidationService.validateParams(req.params, DraftByIdParamsSchema)

            // TODO: Add authorization check to ensure user has access to the document and draft
            const draft = await this.draftService.findById(params.id, params.docId)

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

            const body = ValidationService.validateBody(req.body, CreateDraftBodySchema)
            const draft = await this.draftService.create({ ...body, ownerId: userId })

            return this.createResponse({
                statusCode: STATUS_CODE.CREATED,
                message: 'Draft created successfully',
                data: draft
            })
        })
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<Draft>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new Error('User not authenticated')
            }
            const params = ValidationService.validateParams(req.params, DraftByIdParamsSchema)
            const body = ValidationService.validateBody(req.body, UpdateDraftBodySchema)

            const draft = await this.draftService.update(params.id, {
                ...body,
                lastUpdatedBy: userId
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Draft updated successfully',
                data: draft
            })
        })
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const params  = ValidationService.validateParams(req.params, DraftByIdParamsSchema)
            await this.draftService.delete(params.id)

            return this.createResponse({
                statusCode: 204,
                message: 'Draft deleted successfully',
                data: null
            })
        })
    }

    generateContent = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<string | null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new Error('User not authenticated')
            }

            const { prompt } = ValidationService.validateBody(
                req.body,
                GenerateContentBodySchema
            )

            const content = await this.draftService.generateContent(prompt)

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Content generated successfully',
                data: content
            })
        })
    }
}

