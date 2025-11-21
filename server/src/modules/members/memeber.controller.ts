import { Request, Response } from 'express'
import { memberService } from './member.service'
import { ApiResponse, InternalServerError, StandardError, UnauthorizedError } from '@/util'
import { ValidationService } from '@/lib'
import { addMemberSchema, updateMemberPermissionSchema, WorkspaceMemberIdSchema } from './member.validator'

import { WorkspaceIdSchema } from '../workspace'

export class MemberController {
    async listWorkspaceMembers(req: Request, res: Response) {
        try {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId } = ValidationService.validateParams(req.params, WorkspaceIdSchema)

            const members = await memberService.getWorkspaceMembers(workspaceId)

            return ApiResponse(req, res, 200, 'Fetched workspace members successfully', members)
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new InternalServerError(`Failed to fetch workspace members: ${(error as Error).message}`, 'MemberController.getWorkspaceMembers')
        }
    }

    async addMember(req: Request, res: Response) {
        try {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }
            const { workspaceId } = ValidationService.validateParams(req.params, WorkspaceIdSchema)
            const { inviteeUserId, permission } = ValidationService.validateBody(req.body, addMemberSchema)

            const newMember = await memberService.addMemberToWorkspace(workspaceId, inviteeUserId, { userId, permission })

            return ApiResponse(req, res, 201, 'Added member to workspace successfully', newMember)
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new InternalServerError(`Failed to add member: ${(error as Error).message}`, 'MemberController.addMember')
        }
    }

    async updateMemberPermission(req: Request, res: Response) {
        try {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId, memberId } = ValidationService.validateParams(req.params, WorkspaceMemberIdSchema)

            const { permission } = ValidationService.validateBody(req.body, updateMemberPermissionSchema)

            const updatedMember = await memberService.updateMemberPermission(workspaceId, memberId, userId, { permission })

            return ApiResponse(req, res, 200, 'Updated member permission successfully', updatedMember)
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new InternalServerError(
                `Failed to update member permission: ${(error as Error).message}`,
                'MemberController.updateMemberPermission'
            )
        }
    }

    async removeMember(req: Request, res: Response) {
        try {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId, memberId } = ValidationService.validateParams(req.params, WorkspaceMemberIdSchema)

            await memberService.removeMemberFromWorkspace(workspaceId, memberId, userId)

            return ApiResponse(req, res, 200, 'Removed member successfully')
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new InternalServerError(`Failed to remove member: ${(error as Error).message}`, 'MemberController.removeMember')
        }
    }
}

export const memberController = new MemberController()
