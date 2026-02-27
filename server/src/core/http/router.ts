import { Router } from 'express'

import workspaceRouter from '@/modules/workspace/workspace.routes'
import invitationRouter from '@/modules/invitation/invitation.routes'
import adminRouter from '@/modules/admin/admin.routes'
import projectRouter from '@/modules/projects/project.routes'
import uploaderRouter from '@/modules/uploader/uploader.routes'
import smartPublishRouter from '@/modules/smart-publish/smart-publish.routes'
import documentRouter from '@/modules/document/document.routes'


const router = Router()

router.use('/invitations', invitationRouter)
router.use('/workspaces', workspaceRouter)
router.use('/admin', adminRouter)
router.use('/projects', projectRouter)
router.use('/uploads', uploaderRouter)
router.use('/social', smartPublishRouter)
router.use('/documents', documentRouter)

export default router
