import { Router } from 'express'
// import workspaceRouter from '@/modules/workspace/workspace.routes'
import { authRouter, workspace, admin } from '@/modules'

const router = Router()

router.use('/auth', authRouter)
router.use('/workspaces', workspace.workspaceRouter)
router.use('/admin', admin.adminRouter)

export default router
