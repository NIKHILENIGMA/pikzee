import { NextFunction, Request, Response } from 'express'

import { NotFoundError, UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import {
    CreateUserSchema,
    GetUserDetailsByIdSchema,
    UpdateUserDetailsSchema
} from './admin.validator'
import { AdminService } from './admin.service'

export class AdminController extends BaseController {
    constructor(private adminService: AdminService) {
        super()
    }

    findById = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<typeof user>> => {
                const userId = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const { id } = ValidationService.validateParams(
                    req.params,
                    GetUserDetailsByIdSchema
                )

                const user = await this.adminService.getUserById(id)
                if (!user) {
                    throw new NotFoundError('User not found', 'adminController.userDetails')
                }

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'User details fetched successfully',
                    data: user
                })
            }
        )
    }

    listUsers = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<typeof users>> => {
                const users = await this.adminService.listAllUsers()

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'List of all users',
                    data: users
                })
            }
        )
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<typeof newUser>> => {
                const userId: string | undefined = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const userData = ValidationService.validateBody(req.body, CreateUserSchema)

                const newUser = await this.adminService.createUser(userData)

                return this.createResponse({
                    statusCode: STATUS_CODE.CREATED,
                    message: 'User created successfully',
                    data: newUser
                })
            }
        )
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<typeof updatedUser>> => {
                const userId = req.user?.id
                if (!userId) {
                    throw new UnauthorizedError('User not authenticated')
                }

                const { id } = ValidationService.validateParams(
                    req.params,
                    GetUserDetailsByIdSchema
                )

                const updateData = ValidationService.validateBody(req.body, UpdateUserDetailsSchema)

                const updatedUser = await this.adminService.updateUser(id, updateData)
                if (!updatedUser) {
                    throw new NotFoundError('User not found', 'adminController.updateUserDetails')
                }

                return this.createResponse({
                    statusCode: STATUS_CODE.OK,
                    message: 'User details updated successfully',
                    data: updatedUser
                })
            }
        )
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { id } = ValidationService.validateParams(req.params, GetUserDetailsByIdSchema)

            await this.adminService.deleteUser(id)

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'User deleted successfully',
                data: null
            })
        })
    }
}
