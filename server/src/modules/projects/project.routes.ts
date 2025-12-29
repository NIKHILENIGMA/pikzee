import { Router } from 'express'
import { projectController } from './project.module'
import { clerkMiddleware } from '@/middlewares/clerk/clerk.middleware'
import { assetRouter } from '@/modules/assets'

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

router.route('/:projectId/soft-delete').post(clerkMiddleware, projectController.softDeletion)

router.route('/:projectId/status').patch(clerkMiddleware, projectController.changeStatus)

// Nested asset routes under projects
router.use('/:projectId/assets', clerkMiddleware, assetRouter)

export default router
