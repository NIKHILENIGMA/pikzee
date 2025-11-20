import { Router } from 'express'
// import workspaceRouter from '@/modules/workspace/workspace.routes'
import { projectRouter, authRouter, workspace } from '@/modules'

const router = Router()

router.use('/auth', authRouter)
router.use('/workspaces', workspace.workspaceRouter)
router.use('/projects', projectRouter)
// router.use('/integrations', socialRouter)

export default router
