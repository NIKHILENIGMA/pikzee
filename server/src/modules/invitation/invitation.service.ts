import crypto from 'node:crypto'

import { FRONTEND_BASE_URL, INVITATION_TOKEN_SECRET, logger } from '@/config'
import { invitationStatusEnum, type Invitation, INotificationService } from '@/core'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '@/util'

import { IMemberService } from '../members'
import { IWorkspaceService } from '../workspace'
import { IUserService } from '../user'

import { SendInvitationDTO } from './invitation.types'
import { IInvitationRepository } from './invitation.repository'

// Extract enum value for easier access
const [INVITATION_PENDING] = invitationStatusEnum.enumValues

export interface IInvitationService {
    invite(data: SendInvitationDTO): Promise<void>
    accept(data: {
        token?: string
        invitationId?: string
        actingUserId?: string
    }): Promise<{ workspaceId: string; member: unknown }>
    reject({
        token,
        invitationId,
        actingUserId
    }: {
        token?: string
        invitationId?: string
        actingUserId?: string
    }): Promise<{ message: string }>
    cancel({
        invitationId,
        actingUserId
    }: {
        invitationId: string
        actingUserId: string
    }): Promise<{ message: string }>
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
            status: INVITATION_PENDING,
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
        }

        logger.info(`Invitation sent to ${email} for workspace ${workspaceId}`)
    }

    async accept(data: {
        token?: string
        invitationId?: string
        actingUserId?: string
    }): Promise<{ workspaceId: string; member: unknown }> {
        if (data.token) {
            const invitation: Invitation | null = await this.verifyHashedToken(data.token)
            if (!invitation) {
                throw new UnauthorizedError('Invalid or expired invitation token')
            }
        }
        return { workspaceId: '', member: null }
    }

    async reject(data: {
        token?: string
        invitationId?: string
        actingUserId?: string
    }): Promise<{ message: string }> {
        if (data.token) {
            const invitation: Invitation | null = await this.verifyHashedToken(data.token)
            if (!invitation) {
                throw new UnauthorizedError('Invalid or expired invitation token')
            }
        }
        return { message: 'Invitation rejected successfully' }
    }

    async cancel(data: {
        invitationId: string
        actingUserId: string
    }): Promise<{ message: string }> {
        const invitation = await this.invitationRepository.getById(data.invitationId)
        if (!invitation) {
            throw new NotFoundError('Invitation not found')
        }

        return { message: 'Invitation cancelled successfully' }
    }

    private generateInvitationToken(): string {
        return crypto.randomBytes(32).toString('hex') // 64-character hex string
    }

    private hashInvitationToken(token: string): string {
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

    private async verifyHashedToken(token: string): Promise<Invitation | null> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        // Find invitation by hashed token
        const invitation: Invitation | null =
            await this.invitationRepository.isInvitationTokenValid(hashedToken)

        return invitation // null if not found
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
