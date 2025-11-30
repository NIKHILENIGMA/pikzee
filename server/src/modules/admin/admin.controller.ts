import { NextFunction, Request, Response } from 'express'

import { NotFoundError, UnauthorizedError } from '@/util/StandardError'
import { BaseController, ValidationService } from '@/lib'

import { AdminService } from './admin.service'
import { GetUserDetailsByIdSchema, UpdateUserDetailsSchema } from './admin.validator'

interface ControllerResponse<T> {
    statusCode: number
    message: string
    data: T
}

export class AdminController extends BaseController {
    constructor(private adminService: AdminService) {
        super()
    }

    findUserById = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<ControllerResponse<typeof user>> => {
            const userId = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { id } = ValidationService.validateParams(req.params, GetUserDetailsByIdSchema)

            const user = await this.adminService.getUserById(id)
            if (!user) {
                throw new NotFoundError('User not found', 'adminController.userDetails')
            }

            return {
                statusCode: 200,
                message: 'User details fetched successfully',
                data: user
            }
        })
    }

    listUsers = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<ControllerResponse<typeof users>> => {
            const users = await this.adminService.listAllUsers()

            return {
                statusCode: 200,
                message: 'List of all users',
                data: users
            }
        })
    }

    updateUserDetails = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<ControllerResponse<typeof updatedUser>> => {
            const userId = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { id } = ValidationService.validateParams(req.params, GetUserDetailsByIdSchema)

            const updateData = ValidationService.validateBody(req.body, UpdateUserDetailsSchema)

            const updatedUser = await this.adminService.updateUser(id, updateData)
            if (!updatedUser) {
                throw new NotFoundError('User not found', 'adminController.updateUserDetails')
            }

            return {
                statusCode: 200,
                message: 'User details updated successfully',
                data: updatedUser
            }
        })
    }

    deleteUserAccount = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<ControllerResponse<typeof deletedUser>> => {
            const userId = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { id } = ValidationService.validateParams(req.params, GetUserDetailsByIdSchema)

            const deletedUser = await this.adminService.deleteUser(id)
            if (!deletedUser) {
                throw new NotFoundError('User not found', 'adminController.deleteUserAccount')
            }

            return {
                statusCode: 200,
                message: 'User deleted successfully',
                data: deletedUser
            }
        })
    }
}
