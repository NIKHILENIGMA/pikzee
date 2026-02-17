import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { IProjectService } from './project.service'
import {
    ChangeProjectStatusSchema,
    CreateProjectSchema,
    GetProjectSchema,
    ProjectIdParamSchema,
    RenameProjectSchema,
    UpdateProjectSchema
} from './project.validator'
import { GetProjectDTO, ProjectDTO } from './project.types'

export class ProjectController extends BaseController {
    constructor(private readonly projectService: IProjectService) {
        super()
    }

    // List all workspaces for a user
    create = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const body = ValidationService.validateBody(
                {
                    ...req.body,
                    projectOwnerId: userId
                },
                CreateProjectSchema
            )

            await this.projectService.create(body)

            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'User projects created successfully',
                data: null
            })
        })
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate params and body
            const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)
            const body = ValidationService.validateBody(req.body, UpdateProjectSchema)

            // Call the service to update the project
            await this.projectService.update(params.projectId, userId, body)

            // Return success response
            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'Project updated successfully',
                data: null
            })
        })
    }

    changeStatus = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate params and body
            const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)
            const body = ValidationService.validateBody(req.body, ChangeProjectStatusSchema)

            await this.projectService.changeStatus({
                projectId: params.projectId,
                userId: userId,
                status: body.status
            })

            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'Project status changed successfully',
                data: null
            })
        })
    }

    rename = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate params and body
            const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)
            const body = ValidationService.validateBody(req.body, RenameProjectSchema)
            // Call the service to rename the project
            await this.projectService.renameProject({
                projectId: params.projectId,
                userId: userId,
                newName: body.newName
            })

            // Return success response
            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'Project renamed successfully',
                data: null
            })
        })
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

            await this.projectService.delete(params.projectId, userId)

            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'Project deleted successfully',
                data: null
            })
        })
    }

    softDeletion = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

            await this.projectService.softDelete(params.projectId, userId)

            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'Project deleted successfully',
                data: null
            })
        })
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<ProjectDTO>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const params = ValidationService.validateParams(req.params, ProjectIdParamSchema)

                const project = await this.projectService.getById(params.projectId)

                return this.createResponse<ProjectDTO>({
                    statusCode: STATUS_CODE.OK,
                    message: 'Project retrieved successfully',
                    data: project
                })
            }
        )
    }

    getByWorkspace = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<ProjectDTO[]>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const body = ValidationService.validateBody<GetProjectDTO>(
                    req.body,
                    GetProjectSchema
                )

                const projects = await this.projectService.listAll(body.workspaceId)

                return this.createResponse<ProjectDTO[]>({
                    statusCode: STATUS_CODE.OK,
                    message: 'Projects retrieved successfully',
                    data: projects
                })
            }
        )
    }

    listAll = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<ProjectDTO[]>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const body = ValidationService.validateBody(req.body, GetProjectSchema)

                const projects = await this.projectService.listAll(body.workspaceId)

                return this.createResponse<ProjectDTO[]>({
                    statusCode: STATUS_CODE.OK,
                    message: 'Projects listed successfully',
                    data: projects
                })
            }
        )
    }
}
