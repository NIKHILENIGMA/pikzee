import { Router } from 'express'

import { clerkMiddleware } from '@/middlewares'

import { draftController } from './draft.module'

const router = Router()

router.post('/drafts/generate-content', clerkMiddleware, draftController.generateContent)

router
    .route('/documents/:docId/drafts')
    .post(clerkMiddleware, draftController.create)
    .get(clerkMiddleware, draftController.findALl)

router
    .route('/documents/:docId/drafts/:id')
    .get(clerkMiddleware, draftController.findById)
    .put(clerkMiddleware, draftController.update)
    .delete(clerkMiddleware, draftController.delete)

export default router