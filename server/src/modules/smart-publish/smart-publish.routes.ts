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

router.post('/callback', clerkMiddleware, smartPublishController.verifySocialAccountToken)

router.get('/list', clerkMiddleware, smartPublishController.list)

export default router
