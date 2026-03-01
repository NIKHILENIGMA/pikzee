import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { IDocService } from './document.service'
import {
    CreateDocumentBodySchema,
    DocumentParamsSchema,
    DocumentQuerySchema,
    UpdateDocumentBodySchema
} from './document.validator'
import { Document } from './document.types'
// import { logger } from '@/config'

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

                const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

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

            const params = ValidationService.validateParams(req.params, DocumentParamsSchema)
            const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

            const document = await this.service.findById(params.id, query.workspaceId)

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

            //
            const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

            //
            const body = ValidationService.validateBody(req.body, CreateDocumentBodySchema)

            const document = await this.service.create({
                title: body.title,
                workspaceId: query.workspaceId,
                createdBy: userId
            })

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

            const params = ValidationService.validateParams(req.params, DocumentParamsSchema)
            const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)
            const body = ValidationService.validateBody(req.body, UpdateDocumentBodySchema)

            const document = await this.service.update(params.id, query.workspaceId, {
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

            const params = ValidationService.validateParams(req.params, DocumentParamsSchema)

            const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

            await this.service.delete(params.id, query.workspaceId)

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Document deleted successfully',
                data: null
            })
        })
    }
}
