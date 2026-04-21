import { NextFunction, Request, Response } from 'express'

import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { ProjectIdParamSchema } from '../projects/project.validator'

import { GetContentsResponse, IAssetService } from './asset.service'
import {
    CreateAssetSchema,
    ConfirmAssetUploadSchema,
    GetFolderContentsQuerySchema
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

    // Create new Asset
    // create = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<AssetDTO>> => {
    //         const userId: string | undefined = req.user?.id
    //         if (!userId) {
    //             throw new UnauthorizedError('User not authenticated')
    //         }
    //         // Validate request params against schema
    //         const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

    //         // Validate request query against schema
    //         const query = ValidationService.validateQuery(req.query, CreateAssetQuerySchema)

    //         // Validate request body against schema
    //         const body = ValidationService.validateBody<CreateAssetDTO>(req.body, CreateAssetSchema)

    //         // Create the asset
    //         const newAsset = await this.assetService.create(
    //             userId,
    //             params.projectId,
    //             query.parentAssetId === undefined ? null : query.parentAssetId,
    //             body
    //         )

    //         // Return standardized response
    //         return this.createResponse<AssetDTO>({
    //             statusCode: STATUS_CODE.CREATED,
    //             message: 'Asset created successfully',
    //             data: newAsset
    //         })
    //     })
    // }

    // renameAsset = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<AssetDTO>> => {
    //         const userId: string | undefined = req.user?.id
    //         if (!userId) {
    //             throw new UnauthorizedError('User not authenticated')
    //         }

    //         // Validate request params against schema
    //         const params = ValidationService.validateParams(req.params, AssetIdParamSchema)
    //         // Validate request body against schema
    //         const body = ValidationService.validateBody(req.body, RenameAssetSchema)

    //         // Rename the asset
    //         await this.assetService.rename(userId, {
    //             assetId: params.assetId,
    //             projectId: params.projectId,
    //             newAssetName: body.newAssetName
    //         })

    //         // Return standardized response
    //         return this.createResponse<AssetDTO>({
    //             statusCode: STATUS_CODE.OK,
    //             message: 'Asset renamed successfully',
    //             data: {} as AssetDTO
    //         })
    //     })
    // }

    // deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
    //         const userId: string | undefined = req.user?.id
    //         if (!userId) {
    //             throw new UnauthorizedError('User not authenticated')
    //         }
    //         // Validate request params against schema
    //         const params = ValidationService.validateParams(req.params, AssetIdParamSchema)

    //         // Delete the asset
    //         await this.assetService.delete(userId, params.assetId)

    //         // Return standardized response
    //         return this.createResponse<null>({
    //             statusCode: STATUS_CODE.OK,
    //             message: 'Asset deleted successfully',
    //             data: null
    //         })
    //     })
    // }

    // moveAssets = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
    //         const userId: string | undefined = req.user?.id
    //         if (!userId) {
    //             throw new UnauthorizedError('User not authenticated')
    //         }

    //         // Validate request params against schema
    //         const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

    //         // Validate request body against schema
    //         const body = ValidationService.validateBody(req.body, AssetBatchOperationSchema)

    //         // Move the assets
    //         await this.assetService.moveAssets({
    //             userId,
    //             projectId: params.projectId,
    //             assetIds: body.assetIds,
    //             targetParentId: body.targetParentId
    //         })

    //         // Return standardized response
    //         return this.createResponse<null>({
    //             statusCode: STATUS_CODE.OK,
    //             message: 'Move assets - To be implemented',
    //             data: null
    //         })
    //     })
    // }

    // copyAssets = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
    //         const userId: string | undefined = req.user?.id
    //         if (!userId) {
    //             throw new UnauthorizedError('User not authenticated')
    //         }

    //         // Validate request params against schema
    //         const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

    //         // Validate request body against schema
    //         const body = ValidationService.validateBody(req.body, AssetBatchOperationSchema)

    //         // Copy the assets
    //         await this.assetService.copyAssets({
    //             userId,
    //             projectId: params.projectId,
    //             assetIds: body.assetIds,
    //             targetParentId: body.targetParentId
    //         })

    //         // Return standardized response
    //         return this.createResponse<null>({
    //             statusCode: STATUS_CODE.OK,
    //             message: 'Copy assets - To be implemented',
    //             data: null
    //         })
    //     })
    // }

    // // List all assets
    // listAssetsByParentId = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(
    //         req,
    //         res,
    //         next,
    //         async (): Promise<SuccessResponse<AssetDTO[]>> => {
    //             const userId: string | undefined = req.user?.id
    //             if (!userId) {
    //                 throw new UnauthorizedError('User not authenticated')
    //             }

    //             // Use the dedicated ListAssetsQuerySchema for validation
    //             const query = ValidationService.validateQuery(req.query, ListAssetsQuerySchema)
    //             const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

    //             const assets = await this.assetService.listAssetsByParentId(
    //                 params.projectId,
    //                 query.parentAssetId === undefined ? null : query.parentAssetId
    //             )

    //             return this.createResponse<AssetDTO[]>({
    //                 statusCode: STATUS_CODE.OK,
    //                 message: 'Assets retrieved successfully',
    //                 data: assets
    //             })
    //         }
    //     )
    // }

    // getAssetDetails = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<AssetDTO>> => {
    //         // Validate request params against schema
    //         const params = ValidationService.validateParams(req.params, AssetIdParamSchema)

    //         // Fetch asset details
    //         const asset = await this.assetService.getById(params)

    //         // Return standardized response
    //         return this.createResponse<AssetDTO>({
    //             statusCode: STATUS_CODE.OK,
    //             message: 'Get asset details - To be implemented',
    //             data: asset
    //         })
    //     })
    // }
}
