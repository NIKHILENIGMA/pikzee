/**
 * DocumentController
 *
 * This controller handles all HTTP requests related to document resources, including listing, retrieving,
 * creating, updating, and deleting documents. It ensures that requests are authenticated, validates input,
 * and delegates business logic to the document service layer.
 *
 * Each method is designed to:
 *   - Authenticate the user
 *   - Validate request parameters, query, and body
 *   - Call the appropriate service method
 *   - Return a standardized API response
 */

import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { IDocService } from './document.service'
import {
    ChangeVisibilityBodySchema,
    CreateDocumentBodySchema,
    DocumentParamsSchema,
    DocumentQuerySchema,
    DocumentShareQuerySchema,
    SharedDocumentBodySchema
} from './document.validator'
import { CreateDocumentDTO, Document, DocumentDTO } from './document.types'

export class DocumentController extends BaseController {
    constructor(private service: IDocService) {
        super()
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        /**
         * List all documents for a given workspace.
         *
         * - Requires user authentication.
         * - Validates query for workspaceId.
         * - Returns an array of documents for the workspace.
         */
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

                // Fetch documents for the specified workspace using the service layer
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
        /**
         * Retrieve a single document by its ID for a given workspace.
         *
         * - Requires user authentication.
         * - Validates params for document ID and query for workspaceId.
         * - Returns the document if found and accessible by the user.
         */
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<DocumentDTO>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
                }

                const params = ValidationService.validateParams(req.params, DocumentParamsSchema)
                const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

                // Fetch the document by ID, ensuring user has access
                const document = await this.service.findById(params.id, userId, query.workspaceId)

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Document retrieved successfully',
                    data: document
                })
            }
        )
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        /**
         * Create a new document in a workspace.
         *
         * - Requires user authentication.
         * - Validates query for workspaceId and body for document data.
         * - Returns the created document.
         */
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<CreateDocumentDTO>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
                }

                // Validate query first to ensure workspaceId is present before validating body
                const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

                // Validate body after query to ensure workspaceId is available for any workspace-specific validation rules
                const body = ValidationService.validateBody(req.body, CreateDocumentBodySchema)

                // Create the document using the service layer
                const createdDocument: CreateDocumentDTO = await this.service.create({
                    title: body.title,
                    workspaceId: query.workspaceId,
                    createdBy: userId,
                    visibility: body.visibility || 'workspace' // Default to 'workspace' if not provided
                })

                // Return the created document in the response
                return this.createResponse({
                    statusCode: STATUS_CODE.CREATED,
                    message: 'Document created successfully',
                    data: createdDocument
                })
            }
        )
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        /**
         * Delete a document by its ID for a given workspace.
         *
         * - Requires user authentication.
         * - Validates params for document ID and query for workspaceId.
         * - Returns a success response with null data.
         */
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
            }

            const params = ValidationService.validateParams(req.params, DocumentParamsSchema)
            const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

            // Delete the document using the service layer
            await this.service.delete(params.id, {
                userId,
                workspaceId: query.workspaceId
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Document deleted successfully',
                data: null
            })
        })
    }

    archive = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
            }

            const params = ValidationService.validateParams(req.params, DocumentParamsSchema)

            const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

            await this.service.archive(params.id, {
                userId,
                workspaceId: query.workspaceId
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Document archived successfully',
                data: null
            })
        })
    }

    restore = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
            }

            const params = ValidationService.validateParams(req.params, DocumentParamsSchema)

            const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

            await this.service.restore(params.id, {
                userId,
                workspaceId: query.workspaceId
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Document restored successfully',
                data: null
            })
        })
    }

    share = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<{ token: string | null }>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
                }

                // Validate params, query, and body for sharing document
                const params = ValidationService.validateParams(req.params, DocumentParamsSchema)

                const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

                const body = ValidationService.validateBody(req.body, SharedDocumentBodySchema)

                // Share or revoke sharing of the document using the service layer, which returns the new share token if generated
                const sharedToken = await this.service.share(params.id, {
                    userId,
                    workspaceId: query.workspaceId,
                    action: body.action
                })

                // Return a success response indicating the document was shared or unshared successfully
                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Document shared successfully',
                    data: { token: sharedToken.token }
                })
            }
        )
    }

    changeVisibility = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated', 'UNAUTHORIZED')
            }

            // Validate params, query, and body for changing document visibility
            const params = ValidationService.validateParams(req.params, DocumentParamsSchema)

            const query = ValidationService.validateQuery(req.query, DocumentQuerySchema)

            const body = ValidationService.validateBody(req.body, ChangeVisibilityBodySchema)

            // Update document visibility using the service layer
            await this.service.changeVisibility(params.id, {
                userId,
                workspaceId: query.workspaceId,
                visibility: body.visibility
            })

            // Return a success response indicating the visibility was updated
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Document visibility updated successfully',
                data: null
            })
        })
    }

    getPublicDocument = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<DocumentDTO>> => {
                const params = ValidationService.validateParams(req.params, DocumentParamsSchema)

                const query = ValidationService.validateQuery(req.query, DocumentShareQuerySchema)
                // Fetch the public document by ID using the service layer
                const document = await this.service.getPublicDocument(params.id, {
                    workspaceId: query.workspaceId,
                    token: query.token
                })

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Public document retrieved successfully',
                    data: document
                })
            }
        )
    }
}
