import { Router } from 'express'
import { memberController } from './member.module'

const router = Router({ mergeParams: true })

// - Get all members of workspace
// - Add member to workspace
router.route('/').get(memberController.list).post(memberController.create)

// - Update member permission
// - Remove member from workspace
router.route('/:memberId').patch(memberController.updatePermission).delete(memberController.kick)

export default router
