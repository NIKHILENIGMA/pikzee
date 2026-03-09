import { Router } from 'express'

import { clerkMiddleware } from '@/middlewares'

import { draftController } from './draft.module'

const router = Router({ mergeParams: true })

router
    .route('/')
    .post(clerkMiddleware, draftController.create)
    .get(clerkMiddleware, draftController.findALl)

router.route('/sidebar').get(clerkMiddleware, draftController.getSidebar)

router
    .route('/:draftId')
    .get(clerkMiddleware, draftController.findById)
    .delete(clerkMiddleware, draftController.delete)

router.route('/:draftId/content').patch(clerkMiddleware, draftController.content)

router.route('/:draftId/visual').patch(clerkMiddleware, draftController.visual)

router.route('/:draftId/settings').patch(clerkMiddleware, draftController.settings)

export default router
