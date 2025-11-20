import { Router } from 'express'
import { clerkAuth } from '@/core'
import { workspaceController } from './workspace.controller'

const router = Router({
    mergeParams: true
})

// Get all workspaces for authenticated user
// Create new workspace (subscription limit check)
router.route('/').get(clerkAuth, workspaceController.getUserWorkspaces).post(clerkAuth, workspaceController.createWorkspace)

// Get workspace details by ID
// Update workspace (name, logo)
// Delete workspace (ensure at least one remains)
router
    .route('/:workspaceId')
    .get(clerkAuth, workspaceController.getWorkspaceById)
    .patch(clerkAuth, workspaceController.updateWorkspace)
    .delete(clerkAuth, workspaceController.deleteWorkspace)

// Get workspace storage/bandwidth usage
router.route('/:workspaceId/usage').get(clerkAuth, workspaceController.getWorkspaceUsage)

export default router
