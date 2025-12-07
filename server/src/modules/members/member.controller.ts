import { NextFunction, Request, Response } from 'express'
import { MemberService } from './member.service'
import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'

import { WorkspaceIdSchema } from '../workspace'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'
import {
    AddMemberSchema,
    UpdateMemberPermissionSchema,
    WorkspaceMemberIdSchema
} from './member.validator'
import { CreateWorkspaceMemberRequest, MemberDTO } from './member.types'

export class MemberController extends BaseController {
    constructor(private memberService: MemberService) {
        super()
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }
            // Validate request params
            const params = ValidationService.validateParams(req.params, WorkspaceIdSchema)

            // List all members of workspace
            const members = await this.memberService.listAll(params.workspaceId)

            // Return success response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Listed workspace members successfully',
                data: members
            })
        })
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<MemberDTO>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }
            const params = ValidationService.validateParams(req.params, WorkspaceIdSchema)
            const body = ValidationService.validateBody<CreateWorkspaceMemberRequest>(
                req.body,
                AddMemberSchema
            )

            const newMember = await this.memberService.create({
                workspaceId: params.workspaceId,
                userId: body.inviteeUserId,
                permission: body.permission
            })

            return this.createResponse({
                statusCode: STATUS_CODE.CREATED,
                message: 'Added member to workspace successfully',
                data: newMember
            })
        })
    }

    updatePermission = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<MemberDTO>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request params and body
            const params = ValidationService.validateParams(req.params, WorkspaceMemberIdSchema)
            // Validate request body
            const body = ValidationService.validateBody(req.body, UpdateMemberPermissionSchema)

            // Update member permission
            const updatedMember = await this.memberService.updatePermission({
                memberId: params.memberId,
                workspaceId: params.workspaceId,
                permission: body.permission
            })

            // Return success response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Updated member permission successfully',
                data: updatedMember
            })
        })
    }

    kick = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request params
            const params = ValidationService.validateParams(req.params, WorkspaceMemberIdSchema)

            // Remove member from workspace
            await this.memberService.kickMember(params.workspaceId, params.memberId)

            // Return success response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Removed member from workspace successfully',
                data: null
            })
        })
    }
}
