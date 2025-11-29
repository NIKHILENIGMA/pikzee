import { Router } from 'express'

import { auth, workspace, admin } from '@/modules'

const router = Router()

router.use('/auth', auth.AuthRouter)
router.use('/workspaces', workspace.workspaceRouter)
router.use('/admin', admin.adminRouter)

export default router
