import { Router } from 'express'
import { clerkMiddleware } from '@/middlewares/clerk/clerk.middleware'

import { invitationController } from './invitation.module'

const router = Router()

// Define routes for invitations
router.route('/send-invite').post(clerkMiddleware, invitationController.invite)

router.route('/accept').post(clerkMiddleware, invitationController.accept)

export default router
