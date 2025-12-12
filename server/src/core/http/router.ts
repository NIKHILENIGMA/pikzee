import { Router } from 'express'

import { workspace, admin } from '@/modules'

const router = Router()

router.use('/workspaces', workspace.workspaceRouter)
router.use('/admin', admin.adminRouter)

export default router
