import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { IInvitationService } from './invitation.service'
import { WorkspaceIdSchema } from '../workspace'
import { AcceptInvitationSchema, SendInvitationSchema } from './invitation.validator'
import { STATUS_CODE } from '@/types/api/success.types'
import { SendInvitationRequest } from './invitation.types'

export class InvitationController extends BaseController {
    constructor(private invitationService: IInvitationService) {
        super()
    }
    /**
     * TASK LIST:
     * 1. Extract workspaceId from req.params and userId from req.auth
     * 2. Validate request using sendInvitationSchema
     * 3. Call invitationService.sendInvitation(workspaceId, userId, validatedInput)
     * 4. Return 201 with created invitation
     * 5. Handle SubscriptionLimitError with 403
     * 6. Handle ValidationError (already member/pending) with 400
     * 7. Handle email sending errors appropriately
     */
    send = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            // Validate workspaceId from params
            const params = ValidationService.validateParams<{ workspaceId: string }>(
                req.params,
                WorkspaceIdSchema
            )

            // Validate request body
            const body = ValidationService.validateBody<SendInvitationRequest>(
                req.body,
                SendInvitationSchema
            )

            // Call the invitation service to send the invitation
            const invitation = await this.invitationService.invite({
                workspaceId: params.workspaceId,
                userId: userId,
                email: body.email,
                customMessage: body.message,
                permission: body.permission
            })

            return this.createResponse({
                statusCode: STATUS_CODE.CREATED,
                message: 'Invitation sent successfully',
                data: invitation
            })
        })
    }

    /**
     * TASK LIST:
     * 1. Extract workspaceId from req.params and userId from req.auth
     * 2. Validate workspaceId is valid UUID
     * 3. Call invitationService.getPendingInvitations(workspaceId, userId)
     * 4. Return 200 with array of pending invitations
     * 5. Handle ForbiddenError with 403
     */
    // pendingInvites = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(req, res, next, async () => {
    //         const userId: string | undefined = req.user?.id
    //         if (!userId) {
    //             throw new UnauthorizedError('User not authenticated')
    //         }

    //         // Validate workspaceId from params
    //         const params = ValidationService.validateParams(req.params, WorkspaceIdSchema)

    //         // Call the invitation service to get pending invitations
    //         // const pendingInvitations = await this.invitationService.(
    //         //     params.workspaceId,
    //         //     userId
    //         // )

    //         // Standard response
    //         return this.createResponse({
    //             statusCode: STATUS_CODE.OK,
    //             message: 'Pending invitations retrieved successfully',
    //             data: params
    //         })
    //     })
    // }
    /**
     * TASK LIST:
     * 1. Extract userId from req.auth
     * 2. Validate request body using acceptInvitationSchema
     * 3. Call invitationService.acceptInvitation(validatedInput, userId)
     * 4. Return 200 with workspace and member data
     * 5. Handle NotFoundError with 404
     * 6. Handle ValidationError (expired/already accepted) with 400
     * 7. Handle ForbiddenError (email mismatch) with 403
     */
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

    // reject

    // cancelInvitation = async (req: Request, res: Response, next: NextFunction) => {
    //     return this.handleRequest(req, res, next, async () => {
    //         const userId: string | undefined = req.user?.id
    //         if (!userId) {
    //             throw new UnauthorizedError('User not authenticated')
    //         }

    //         const { workspaceId } = ValidationService.validateParams(req.params, WorkspaceIdSchema)

    //         await this.invitationService.cancelInvitation(invitationId, userId)

    //         return {
    //             statusCode: 201,
    //             message: 'Invitation sent successfully',
    //             data: null
    //         }
    //     })
    // }
}
