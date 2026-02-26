import { Router } from 'express'

import { clerkMiddleware } from '@/middlewares/clerk/clerk.middleware'
import membersRoutes from '@/modules/members/member.routes'

import { workspaceController } from './workspace.module'

const router = Router({
    mergeParams: true
})

// Get all workspaces for authenticated user
// Create new workspace (subscription limit check)
router
    .route('/')
    .post(clerkMiddleware, workspaceController.create)
    .get(clerkMiddleware, workspaceController.list)

router.route('/me').get(clerkMiddleware, workspaceController.me)
// Get workspace details by ID
// Update workspace (name, logo)
// Delete workspace (ensure at least one remains)
router
    .route('/:workspaceId')
    .get(clerkMiddleware, workspaceController.getById)
    .patch(clerkMiddleware, workspaceController.update)
    .delete(clerkMiddleware, workspaceController.delete)

router.route('/:workspaceId/switch').post(clerkMiddleware, workspaceController.switch)

// Nested routes for workspace members
router.use('/:workspaceId/members', clerkMiddleware, membersRoutes)

export default router
