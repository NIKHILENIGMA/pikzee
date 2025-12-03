import { Router } from 'express'

import { authentication, workspace, admin } from '@/modules'

const router = Router()

router.use('/auth', authentication.AuthRouter)
router.use('/workspaces', workspace.workspaceRouter)
router.use('/admin', admin.adminRouter)

export default router
