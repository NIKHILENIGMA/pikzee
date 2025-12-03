import { clerkMiddleware } from '@clerk/express'
import { Router } from 'express'

import { invitationController } from './invitation.module'

const router = Router()

// Define routes for invitations
router.route('/accept').post(clerkMiddleware, invitationController.acceptInvitation)

export default router
