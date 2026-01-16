import { NextFunction, Request, Response } from 'express'

import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { ProjectIdParamSchema } from '../projects/project.validator'

import { AssetDTO, CreateAssetDTO } from './asset.types'
import {
    AssetBatchOperationSchema,
    AssetIdParamSchema,
    CreateAssetQuerySchema,
    CreateAssetSchema,
    ListAssetsQuerySchema,
    RenameAssetSchema
} from './asset.validator'
import { IAssetService } from './asset.service'

export class AssetController extends BaseController {
    constructor(private readonly assetService: IAssetService) {
        super()
    }

    // Create new Asset
    create = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<AssetDTO>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }
            // Validate request params against schema
            const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

            // Validate request query against schema
            const query = ValidationService.validateQuery(req.query, CreateAssetQuerySchema)

            // Validate request body against schema
            const body = ValidationService.validateBody<CreateAssetDTO>(req.body, CreateAssetSchema)

            // Create the asset
            const newAsset = await this.assetService.create(
                userId,
                params.projectId,
                query.parentAssetId === undefined ? null : query.parentAssetId,
                body
            )

            // Return standardized response
            return this.createResponse<AssetDTO>({
                statusCode: STATUS_CODE.CREATED,
                message: 'Asset created successfully',
                data: newAsset
            })
        })
    }

    renameAsset = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<AssetDTO>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request params against schema
            const params = ValidationService.validateParams(req.params, AssetIdParamSchema)
            // Validate request body against schema
            const body = ValidationService.validateBody(req.body, RenameAssetSchema)

            // Rename the asset
            await this.assetService.rename(userId, {
                assetId: params.assetId,
                projectId: params.projectId,
                newAssetName: body.newAssetName
            })

            // Return standardized response
            return this.createResponse<AssetDTO>({
                statusCode: STATUS_CODE.OK,
                message: 'Asset renamed successfully',
                data: {} as AssetDTO
            })
        })
    }

    deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }
            // Validate request params against schema
            const params = ValidationService.validateParams(req.params, AssetIdParamSchema)

            // Delete the asset
            await this.assetService.delete(userId, params.assetId)

            // Return standardized response
            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'Asset deleted successfully',
                data: null
            })
        })
    }

    moveAssets = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request params against schema
            const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

            // Validate request body against schema
            const body = ValidationService.validateBody(req.body, AssetBatchOperationSchema)

            // Move the assets
            await this.assetService.moveAssets({
                userId,
                projectId: params.projectId,
                assetIds: body.assetIds,
                targetParentId: body.targetParentId
            })

            // Return standardized response
            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'Move assets - To be implemented',
                data: null
            })
        })
    }

    copyAssets = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request params against schema
            const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

            // Validate request body against schema
            const body = ValidationService.validateBody(req.body, AssetBatchOperationSchema)

            // Copy the assets
            await this.assetService.copyAssets({
                userId,
                projectId: params.projectId,
                assetIds: body.assetIds,
                targetParentId: body.targetParentId
            })

            // Return standardized response
            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'Copy assets - To be implemented',
                data: null
            })
        })
    }

    // List all assets
    listAssetsByParentId = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<AssetDTO[]>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                // Use the dedicated ListAssetsQuerySchema for validation
                const query = ValidationService.validateQuery(req.query, ListAssetsQuerySchema)
                const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

                const assets = await this.assetService.listAssetsByParentId(
                    params.projectId,
                    query.parentAssetId === undefined ? null : query.parentAssetId
                )

                return this.createResponse<AssetDTO[]>({
                    statusCode: STATUS_CODE.OK,
                    message: 'Assets retrieved successfully',
                    data: assets
                })
            }
        )
    }

    getAssetDetails = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<AssetDTO>> => {
            // Validate request params against schema
            const params = ValidationService.validateParams(req.params, AssetIdParamSchema)

            // Fetch asset details
            const asset = await this.assetService.getById(params)

            // Return standardized response
            return this.createResponse<AssetDTO>({
                statusCode: STATUS_CODE.OK,
                message: 'Get asset details - To be implemented',
                data: asset
            })
        })
    }
}

