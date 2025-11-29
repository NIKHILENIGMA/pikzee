import { Request, Response } from 'express'
import { adminService } from './admin.service'
import { NotFoundError, UnauthorizedError } from '@/util/StandardError'
import { ApiResponse } from '@/util/ApiResponse'
import { BaseController } from '@/lib'

export class AdminController extends BaseController {
    constructor() {
        super()
    }

    userDetails = async (req: Request, res: Response) => {
        const userId = req.user?.id
        if (!userId) {
            throw new UnauthorizedError('User not authenticated')
        }

        const [user] = await adminService.getUserById(userId)
        if (!user) {
            throw new NotFoundError('User not found', 'adminController.userDetails')
        }

        return ApiResponse(req, res, 200, 'Admin user details', {
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            avatarUrl: user?.avatarUrl,
            createdAt: user?.createdAt,
            updatedAt: user?.updatedAt
        })
    }
}

export const adminController = new AdminController()
