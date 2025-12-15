import { Router } from 'express'
import { clerkMiddleware } from '@/middlewares/clerk/clerk.middleware'

import { invitationController } from './invitation.module'

const router = Router()

// Define routes for invitations
router.route('/send-invite').post(clerkMiddleware, invitationController.invite)

router.route('/accept').post(clerkMiddleware, invitationController.accept)

router.route('/reject').post(clerkMiddleware, invitationController.reject)

router.route('/cancel').post(clerkMiddleware, invitationController.cancelInvite)

router.route('/pending').post(clerkMiddleware, invitationController.listPendingInvitations)

export default router
