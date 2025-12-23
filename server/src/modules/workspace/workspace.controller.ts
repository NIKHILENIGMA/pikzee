import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import {
    CreateWorkspaceSchema,
    UpdateWorkspaceSchema,
    WorkspaceIdSchema
} from './workspace.validator'
import { IWorkspaceService } from './workspace.service'
import { CreateWorkspaceRequest, WorkspaceDTO } from './workspace.types'

export class WorkspaceController extends BaseController {
    constructor(private readonly workspaceService: IWorkspaceService) {
        super()
    }

    // List all workspaces for a user
    list = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<WorkspaceDTO[]>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const workspaces = await this.workspaceService.listAll(userId)

                return this.createResponse<WorkspaceDTO[]>({
                    statusCode: STATUS_CODE.OK,
                    message: 'User workspaces fetched successfully',
                    data: workspaces
                })
            }
        )
    }

    // Get workspace by ID
    getById = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<WorkspaceDTO>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                // Validate path params
                const { workspaceId } = ValidationService.validateParams(
                    req.params,
                    WorkspaceIdSchema
                )

                const workspace = await this.workspaceService.getById(workspaceId, userId)

                return this.createResponse<WorkspaceDTO>({
                    statusCode: STATUS_CODE.OK,
                    message: 'Workspace details fetched successfully',
                    data: workspace
                })
            }
        )
    }

    getActiveWorkspace = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<WorkspaceDTO>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }
                const workspace = await this.workspaceService.getActiveWorkspace(userId)

                return this.createResponse<WorkspaceDTO>({
                    statusCode: STATUS_CODE.OK,
                    message: 'Active workspace fetched successfully',
                    data: workspace
                })
            }
        )
    }

    me = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<WorkspaceDTO>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }
                const workspace = await this.workspaceService.getMyWorkspace(userId)
                return this.createResponse<WorkspaceDTO>({
                    statusCode: STATUS_CODE.OK,
                    message: 'My workspace fetched successfully',
                    data: workspace
                })
            }
        )
    }

    // Create new workspace
    create = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<WorkspaceDTO>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                // Validate request body against schema
                const body = ValidationService.validateBody<CreateWorkspaceRequest>(
                    req.body,
                    CreateWorkspaceSchema
                )

                // Create the workspace
                const newWorkspace = await this.workspaceService.create({
                    ...body,
                    ownerId: userId
                })

                // Return standardized response
                return this.createResponse<WorkspaceDTO>({
                    statusCode: STATUS_CODE.CREATED,
                    message: 'Workspace created successfully',
                    data: newWorkspace
                })
            }
        )
    }

    // Update workspace
    update = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<WorkspaceDTO>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                // Validate path params
                const { workspaceId } = ValidationService.validateParams(
                    req.params,
                    WorkspaceIdSchema
                )
                // Validate request body
                const body = ValidationService.validateBody(req.body, UpdateWorkspaceSchema)

                // Update the workspace
                const updatedWorkspace = await this.workspaceService.update(workspaceId, {
                    ...body,
                    ownerId: userId
                })

                // Return standardized response
                return this.createResponse<WorkspaceDTO>({
                    statusCode: STATUS_CODE.OK,
                    message: 'Workspace updated successfully',
                    data: updatedWorkspace
                })
            }
        )
    }

    // Delete workspace
    delete = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<{ workspaceId: string }>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }
                // Validate path params
                const { workspaceId } = ValidationService.validateParams(
                    req.params,
                    WorkspaceIdSchema
                )
                // Soft delete the workspace
                await this.workspaceService.softDelete({
                    workspaceId,
                    userId
                })

                // Return standardized response
                return this.createResponse<{ workspaceId: string }>({
                    statusCode: STATUS_CODE.OK,
                    message: 'Workspace deleted successfully',
                    data: { workspaceId }
                })
            }
        )
    }
}
