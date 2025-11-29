import crypto from 'node:crypto'
import { CreateInvitation, db, Invitation, invitations, invitationStatusEnum, users, workspaceMembers, workspaces } from '@/core'
import { SendInvitationInput, InvitationType } from './invitation.types'
import { and, desc, eq, gt, lt } from 'drizzle-orm'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '@/util'
import { FRONTEND_BASE_URL } from '@/config'
import { NotificationService, notificationService } from '@/core/notification/notification.service'
import { WORKFLOWS, WORKFLOWS_KEYS } from '@/core/notification/workflows'
import { NotificationChannel } from '@/types/notification/notification.types'
import { memberService, MemberService } from '../members/member.service'

interface CreateInvitationPayload {
    workspaceName: string
    invitedBy: string
    invitationLink: string
    useExist: boolean
    message?: string
}

const [INVITATION_PENDING, INVITATION_ACCEPTED, INVITATION_EXPIRED, INVITATION_CANCELLED] = invitationStatusEnum.enumValues

export class InvitationService {
    private static instance: InvitationService

    private constructor(
        private notificationService: NotificationService,
        private memberService: MemberService
    ) {
        this.notificationService = notificationService
        this.memberService = memberService
    }

    public static getInstance(): InvitationService {
        if (!InvitationService.instance) {
            InvitationService.instance = new InvitationService(notificationService, memberService)
        }
        return InvitationService.instance
    }

    /**
     * TASK LIST:
     * 1. Verify inviter has FULL_ACCESS or is workspace owner
     * 2. Get workspace details and subscription plan
     * 3. Get subscription limits for member count
     * 4. Count current workspace members
     * 5. If memberCount >= maxMembers, throw SubscriptionLimitError
     * 6. Check if invitee email already exists as workspace member
     * 7. If already member, throw ValidationError
     * 8. Check for existing pending invitation to same email for this workspace
     * 9. If exists and not expired, throw ValidationError ('Invitation already sent')
     * 10. Generate unique secure token for invitation
     * 11. Set expiration date (e.g., 7 days from now)
     * 12. Insert invitation record into database
     * 13. Check if invitee email exists in users table
     * 14. If user exists, send 'existing user' email with direct login link
     * 15. If user doesn't exist, send 'new user' email with signup link
     * 16. Use Novu to trigger email via SendGrid with workspace name, inviter name, token
     * 17. Return created InvitationDTO
     */
    async sendInvitation(workspaceId: string, inviterUserId: string, data: SendInvitationInput): Promise<void> {
        const [workspaceResult, inviterFullAccessCheck, inviteeExistsResult, inviterDetailsResult] = await Promise.all([
            // Query 1: Get Workspace (lightweight SELECT)
            db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1),

            // Query 2: Check if inviter has FULL_ACCESS (lightweight lookup)
            db
                .select({ id: workspaceMembers.id })
                .from(workspaceMembers)
                .where(
                    and(
                        eq(workspaceMembers.workspaceId, workspaceId),
                        eq(workspaceMembers.userId, inviterUserId),
                        eq(workspaceMembers.permission, 'FULL_ACCESS')
                    )
                )
                .limit(1),

            // Query 3: Check if invitee user exists (by email)
            db.select().from(users).where(eq(users.email, data.email)).limit(1),

            // Query 4: Get inviter details (for notification payload)
            db.select({ firstName: users.firstName, id: users.id }).from(users).where(eq(users.id, inviterUserId)).limit(1)
        ])

        const workspace = workspaceResult[0]
        const inviteeDetails = inviteeExistsResult[0]
        const inviterDetails = inviterDetailsResult[0]

        // Check 1: Workspace and Inviter existence
        if (!workspace) {
            throw new NotFoundError('Workspace not found')
        }

        if (!inviterDetails) {
            // This case is unlikely in a typical flow but guards against DB inconsistency
            throw new NotFoundError('Inviter details not found')
        }

        // Check 2: Inviter permission
        const isOwner = workspace.ownerId === inviterUserId
        const hasFullAccess = inviterFullAccessCheck.length > 0

        if (!isOwner && !hasFullAccess) {
            throw new BadRequestError('Inviter does not have permission to send invitations')
        }

        // Check 3: Invitee is not already a member (only relevant if the invitee exists on the platform)
        if (inviteeDetails) {
            const isInviteeAlreadyMember = await db
                .select({ id: workspaceMembers.id })
                .from(workspaceMembers)
                .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, inviteeDetails.id)))
                .limit(1)

            if (isInviteeAlreadyMember.length > 0) {
                throw new BadRequestError('User is already a member of the workspace')
            }
        }

        // INVITATION CREATION
        const { inviteToken, hashedToken } = this.generateInviteAndHashedTokens()
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiration
        const customizedMessage = data.customMessage || 'You have been invited to join the workspace.'

        await this.createInvitation({
            workspaceId,
            inviterUserId,
            inviteeEmail: data.email,
            permission: data.permission,
            token: hashedToken,
            status: 'PENDING',
            expiresAt,
            createdAt: new Date()
        })

        // NOTIFICATION & LINK GENERATION
        if (inviteeDetails) {
            // Existing user: Send login link and In-App notification
            const loginLink = this.invitationLink(inviteToken, InvitationType.LOGIN)

            // Trigger notification for existing user invite
            await this.notificationService.trigger<CreateInvitationPayload>({
                subscriberId: inviteeDetails.id,
                workflowId: WORKFLOWS[WORKFLOWS_KEYS.INVITE_USER].id,
                type: NotificationChannel.IN_APP,
                payload: {
                    workspaceName: workspace.name,
                    invitedBy: inviterDetails.firstName!,
                    invitationLink: loginLink,
                    useExist: true,
                    message: customizedMessage
                }
            })
        } else {
            // New user: Send sign-up link and Email notification
            const signupLink = this.invitationLink(inviteToken, InvitationType.SIGNUP)

            await notificationService.trigger<CreateInvitationPayload>({
                subscriberId: data.email, // Using email as subscriberId for new users
                workflowId: WORKFLOWS[WORKFLOWS_KEYS.INVITE_USER].id,
                type: NotificationChannel.EMAIL,
                payload: {
                    workspaceName: workspace.name,
                    invitedBy: inviterDetails.firstName!,
                    invitationLink: signupLink,
                    useExist: false, // This will prevent in-app notification workflow from triggering
                    message: customizedMessage
                }
            })
        }
    }

    async getInvitationById(invitationId: string): Promise<Invitation | null> {
        const invitation = await db.select().from(invitations).where(eq(invitations.id, invitationId)).limit(1)

        return invitation.length > 0 ? invitation[0] : null
    }

    async getPendingInvitations(workspaceId: string, userId: string) {
        const [membership] = await db
            .select()
            .from(workspaceMembers)
            .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))

        if (!membership) {
            throw new BadRequestError('User is not a member of the workspace')
        }

        const pendingInvitations = await db
            .select({
                id: invitations.id,
                inviterFirstName: users.firstName,
                inviterLastName: users.lastName,
                workspaceId: invitations.workspaceId,
                workspaceName: workspaces.name,
                inviterUserId: invitations.inviterUserId,
                inviteeEmail: invitations.inviteeEmail,
                permission: invitations.permission,
                status: invitations.status,
                expiresAt: invitations.expiresAt,
                createdAt: invitations.createdAt
            })
            .from(invitations)
            .innerJoin(users, eq(invitations.inviterUserId, users.id))
            .innerJoin(workspaces, eq(invitations.workspaceId, workspaces.id))
            .where(
                and(eq(invitations.workspaceId, workspaceId), eq(invitations.status, InvitationType.PENDING), gt(invitations.expiresAt, new Date()))
            )
            .orderBy(desc(invitations.createdAt))

        return pendingInvitations
    }

    /**
     * TASK LIST:
     * 1. Find invitation by token
     * 2. If not found, throw NotFoundError ('Invalid invitation token')
     * 3. Check if invitation is already accepted/cancelled
     * 4. If not pending, throw ValidationError
     * 5. Check if invitation is expired (expiresAt < now)
     * 6. If expired, update status to 'expired' and throw ValidationError
     * 7. Verify invitee email matches authenticated user's email
     * 8. If mismatch, throw ForbiddenError
     * 9. Check if user is already member of workspace
     * 10. If already member, throw ValidationError
     * 11. Begin database transaction
     * 12. Insert new workspaceMember record with invitation permission
     * 13. Update invitation status to 'accepted'
     * 14. Commit transaction
     * 15. Return workspace details and member data
     * 16. Rollback on error
     */
    async acceptInvitation(token: string, userId: string) {
        const invitation = await this.verifyHashedToken(token)

        if (!invitation) {
            throw new NotFoundError('Invalid invitation token')
        }

        if (invitation.status !== INVITATION_PENDING) {
            throw new BadRequestError('Invitation is no longer valid')
        }

        if (invitation.expiresAt < new Date()) {
            // Update status to 'expired'
            await db.update(invitations).set({ status: INVITATION_EXPIRED }).where(eq(invitations.id, invitation.id))
            throw new UnauthorizedError('Invitation has expired')
        }

        const newMember = await this.memberService.addMemberToWorkspace({
            userId,
            workspaceId: invitation.workspaceId,
            inviteeUserId: invitation.inviterUserId,
            permission: invitation.permission
        })

        // Update invitation status to 'ACCEPTED'
        await db.update(invitations).set({ status: INVITATION_ACCEPTED }).where(eq(invitations.id, invitation.id))

        return {
            workspaceId: invitation.workspaceId,
            member: newMember
        }
    }

    /**
     * TASK LIST:
     * 1. Get invitation by ID
     * 2. Verify user is workspace owner or invitation creator
     * 3. If not authorized, throw ForbiddenError
     * 4. Check invitation status is 'pending'
     * 5. If not pending, throw ValidationError ('Cannot cancel non-pending invitation')
     * 6. Update invitation status to 'cancelled'
     * 7. Return success message
     */
    async cancelInvitation(invitationId: string, userId: string): Promise<{ message: string }> {
        const invitation = await this.getInvitationById(invitationId)

        if (!invitation) {
            throw new NotFoundError('Invitation not found')
        }

        const [workspace] = await db
            .select({ ownerId: workspaces.ownerId })
            .from(workspaces)
            .where(eq(workspaces.id, invitation.workspaceId))
            .limit(1)

        if (!workspace) {
            throw new NotFoundError('Workspace not found')
        }

        const isOwner = workspace.ownerId === userId
        const isInviter = invitation.inviterUserId === userId

        if (!isOwner && !isInviter) {
            throw new ForbiddenError('Not authorized to cancel this invitation')
        }

        if (invitation.status !== INVITATION_PENDING) {
            throw new BadRequestError('Cannot cancel a non-pending invitation')
        }

        await db.update(invitations).set({ status: INVITATION_CANCELLED }).where(eq(invitations.id, invitationId))

        return { message: 'Invitation cancelled successfully' }
    }

    async cleanupExpiredInvitations(): Promise<{ expiredCount: number }> {
        //todo: Cron job to mark expired invitations
        const result = await db
            .update(invitations)
            .set({ status: InvitationType.EXPIRED })
            .where(and(eq(invitations.status, InvitationType.PENDING), lt(invitations.expiresAt, new Date())))
            .returning({ id: invitations.id })

        return { expiredCount: result.length }
    }

    private generateInviteAndHashedTokens(): { inviteToken: string; hashedToken: string } {
        const inviteToken = crypto.randomBytes(32).toString('hex') // 64-character hex string

        const hashedToken = crypto.createHash('sha256').update(inviteToken).digest('hex')

        return {
            inviteToken,
            hashedToken
        }
    }

    private async verifyHashedToken(token: string): Promise<Invitation | null> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        // Find invitation by hashed token
        const invitation = await db
            .select()
            .from(invitations)
            .where(and(eq(invitations.token, hashedToken), eq(invitations.status, InvitationType.PENDING), gt(invitations.expiresAt, new Date())))
            .limit(1)

        return invitation.length > 0 ? invitation[0] : null // null if not found
    }

    private async createInvitation(data: CreateInvitation): Promise<Invitation> {
        const invitation = await db.insert(invitations).values(data).returning({
            id: invitations.id,
            workspaceId: invitations.workspaceId,
            inviterUserId: invitations.inviterUserId,
            inviteeEmail: invitations.inviteeEmail,
            permission: invitations.permission,
            token: invitations.token,
            status: invitations.status,
            expiresAt: invitations.expiresAt,
            createdAt: invitations.createdAt
        })

        return invitation[0]
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

export const invitationService = InvitationService.getInstance()
