import { Router } from 'express'

import { clerkMiddleware } from '@/middlewares'
import { documentController } from './document.module'

const router = Router({ mergeParams: true }) // receives workspaceId from parent

router
    .route('/')
    .get(clerkMiddleware, documentController.list)
    .post(clerkMiddleware, documentController.create)

router
    .route('/:id')
    .get(clerkMiddleware, documentController.findById)
    .patch(clerkMiddleware, documentController.update)
    .delete(clerkMiddleware, documentController.delete)

// Nest draft routes under a doc
// router.use('/:id/drafts', draftRouter)

export { router as docRouter }
