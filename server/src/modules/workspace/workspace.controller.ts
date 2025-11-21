import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'

import { WorkspaceService } from './workspace.service'
import { CreateWorkspaceSchema, UpdateWorkspaceSchema, WorkspaceIdSchema } from './workspace.validator'

export class WorkspaceController extends BaseController {
    constructor(private workspaceService: WorkspaceService) {
        super()
    }

    getUserWorkspaces = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const workspaces = await this.workspaceService.getUserWorkspaces(userId)

            return {
                statusCode: 200,
                message: 'List of user workspaces',
                data: workspaces
            }
        })
    }

    getWorkspaceById = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId } = ValidationService.validateParams(req.params, WorkspaceIdSchema)

            const workspace = await this.workspaceService.getWorkspaceById(workspaceId, userId)

            return {
                statusCode: 200,
                message: 'Workspace details',
                data: workspace
            }
        })
    }

    getWorkspaceUsage = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }
            const { workspaceId } = ValidationService.validateParams(req.params, WorkspaceIdSchema)

            const usageData = await this.workspaceService.getWorkspaceUsage(workspaceId, userId)

            return {
                statusCode: 200,
                message: 'Workspace usage data',
                data: usageData
            }
        })
    }

    createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const validatedInput = ValidationService.validateBody(req.body, CreateWorkspaceSchema)

            const newWorkspace = await this.workspaceService.createWorkspace({
                name: validatedInput.name,
                logoUrl: validatedInput.logoUrl || null,
                ownerId: userId
            })

            return {
                statusCode: 201,
                message: 'Workspace created successfully',
                data: newWorkspace
            }
        })
    }

    updateWorkspace = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId } = ValidationService.validateParams(req.params, WorkspaceIdSchema)

            const { name, logoUrl } = ValidationService.validateBody(req.body, UpdateWorkspaceSchema)
            const updatedWorkspace = await this.workspaceService.updateWorkspace(workspaceId, userId, {
                name,
                logoUrl
            })

            return {
                statusCode: 200,
                message: 'Workspace updated successfully',
                data: updatedWorkspace
            }
        })
    }
}
