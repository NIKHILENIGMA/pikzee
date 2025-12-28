import { Router } from 'express'
import { projectController } from './project.module'
import { clerkMiddleware } from '@/middlewares/clerk/clerk.middleware'

const router = Router()

router
    .route('/')
    .post(clerkMiddleware, projectController.create)
    .get(clerkMiddleware, projectController.listAll)

router
    .route('/:projectId')
    .get(clerkMiddleware, projectController.getById)
    .patch(clerkMiddleware, projectController.update)
    .delete(clerkMiddleware, projectController.delete)

router.route('/:projectId/status').patch(clerkMiddleware, projectController.changeStatus)

export default router
