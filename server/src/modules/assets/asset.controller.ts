import { NextFunction, Request, Response } from 'express'

import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { ProjectIdParamSchema } from '../projects/project.validator'

import { GetContentsResponse, IAssetService } from './asset.service'
import {
    CreateAssetSchema,
    ConfirmAssetUploadSchema,
    GetFolderContentsQuerySchema,
    UpdateItemSchema,
    AssetIdParamSchema,
    FolderIdParamSchema
} from './asset.validator'

export class AssetController extends BaseController {
    constructor(private readonly assetService: IAssetService) {
        super()
    }

    generatePresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<{ url: string; assetId: string }>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                // Validate request params against schema
                const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)
                // Validate request body against schema
                const body = ValidationService.validateBody(req.body, CreateAssetSchema)

                // Generate presigned URL and create asset record with status "PENDING"
                const { uploadUrl, assetId } = await this.assetService.createAsset(userId, {
                    projectId: params.projectId,
                    folderId: body.folderId || null,
                    filename: body.filename,
                    mimeType: body.mimeType,
                    sizeBytes: body.sizeBytes
                })

                return this.createResponse({
                    statusCode: STATUS_CODE.CREATED,
                    message: 'Presigned URL generated successfully',
                    data: {
                        url: uploadUrl,
                        assetId: assetId
                    }
                })
            }
        )
    }

    confirmAssetUpload = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const body = ValidationService.validateBody(req.body, ConfirmAssetUploadSchema)

            await this.assetService.confirmAssetUpload(body.assetId)

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Asset upload confirmed successfully',
                data: null
            })
        })
    }

    getFolderContents = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<GetContentsResponse>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)
                const query = ValidationService.validateQuery(
                    req.query,
                    GetFolderContentsQuerySchema
                )

                const folderContents = await this.assetService.getFolderContents({
                    userId,
                    projectId: params.projectId,
                    folderId: query.folderId || null
                })

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Get folder contents - To be implemented',
                    data: folderContents
                })
            }
        )
    }

    makeFolder = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<{ id: string }>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }
                // Validate request params and body
                const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)
                const body = req.body as { name: string; parentId?: string | null }
                if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
                    throw new Error('Folder name is required')
                }

                // Call service to create folder
                const folder = await this.assetService.createFolder(userId, {
                    projectId: params.projectId,
                    parentId: body.parentId ?? null,
                    name: body.name.trim()
                })

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'Folder created successfully',
                    data: { id: folder.id }
                })
            }
        )
    }

    updateAsset = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const params = ValidationService.validateParams(req.params, AssetIdParamSchema)
            const body = ValidationService.validateBody(req.body, UpdateItemSchema)

            await this.assetService.updateAsset(userId, params.projectId, params.assetId, {
                name: body.name,
                folderId: body.folderId
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Asset updated successfully',
                data: null
            })
        })
    }

    updateFolder = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const params = ValidationService.validateParams(req.params, FolderIdParamSchema)
            const body = ValidationService.validateBody(req.body, UpdateItemSchema)

            await this.assetService.updateFolder(userId, params.projectId, params.folderId, {
                name: body.name,
                parentId: body.parentId
            })

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Folder updated successfully',
                data: null
            })
        })
    }

    deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const params = ValidationService.validateParams(req.params, AssetIdParamSchema)

            await this.assetService.deleteAsset(userId, params.projectId, params.assetId)

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Asset deleted successfully',
                data: null
            })
        })
    }

    deleteFolder = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const params = ValidationService.validateParams(req.params, FolderIdParamSchema)

            await this.assetService.deleteFolder(userId, params.projectId, params.folderId)

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Folder deleted successfully',
                data: null
            })
        })
    }
}
