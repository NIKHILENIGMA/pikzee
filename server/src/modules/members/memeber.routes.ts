import { Router } from 'express'
import { MemberController } from './memeber.controller'
import { memberService } from './member.service'

const router = Router({ mergeParams: true })

// Initialize MemberController with memberService
const memberController = new MemberController(memberService)

// - Get all members of workspace
// - Add member to workspace
router.route('/').get(memberController.listWorkspaceMembers).post(memberController.addMember)

// - Update member permission
// - Remove member from workspace
router.route('/:memberId').patch(memberController.updateMemberPermission).delete(memberController.removeMember)
export default router
