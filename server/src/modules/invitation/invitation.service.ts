import crypto from 'node:crypto'

import { FRONTEND_BASE_URL } from '@/config'
import {
    invitationStatusEnum,
    type Invitation,
    type User,
    INotificationService,
    WORKFLOWS,
    WORKFLOWS_KEYS,
    NotificationChannel
} from '@/core'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '@/util'

import { IMemberService } from '../members'
import { IWorkspaceService, WorkspaceDTO } from '../workspace'
import { IUserService } from '../user'

import { CreateInvitationPayloadDTO, InvitationType, SendInvitationDTO } from './invitation.types'
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
        // Check for existing pending invitation
        const isPendingInvitation: Invitation | null =
            await this.invitationRepository.getPendingByEmail({
                workspaceId: data.workspaceId,
                inviteeEmail: data.email
            })
        if (!isPendingInvitation) {
            throw new BadRequestError('An invitation is already pending for this email')
        }

        // check inviter is owner of workspace
        const isOwner: WorkspaceDTO | null = await this.workspaceService.isOwner(
            data.workspaceId,
            data.userId
        )
        if (!isOwner) {
            throw new ForbiddenError('Only workspace owners can send invitations')
        }

        // check invitee not already a workspace member
        const alreadyMember: boolean = await this.memberService.isMemberOfWorkspace(
            data.workspaceId,
            data.email
        )
        if (alreadyMember) {
            throw new BadRequestError('User is already a member of the workspace')
        }

        // Create invite and hashed tokens
        const inviteToken: string = this.generateInvitationToken()
        const hashedToken: string = this.hashInvitationToken(inviteToken)
        const expiresAt: Date = this.nowPlusDays(2) // 48 hours expiration

        // Create invitation record in the database
        await this.invitationRepository.create({
            workspaceId: data.workspaceId,
            inviterUserId: data.userId,
            inviteeEmail: data.email,
            permission: data.permission,
            status: INVITATION_PENDING,
            token: hashedToken,
            expiresAt: expiresAt, // 48 hours expiration
            createdAt: new Date()
        })

        // Check if invitee is existing user
        const invitee: User | null = await this.userService.getUserByEmail(data.email)

        // Prepare notification payload
        const payload: CreateInvitationPayloadDTO = {
            invitedBy: isOwner.name || 'A team member',
            workspaceName: isOwner.name,
            message: data.customMessage,
            invitationLink: '', // to be set later
            useExist: false // to be set later
        }

        // Generate invitation link
        if (invitee) {
            // Existing user: Send login link and In-App notification
            const loginLink: string = this.invitationLink(inviteToken, InvitationType.LOGIN)

            // Trigger notification for existing user invite
            await this.notificationService.trigger<CreateInvitationPayloadDTO>({
                subscriberId: invitee.id,
                workflowId: WORKFLOWS[WORKFLOWS_KEYS.INVITE_USER].id,
                type: NotificationChannel.IN_APP,
                payload: {
                    ...payload,
                    invitationLink: loginLink,
                    useExist: true,
                    message: data.customMessage || 'You have been invited to join the workspace.'
                }
            })
        } else {
            // New user: Send sign-up link and Email notification
            const signupLink: string = this.invitationLink(inviteToken, InvitationType.SIGNUP)

            // Trigger notification for new user invite
            await this.notificationService.trigger<CreateInvitationPayloadDTO>({
                subscriberId: data.email, // Using email as subscriberId for new users
                workflowId: WORKFLOWS[WORKFLOWS_KEYS.INVITE_USER].id,
                type: NotificationChannel.EMAIL,
                payload: {
                    ...payload,
                    invitationLink: signupLink,
                    useExist: false, // This will prevent in-app notification workflow from triggering
                    message: data.customMessage || 'You have been invited to join the workspace.'
                }
            })
        }
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
        return crypto.createHash('sha256').update(token).digest('hex')
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
