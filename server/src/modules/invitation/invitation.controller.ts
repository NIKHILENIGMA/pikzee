import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '@/util'
import { BaseController, ValidationService } from '@/lib'
import { InvitationService } from './invitation.service'
import { WorkspaceIdSchema } from '../workspace'
import { AcceptInvitationSchema, SendInvitationSchema } from './invitation.validator'

export class InvitationController extends BaseController {
    constructor(private invitationService: InvitationService) {
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
    sendInvitation = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId } = ValidationService.validateParams(req.params, WorkspaceIdSchema)

            const { email, permission } = ValidationService.validateBody(
                req.body,
                SendInvitationSchema
            )

            const invitation = await this.invitationService.sendInvitation(workspaceId, userId, {
                email,
                permission
            })

            return {
                statusCode: 201,
                message: 'Invitation sent successfully',
                data: invitation
            }
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
    getPendingInvitations = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { workspaceId } = ValidationService.validateParams(req.params, WorkspaceIdSchema)

            const pendingInvitations = await this.invitationService.getPendingInvitations(
                workspaceId,
                userId
            )

            return {
                statusCode: 200,
                message: 'Pending invitations retrieved successfully',
                data: pendingInvitations
            }
        })
    }
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
    acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            const { token } = ValidationService.validateBody(req.body, AcceptInvitationSchema)

            const result = await this.invitationService.acceptInvitation(token, userId)

            return {
                statusCode: 200,
                message: 'Invitation accepted successfully',
                data: result
            }
        })
    }

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
