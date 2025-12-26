import { Router } from 'express'

import { workspace, admin, invitation, project } from '@/modules'

const router = Router()

router.use('/invitations', invitation.invitationRouter)
router.use('/workspaces', workspace.workspaceRouter)
router.use('/admin', admin.adminRouter)
router.use('/projects', project.projectRouter)

export default router
