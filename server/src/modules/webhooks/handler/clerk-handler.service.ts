import { INotificationService } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'
import { logger } from '@/config'
import { UserRepository } from '@/modules/user/user.repository'
import { WorkspaceRepository } from '@/modules/workspace/workspace.repository'
import { InternalServerError, NotFoundError } from '@/util'

import { IInvitationService } from '@/modules/invitation/invitation.service'
import { InvitationRepository } from '@/modules/invitation/invitation.repository'

import { ClerkEventType, ClerkUser, ClerkWebhookEvent, IWebhookHandler } from '../webhook.types'
import { ClerkWebhookEventSchema } from '../webhook.validator'

export class ClerkWebhookHandler implements IWebhookHandler<ClerkWebhookEvent, void> {
    constructor(
        private readonly db: DatabaseConnection,
        private readonly notificationService: INotificationService,
        private readonly invitationService: IInvitationService
    ) {}

    parse(raw: Buffer | string): ClerkWebhookEvent {
        if (!Buffer.isBuffer(raw)) {
            throw new InternalServerError('Raw body must be a Buffer for Clerk webhook parsing')
        }
        const parsedBody: unknown = JSON.parse(raw.toString())
        return ClerkWebhookEventSchema.parse(parsedBody)
    }

    async handle(body: ClerkWebhookEvent): Promise<void> {
        const { type, data } = body

        switch (type) {
            case ClerkEventType.USER_CREATED:
                // Handle user created event
                return await this.handleUserCreated(data)

            case ClerkEventType.USER_UPDATED:
                // Handle user updated event
                return await this.handleUserUpdated(data)
            case ClerkEventType.USER_DELETED:
                // Handle user deleted event
                return await this.handleUserDeleted(data)
            default:
                logger.info(`Received unhandled Clerk event type: ${String(type)}`)
                throw new NotFoundError('Unhandled Clerk event type', 'UNHANDLED_EVENT_TYPE')
        }
    }

    private async handleUserCreated(data: ClerkUser) {
        // Find the primary email address
        const primaryEmail = data.email_addresses.find(
            (e: { id: string }) => e.id === data.primary_email_address_id
        )?.email_address
        if (!primaryEmail) {
            throw new NotFoundError('Primary email not found', 'PRIMARY_EMAIL_NOT_FOUND')
        }

        const result = await this.db.transaction(async (tx) => {
            const userRepo = new UserRepository(tx)
            const workspaceRepo = new WorkspaceRepository(tx)
            const invitationRepo = new InvitationRepository(tx)

            const existingUser = await userRepo.getByEmail(primaryEmail)

            if (existingUser) {
                throw new InternalServerError(
                    'User with this email already exists',
                    'USER_ALREADY_EXISTS'
                )
            }

            // Create the user
            const newUser = await userRepo.create({
                id: data.id,
                email: primaryEmail,
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                avatarUrl: data.image_url || null
            })

            // Create a default workspace for the new user
            const workspace = await workspaceRepo.createWorkspaceWithMemberAsAdmin({
                name: `${data.first_name}'s Workspace`,
                ownerId: newUser.id
            })

            // Set the default workspace for the user
            await userRepo.update(newUser.id, {
                defaultWorkspaceId: workspace.id
            })
            logger.info(`Created default workspace ${workspace.id} for user ${newUser.id}`)
            // Accept the inivitation if token is present in unsafe metadata
            if (data.unsafe_metadata) {
                const token = data.unsafe_metadata.invite_token
                logger.info(`Processing invitation acceptance for user ${newUser.id} with token ${token}`)
                
                if (token) {
                    const hashToken = this.invitationService.hashInvitationToken(token)

                    const invitation = await invitationRepo.getByToken(hashToken)
                    logger.info(`Found invitation ${invitation?.id} for token ${token}`)

                    if (invitation) {
                        await invitationRepo.addMemberAndMarkAccept({
                            invitationId: invitation.id,
                            inviteeUserId: newUser.id,
                            workspaceId: invitation.workspaceId,
                            token: invitation.token,
                            permission: invitation.permission
                        })
                    }

                    logger.info(`Processed completion of invitation acceptance for user ${newUser.id} with token ${token}`)
                    // 

                    // Clear the invite_token from user's unsafe metadata
                    // await clerkClient.users.updateUser(data.id, {
                    //     unsafeMetadata: { invite_token: null }
                    // })
                }
            }

            return newUser
        })

        await this.notificationService.sendWelcomEmail({
            id: result.id,
            email: result.email,
            firstName: result.firstName!,
            lastName: result.lastName!,
            avatar: result.avatarUrl || undefined
        })
    }

    private async handleUserUpdated(data: ClerkUser) {
        // Implement user updated handling logic
        await Promise.resolve()
        logger.info(`Handling Clerk user.updated event: ${JSON.stringify(data)}`)
    }

    private async handleUserDeleted(data: ClerkUser) {
        // Implement user deleted handling logic
        await Promise.resolve()
        logger.info(`Handling Clerk user.deleted event: ${JSON.stringify(data)}`)
    }
}
