import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { WorkspaceIdSchema } from '../workspace'

import { IInvitationService } from './invitation.service'
import { AcceptInvitationSchema, SendInvitationSchema } from './invitation.validator'
import { SendInvitationRequest } from './invitation.types'
import { logger } from '@/config'

export class InvitationController extends BaseController {
    constructor(private invitationService: IInvitationService) {
        super()
    }

    invite = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                logger.error('Unauthorized access attempt to invite endpoint')
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request body
            const body = ValidationService.validateBody<SendInvitationRequest>(
                req.body,
                SendInvitationSchema
            )
            await Promise.resolve()
            // Call the invitation service to send the invitation
            await this.invitationService.invite({
                workspaceId: body.workspaceId,
                userId: userId,
                email: body.email,
                customMessage: body.message,
                permission: body.permission
            })

            return this.createResponse({
                statusCode: STATUS_CODE.CREATED,
                message: 'Invitation sent successfully',
                data: null
            })
        })
    }

    accept = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request body
            const body = ValidationService.validateBody(req.body, AcceptInvitationSchema)

            // Call the invitation service to accept the invitation
            const result = await this.invitationService.accept({
                token: body.token,
                actingUserId: userId
            })

            // Standard response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Invitation accepted successfully',
                data: result
            })
        })
    }

    reject = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request body
            const body = ValidationService.validateBody(req.body, AcceptInvitationSchema)
            // Call the invitation service to reject the invitation
            const result = await this.invitationService.reject({
                token: body.token,
                actingUserId: userId
            })

            // Standard response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Invitation rejected successfully',
                data: result
            })
        })
    }

    cancelInvite = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId } = ValidationService.validateParams(req.params, WorkspaceIdSchema)

            await Promise.resolve(workspaceId)
            // await this.invitationService.cancelInvite(workspaceId, userId)
            return this.createResponse({
                statusCode: STATUS_CODE.CREATED,
                message: 'Invitation cancelled successfully',
                data: null
            })
        })
    }

    listInvitations = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }
            const invitations = await this.invitationService.accept({
                token: '',
                actingUserId: userId
            })
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Invitations fetched successfully',
                data: invitations
            })
        })
    }
}
