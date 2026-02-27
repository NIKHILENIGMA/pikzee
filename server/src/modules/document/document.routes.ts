import { Router } from 'express'

import { clerkMiddleware } from '@/middlewares'
import { documentController } from './document.module'
import draftRouter from '../draft/draft.routes'

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
router.use('/:docId/drafts', draftRouter)

export default router
