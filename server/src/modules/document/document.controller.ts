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
import { CreateDocumentDTO, Document } from './document.types'

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

                // Validate query parameters to ensure workspaceId is present and valid
                const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

                // Fetch documents for the specified workspace using the service layer, which will handle business logic and repository interactions
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
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<CreateDocumentDTO>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
            }

            // Validate query first to ensure workspaceId is present before validating body
            const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

            //  Validate body after query to ensure workspaceId is available for any workspace-specific validation rules in the future
            const body = ValidationService.validateBody(req.body, CreateDocumentBodySchema)

            // Create the document using the service layer, which will handle business logic and repository interactions
            const createdDocument: CreateDocumentDTO = await this.service.create({
                title: body.title,
                workspaceId: query.workspaceId,
                createdBy: userId
            })

            // Return the created document in the response, including the initial draft ID if needed
            return this.createResponse({
                statusCode: STATUS_CODE.CREATED,
                message: 'Document created successfully',
                data: createdDocument
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
