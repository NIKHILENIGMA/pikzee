import { logger } from '@/config'
import { IUserService } from '@/modules/user'
import { IWorkspaceService } from '@/modules/workspace'
import { InternalServerError, NotFoundError } from '@/util'

import { ClerkEventType, ClerkUser, ClerkWebhookEvent, IWebhookHandler } from '../webhook.types'
import { ClerkWebhookEventSchema } from '../webhook.validator'

export class ClerkWebhookHandler implements IWebhookHandler<ClerkWebhookEvent, void> {
    constructor(
        private readonly userService: IUserService,
        private readonly workspaceService: IWorkspaceService
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

        // Implement user created handling logic
        const createdUser = await this.userService.createUser({
            id: data.id,
            email: primaryEmail,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            avatarUrl: data.image_url || null
        })

        // Create a default workspace for the new user
        await this.workspaceService.createWorkspaceWithOwnerPermission({
            name: `${data.first_name}'s Workspace`,
            ownerId: createdUser.id
        })

        // todo: Handle invitation acceptance if invitation token is present in metadata
        // if (data.unsafe_metadata) {
        //     // If invitation token is present in metadata, handle invitation acceptance
        //     const invitationToken = data.unsafe_metadata['invitationToken']
        //     if (invitationToken) {
        //         try {
        //             // await this.workspaceService.acceptInvitation(invitationToken, createdUser.id)
        //             // logger.info(
        //             //     `User ${createdUser.id} accepted invitation with token ${invitationToken}`
        //             // )
        //             await Promise.resolve()
        //         } catch (error) {
        //             logger.error(
        //                 `Failed to accept invitation for user ${createdUser.id} with token ${JSON.stringify(invitationToken)}: ${
        //                     (error as Error).message
        //                 }`
        //             )
        //         }
        //     }
        // }
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
