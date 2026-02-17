import { Router } from 'express'

import { workspace, admin, invitation, project, uploader, smartPublish } from '@/modules'

const router = Router()

router.use('/invitations', invitation.invitationRouter)
router.use('/workspaces', workspace.workspaceRouter)
router.use('/admin', admin.adminRouter)
router.use('/projects', project.projectRouter)
router.use('/uploads', uploader.uploaderRouter)
router.use('/social', smartPublish.smartPublishRouter)

export default router
