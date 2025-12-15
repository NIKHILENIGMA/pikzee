import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { IInvitationService } from './invitation.service'
import {
    AcceptInvitationSchema,
    CancelInvitationSchema,
    ListPendingInvitationSchema,
    RejectInvitationSchema,
    SendInvitationSchema
} from './invitation.validator'
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
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request body
            const body = ValidationService.validateBody(req.body, AcceptInvitationSchema)

            // Call the invitation service to accept the invitation
            const result = await this.invitationService.accept({
                token: body.token,
                userId
            })

            // Standard response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: result.message,
                data: null
            })
        })
    }

    reject = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request body
            const body = ValidationService.validateBody(req.body, RejectInvitationSchema)

            // Call the invitation service to reject the invitation
            const result = await this.invitationService.reject({
                token: body.token,
                userId
            })

            // Standard response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: result.message,
                data: null
            })
        })
    }

    cancelInvite = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate request body
            const body = ValidationService.validateBody(req.body, CancelInvitationSchema)

            // Call the invitation service to cancel the invitation
            const result = await this.invitationService.cancel({
                token: body.token,
                userId
            })

            // Standard response
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: result.message,
                data: null
            })
        })
    }

    listPendingInvitations = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const body = ValidationService.validateBody(req.body, ListPendingInvitationSchema)

            const invitations = await this.invitationService.list(
                body.workspaceId,
                body.limit,
                body.offset
            )

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Invitations fetched successfully',
                data: invitations
            })
        })
    }
}
