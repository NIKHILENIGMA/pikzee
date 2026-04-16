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

router
    .route('/:draftId/cover-image/position')
    .patch(clerkMiddleware, draftController.updateCoverImagePosition)

router
    .route('/:draftId/cover-image')
    .post(clerkMiddleware, draftController.addCoverImage)
    .patch(clerkMiddleware, draftController.updateCoverImage)

router
    .route('/:draftId/emoji')
    .patch(clerkMiddleware, draftController.changeIcon)

router.route('/:draftId/content').patch(clerkMiddleware, draftController.content)

router.route('/:draftId/settings').patch(clerkMiddleware, draftController.settings)

export default router
