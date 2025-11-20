import { Router } from 'express'
import { clerkMiddleware } from '@/middlewares/clerk/clerk.middleware'
import { workspaceController } from './workspace.controller'

const router = Router({
    mergeParams: true
})

// Get all workspaces for authenticated user
// Create new workspace (subscription limit check)
router.route('/').get(clerkMiddleware, workspaceController.getUserWorkspaces).post(clerkMiddleware, workspaceController.createWorkspace)

// Get workspace details by ID
// Update workspace (name, logo)
// Delete workspace (ensure at least one remains)
router
    .route('/:workspaceId')
    .get(clerkMiddleware, workspaceController.getWorkspaceById)
    .patch(clerkMiddleware, workspaceController.updateWorkspace)
    .delete(clerkMiddleware, workspaceController.deleteWorkspace)

// Get workspace storage/bandwidth usage
router.route('/:workspaceId/usage').get(clerkMiddleware, workspaceController.getWorkspaceUsage)

export default router
