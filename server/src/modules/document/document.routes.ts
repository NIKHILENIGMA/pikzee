import { Router } from 'express'

import { clerkMiddleware } from '@/middlewares'
import { documentController } from './document.module'
import draftRouter from '../draft/draft.routes'

const router = Router({ mergeParams: true })

/**
 * Document Routes
 * - GET /documents: List all documents
 * - POST /documents: Create a new document
 */
router
    .route('/')
    .get(clerkMiddleware, documentController.list)
    .post(clerkMiddleware, documentController.create)

/**
 * Document Routes with ID
 * - GET /documents/:id: Get a document by ID
 * - DELETE /documents/:id: Delete a document by ID
 */
router
    .route('/:id')
    .get(clerkMiddleware, documentController.findById)
    .delete(clerkMiddleware, documentController.delete)

/**
 * Additional Document Routes
 * - PATCH /documents/:id/archive: Archive a document
 * - PATCH /documents/:id/restore: Restore an archived document
 * - PATCH /documents/:id/share: Share or revoke sharing of a document
 * - PUT /documents/:id/visibility: Update document visibility
 */
router.route('/:id/archive').patch(clerkMiddleware, documentController.archive)

router.route('/:id/restore').patch(clerkMiddleware, documentController.restore)

router.route('/:id/visibility').put(clerkMiddleware, documentController.changeVisibility)

router
    .route('/:id/share')
    .get(documentController.getPublicDocument) // public route to access shared document
    .patch(clerkMiddleware, documentController.share)

/**
 * Draft Routes
 *
 */
router.use('/:docId/drafts', draftRouter)

export default router
