import crypto from 'node:crypto'

import { FRONTEND_BASE_URL, INVITATION_TOKEN_SECRET, logger } from '@/config'
import { invitationStatusEnum, type Invitation, INotificationService } from '@/core'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '@/util'

import { IMemberService } from '../members'
import { IWorkspaceService } from '../workspace'
import { IUserService } from '../user'

import {
    AcceptInvitationDTO,
    CancelInvitationDTO,
    RejectInvitationDTO,
    SendInvitationDTO
} from './invitation.types'
import { IInvitationRepository } from './invitation.repository'

// Extract enum value for easier access
const [PENDING] = invitationStatusEnum.enumValues

export interface IInvitationService {
    invite(data: SendInvitationDTO): Promise<void>
    accept(data: AcceptInvitationDTO): Promise<{ message: string }>
    reject(data: RejectInvitationDTO): Promise<{ message: string }>
    cancel(data: CancelInvitationDTO): Promise<{ message: string }>
    list(workspaceId: string, limit?: number, offset?: number): Promise<Invitation[]>
    hashInvitationToken(token: string): string
}

export class InvitationService implements IInvitationService {
    constructor(
        private readonly notificationService: INotificationService,
        private readonly memberService: IMemberService,
        private readonly workspaceService: IWorkspaceService,
        private readonly userService: IUserService,
        private readonly invitationRepository: IInvitationRepository
    ) {}

    async invite(data: SendInvitationDTO): Promise<void> {
        // Extract the data
        const { workspaceId, userId, email, permission, customMessage } = data

        // Perform necessary checks concurrently
        const [isPendingInvitation, isOwner, alreadyMember, invitee] = await Promise.all([
            this.invitationRepository.getPendingByEmail({
                workspaceId: workspaceId,
                inviteeEmail: email
            }),
            this.workspaceService.isOwner(workspaceId, userId),
            this.memberService.isMemberOfWorkspace(workspaceId, email),
            this.userService.getUserByEmail(email)
        ])
        // Check for existing pending invitation
        if (isPendingInvitation) {
            throw new BadRequestError('An invitation is already pending for this email')
        }

        // check inviter is owner of workspace
        if (!isOwner) {
            throw new ForbiddenError('Only workspace owners can send invitations')
        }

        // check invitee not already a workspace member
        if (alreadyMember) {
            throw new BadRequestError('User is already a member of the workspace')
        }

        if (invitee && invitee.id === userId) {
            throw new BadRequestError('You cannot invite yourself to the workspace')
        }

        // Generate invitation token and expiration date
        const inviteToken: string = this.generateInvitationToken()
        const hashedToken: string = this.hashInvitationToken(inviteToken)
        const expiresAt: Date = this.nowPlusDays(2) // 48 hours expiration

        // Create invitation record in the database
        await this.invitationRepository.create({
            workspaceId: workspaceId,
            inviterUserId: userId,
            inviteeEmail: email,
            permission: permission,
            status: PENDING,
            token: hashedToken,
            expiresAt: expiresAt, // 48 hours expiration
            createdAt: new Date()
        })

        // Check if invitee is existing user
        const isExistingUser: boolean = !!invitee

        if (isExistingUser) {
            await this.notificationService.sendInAppInvitation({
                subscriber: {
                    id: invitee!.id,
                    email: invitee!.email,
                    firstName: invitee!.firstName || '',
                    lastName: invitee!.lastName || '',
                    avatar: invitee!.avatarUrl || undefined
                },
                inviterName: isOwner.name,
                workspaceName: isOwner.name,
                accpetLink: this.invitationLink(inviteToken, 'LOGIN'),
                rejectLink: '',
                customMessage: customMessage || ''
            })
        } else {
            // Send email invitation to invitee
            await this.notificationService.sendInvitationEmail({
                email: email,
                inviterName: isOwner.ownerId,
                workspaceName: isOwner.name,
                signupLink: this.invitationLink(inviteToken, 'SIGNUP'),
                customMessage: customMessage || ''
            })
        }

        logger.info(`Invitation sent to ${email} for workspace ${workspaceId}`)
    }

    async accept(data: AcceptInvitationDTO): Promise<{ message: string }> {
        const invitation: Invitation | null = await this.verifyHashedToken(data.token)
        if (!invitation) {
            throw new UnauthorizedError('Invalid or expired invitation token')
        }

        // Perform invitation checks
        this.invitationCheck(invitation)

        // Add member to workspace and mark invitation as accepted
        await this.invitationRepository.addMemberAndMarkAccept({
            invitationId: invitation.id,
            inviteeUserId: data.userId,
            workspaceId: invitation.workspaceId,
            token: invitation.token,
            permission: invitation.permission
        })

        return { message: 'Invitation accepted successfully' }
    }

    async reject(data: RejectInvitationDTO): Promise<{ message: string }> {
        const invitation: Invitation | null = await this.verifyHashedToken(data.token)
        if (!invitation) {
            throw new UnauthorizedError('Invalid or expired invitation token')
        }

        // Perform invitation checks
        this.invitationCheck(invitation)

        // Mark invitation as rejected
        await this.invitationRepository.update(invitation.id, {
            status: 'EXPIRED'
        })

        return { message: 'Invitation rejected successfully' }
    }

    async cancel(data: CancelInvitationDTO): Promise<{ message: string }> {
        const invitation = await this.verifyHashedToken(data.token)
        if (!invitation) {
            throw new NotFoundError('Invitation not found')
        }

        // Perform invitation checks
        this.invitationCheck(invitation)

        // Only inviter can cancel the invitation
        if (invitation.inviterUserId !== data.userId) {
            throw new ForbiddenError('You are not authorized to cancel this invitation')
        }

        // Mark invitation as cancelled
        await this.invitationRepository.update(invitation.id, {
            status: 'CANCELLED'
        })

        return { message: 'Invitation cancelled successfully' }
    }

    async list(workspaceId: string, limit = 20, offset = 0): Promise<Invitation[]> {
        const invitations = await this.invitationRepository.listPendingByWorkspace(
            workspaceId,
            limit,
            offset
        )

        return invitations
    }

    private generateInvitationToken(): string {
        return crypto.randomBytes(32).toString('hex') // 64-character hex string
    }

    public hashInvitationToken(token: string): string {
        const secret = INVITATION_TOKEN_SECRET
        return crypto.createHmac('sha256', secret).update(token).digest('hex')
    }

    /**
     * Get current date plus specified days
     *
     * @param days Number of days to add
     * @returns  Date object representing the future date
     */
    private nowPlusDays(days: number): Date {
        const d = new Date()
        d.setDate(d.getDate() + days)
        return d
    }

    /**
     * Verify hashed token and return invitation if valid
     *
     * @param token  Invitation token
     * @returns  Invitation | null
     */

    private async verifyHashedToken(token: string): Promise<Invitation | null> {
        const hashedToken = this.hashInvitationToken(token)

        // Find invitation by hashed token
        const invitation: Invitation | null =
            await this.invitationRepository.isInvitationTokenValid(hashedToken)

        if (!invitation) {
            return null // null if not found
        }

        return invitation
    }

    /**
     * Invitation checks
     *
     * @param invitation Invitation object
     * @returns  boolean
     */
    private invitationCheck(invitation: Invitation) {
        if (invitation.status !== PENDING) {
            throw new BadRequestError('Invitation is not in a pending state')
        }

        if (invitation.expiresAt <= new Date()) {
            throw new BadRequestError('Invitation has expired')
        }

        if (!invitation.workspaceId) {
            throw new BadRequestError('Invalid invitation: Missing workspace information')
        }

        return true
    }

    private invitationLink(token: string, type: 'SIGNUP' | 'LOGIN'): string {
        const baseUrl: string = FRONTEND_BASE_URL
        if (type === 'SIGNUP') {
            return `${baseUrl}/auth/signup?invitationToken=${token}`
        } else {
            return `${baseUrl}/auth/login?invitationToken=${token}`
        }
    }
}
