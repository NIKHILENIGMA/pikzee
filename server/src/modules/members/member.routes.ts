import { Router } from 'express'
import { memberController } from './member.module'

const router = Router({ mergeParams: true })

// - Get all members of workspace
// - Add member to workspace
router.route('/').get(memberController.listWorkspaceMembers).post(memberController.addMember)

// - Update member permission
// - Remove member from workspace
router
    .route('/:memberId')
    .patch(memberController.updateMemberPermission)
    .delete(memberController.removeMember)
export default router
