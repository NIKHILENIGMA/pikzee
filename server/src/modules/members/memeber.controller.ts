import { NextFunction, Request, Response } from 'express'
import { MemberService } from './member.service'
import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { addMemberSchema, updateMemberPermissionSchema, workspaceMemberIdSchema } from './member.validator'

import { workspaceIdSchema } from '../workspace'

export class MemberController extends BaseController {
    constructor(private memberService: MemberService) {
        super()
    }

    listWorkspaceMembers = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId } = ValidationService.validateParams(req.params, workspaceIdSchema)

            const members = await this.memberService.getWorkspaceMembers(workspaceId)

            return {
                statusCode: 200,
                message: 'Fetched workspace members successfully',
                data: members
            }
        })
    }
    
    addMember = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }
            const { workspaceId } = ValidationService.validateParams(req.params, workspaceIdSchema)
            const { inviteeUserId, permission } = ValidationService.validateBody(req.body, addMemberSchema)

            const newMember = await this.memberService.addMemberToWorkspace(workspaceId, inviteeUserId, { userId, permission })

            return {
                statusCode: 201,
                message: 'Added member to workspace successfully',
                data: newMember
            }
        })
    }

    updateMemberPermission = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId, memberId } = ValidationService.validateParams(req.params, workspaceMemberIdSchema)

            const { permission } = ValidationService.validateBody(req.body, updateMemberPermissionSchema)

            const updatedMember = await this.memberService.updateMemberPermission(workspaceId, memberId, userId, { permission })

            return {
                statusCode: 200,
                message: 'Updated member permission successfully',
                data: updatedMember
            }
        })
    }

    removeMember = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId, memberId } = ValidationService.validateParams(req.params, workspaceMemberIdSchema)

            await this.memberService.removeMemberFromWorkspace(workspaceId, memberId, userId)

            return {
                statusCode: 200,
                message: 'Removed member successfully'
            }
        })
    }
}
