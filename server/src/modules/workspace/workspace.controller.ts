import { Request, Response } from 'express'
import { workspaceService } from './workspace.service'
import { ApiResponse, InternalServerError, StandardError, UnauthorizedError } from '@/util'
import { ValidationService } from '@/lib'
import { createWorkspaceSchema, updateWorkspaceSchema, workspaceIdSchema } from './workspace.validator'

export class WorkspaceController {
    async getUserWorkspaces(req: Request, res: Response) {
        try {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const workspaces = await workspaceService.getUserWorkspaces(userId)

            return ApiResponse(req, res, 200, 'List of user workspaces', workspaces)
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }
            throw new InternalServerError(
                `Failed to fetch user workspaces potential reason might be: ${(error as Error)?.message}`,
                'workspaceController.getUserWorkspaces'
            )
        }
    }

    async getWorkspaceById(req: Request, res: Response) {
        try {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId } = ValidationService.validateParams(req.params, workspaceIdSchema)

            const workspace = await workspaceService.getWorkspaceById(workspaceId, userId)

            return ApiResponse(req, res, 200, 'Workspace details', workspace)
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new InternalServerError('Failed to fetch workspace details', 'workspaceController.getWorkspaceById')
        }
    }

    async createWorkspace(req: Request, res: Response) {
        try {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const validatedInput = ValidationService.validateBody(req.body, createWorkspaceSchema)

            const newWorkspace = await workspaceService.createWorkspace({
                name: validatedInput.name,
                logoUrl: validatedInput.logoUrl || null,
                ownerId: userId
            })

            return ApiResponse(req, res, 201, 'Workspace created successfully', newWorkspace)
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new InternalServerError(
                `Failed to create workspace potential reason might be: ${(error as Error)?.message}`,
                'workspaceController.createWorkspace'
            )
        }
    }

    async updateWorkspace(req: Request, res: Response) {
        const userId: string | undefined = req.user?.id
        if (!userId) {
            throw new UnauthorizedError('User not authenticated')
        }

        try {
            const { workspaceId } = ValidationService.validateParams(req.params, workspaceIdSchema)

            const { name, logoUrl } = ValidationService.validateBody(req.body, updateWorkspaceSchema)

            const updatedWorkspace = await workspaceService.updateWorkspace(workspaceId, userId, {
                name,
                logoUrl
            })

            return ApiResponse(req, res, 200, 'Workspace updated successfully', updatedWorkspace)
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new InternalServerError(
                `Failed to update workspace potential reason might be: ${(error as Error)?.message}`,
                'workspaceController.updateWorkspace'
            )
        }
    }

    async deleteWorkspace(req: Request, res: Response) {
        const userId: string | undefined = req.user?.id
        if (!userId) {
            throw new UnauthorizedError('User not authenticated')
        }
        const { workspaceId } = ValidationService.validateParams(req.params, workspaceIdSchema)

        try {
            await workspaceService.deleteWorkspace(workspaceId, userId)

            return ApiResponse(req, res, 200, 'Workspace deleted successfully', {})
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new InternalServerError(
                `Failed to delete workspace potential reason might be: ${(error as Error)?.message}`,
                'workspaceController.deleteWorkspace'
            )
        }
    }

    async getWorkspaceUsage(req: Request, res: Response) {
        const userId: string | undefined = req.user?.id
        if (!userId) {
            throw new UnauthorizedError('User not authenticated')
        }
        const { workspaceId } = ValidationService.validateParams(req.params, workspaceIdSchema)

        try {
            const usageData = await workspaceService.getWorkspaceUsage(workspaceId, userId)

            return ApiResponse(req, res, 200, 'Workspace usage data', usageData)
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }
            throw new InternalServerError(
                `Failed to fetch workspace usage data potential reason might be: ${(error as Error)?.message}`,
                'workspaceController.getWorkspaceUsage'
            )
        }
    }
}

export const workspaceController = new WorkspaceController()
