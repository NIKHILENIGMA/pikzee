import { Router } from 'express'
import { adminController } from './admin.controller'
import { clerkMiddleware } from '@/middlewares/clerk/clerk.middleware'

const router = Router()

router.route('/details').get(clerkMiddleware, adminController.userDetails)

export default router
