import { Router } from 'express'

import { workspace, admin, invitation } from '@/modules'

const router = Router()

router.use('/invitations', invitation.invitationRouter)
router.use('/workspaces', workspace.workspaceRouter)
router.use('/admin', admin.adminRouter)

export default router
