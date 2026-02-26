import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { IDocService } from './document.service'
import {
    CreateDocumentBodySchema,
    DeleteDocumentParamsSchema,
    ListDocumentsQuerySchema,
    UpdateDocumentBodySchema,
    UpdateDocumentParamsSchema
} from './document.validator'
import { Document } from './document.types'

export class DocumentController extends BaseController {
    constructor(private service: IDocService) {
        super()
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<Document[]>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
                }

                const query = ValidationService.validateQuery(req.params, ListDocumentsQuerySchema)

                const documents = await this.service.findAll(query.workspaceId)

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Documents retrieved successfully',
                    data: documents
                })
            }
        )
    }

    findById = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<Document>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
            }

            const params = ValidationService.validateParams(req.params, DeleteDocumentParamsSchema)

            const document = await this.service.findById(params.id, params.workspaceId)

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Document retrieved successfully',
                data: document
            })
        })
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<Document>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
            }

            const body = ValidationService.validateBody(req.body, CreateDocumentBodySchema)

            const document = await this.service.create(body)

            return this.createResponse({
                statusCode: STATUS_CODE.CREATED,
                message: 'Document created successfully',
                data: document
            })
        })
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<Document>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
            }

            const params = ValidationService.validateParams(req.params, UpdateDocumentParamsSchema)
            const body = ValidationService.validateBody(req.body, UpdateDocumentBodySchema)

            const document = await this.service.update(params.id, body.workspaceId, {
                title: body.title
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Document updated successfully',
                data: document
            })
        })
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
            }

            const params = ValidationService.validateParams(req.params, DeleteDocumentParamsSchema)

            await this.service.delete(params.id, params.workspaceId)

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Document deleted successfully',
                data: null
            })
        })
    }
}

