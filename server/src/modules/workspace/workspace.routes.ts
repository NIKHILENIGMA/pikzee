import { Router } from 'express'
import { clerkMiddleware } from '@/middlewares/clerk/clerk.middleware'
import { WorkspaceController } from './workspace.controller'
import membersRoutes from '@/modules/members/memeber.routes'
import { workspaceService } from './workspace.service'

const router = Router({
    mergeParams: true
})

const workspaceController = new WorkspaceController(workspaceService)

// Get all workspaces for authenticated user
// Create new workspace (subscription limit check)
router.route('/').get(clerkMiddleware, workspaceController.getUserWorkspaces).post(clerkMiddleware, workspaceController.createWorkspace)

// Get workspace details by ID
// Update workspace (name, logo)
// Delete workspace (ensure at least one remains)
router.route('/:workspaceId').get(clerkMiddleware, workspaceController.getWorkspaceById).patch(clerkMiddleware, workspaceController.updateWorkspace)
// .delete(clerkMiddleware, workspaceController.deleteWorkspace)

// Get workspace storage/bandwidth usage
router.route('/:workspaceId/usage').get(clerkMiddleware, workspaceController.getWorkspaceUsage)

// Nested routes for workspace members
router.use('/:workspaceId/members', clerkMiddleware, membersRoutes)

export default router
