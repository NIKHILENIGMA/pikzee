import { Router } from 'express'
import { smartPublishController } from './smart-publish.module'
import { clerkMiddleware } from '@/middlewares'

const router = Router()

router.post('/connect/:platform', clerkMiddleware, smartPublishController.connectSocialAccount)

router.post(
    '/disconnect/:accountId',
    clerkMiddleware,
    smartPublishController.disconnectSocialAccount
)

router.get('/callback/:platform', clerkMiddleware, smartPublishController.verifySocialAccountToken)

router.get('/list', clerkMiddleware, smartPublishController.list)

router.post(
    '/upload-video/:platform',
    clerkMiddleware,
    smartPublishController.initiateVideoUploadProcess
)
// router.get('/uploaded', clerkMiddleware, smartPublishController.listUploadedPosts)

router.post('/publish', clerkMiddleware, smartPublishController.publishToSocialMedia)

export default router
