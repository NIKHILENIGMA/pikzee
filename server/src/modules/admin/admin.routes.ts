import { Router } from 'express'

import { clerkMiddleware } from '@/middlewares'

import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { UserService } from './user.service'

const router = Router()

const userService = new UserService()
const adminService = new AdminService(userService)
const adminController = new AdminController(adminService)

router.route('/users').get(clerkMiddleware, adminController.listUsers).post(clerkMiddleware, adminController.createUser)

router
    .route('/users/:id')
    .get(clerkMiddleware, adminController.findUserById)
    .patch(clerkMiddleware, adminController.updateUserDetails)
    .delete(clerkMiddleware, adminController.deleteUserAccount)

export default router
