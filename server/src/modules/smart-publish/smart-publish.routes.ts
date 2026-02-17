import { Router } from 'express'
import { smartPublishController } from './smart-publish.module'

const router = Router()

router.post('/connect/:platform', smartPublishController.connectSocialAccount)

router.post('/verify', smartPublishController.verifySocialAccountToken)

export default router
