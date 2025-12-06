import { Request } from 'express'
import { UserJSON, WebhookEvent } from '@clerk/express'

import { NotFoundError } from '@/util/StandardError'

import { User } from '@/core'
import { IInvitationService } from '@/modules/invitation/invitation.service'
import { IUserService } from '../user'
import { IWorkspaceService } from '../workspace/workspace.service'
import { IWebhookService } from '@/core/webhooks/webhook.service'

export class AuthService {
    constructor(
        private readonly userService: IUserService,
        private readonly webhookService: IWebhookService,
        private readonly workspaceService: IWorkspaceService,
        private readonly invitationService: IInvitationService
    ) {}

    async handleClerkWebhook(req: Request) {
        const evt: WebhookEvent = this.webhookService.verifyClerkWebhook(req)

        const { type } = evt

        // Handle different event types
        switch (type) {
            case 'user.created':
                return await this.handleUserCreated(evt)
            case 'user.updated':
                // Handle user updated event if needed
                return
            case 'user.deleted':
                // Handle user deleted event if needed
                return
            default:
                throw new NotFoundError(
                    `Unhandled webhook event type: ${type}`,
                    'UNHANDLED_WEBHOOK_EVENT'
                )
        }
    }

    async handleUserCreated(event: WebhookEvent): Promise<User> {
        const {
            id: clerkId,
            email_addresses,
            primary_email_address_id,
            image_url,
            first_name,
            last_name,
            unsafe_metadata
        } = event.data as UserJSON

        // Find the primary email address
        const primaryEmail = email_addresses.find(
            (e: { id: string }) => e.id === primary_email_address_id
        )?.email_address
        if (!primaryEmail) {
            throw new NotFoundError('Primary email not found', 'PRIMARY_EMAIL_NOT_FOUND')
        }

        // Upsert the user in our database
        const newUser = await this.userService.createUser({
            id: clerkId,
            email: primaryEmail,
            firstName: first_name || '',
            lastName: last_name || '',
            avatarUrl: image_url || '',
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // Create a default workspace for the new user
        await this.workspaceService.create({
            name: `${newUser.firstName}'s Workspace`,
            ownerId: newUser.id
        })

        // Check for invitation token in unsafe metadata then accept invitation if present
        if (unsafe_metadata) {
            const token = unsafe_metadata['inviteToken'] as string
            if (token) {
                await this.invitationService.acceptInvitation(token, newUser.id)
            }
        }

        return newUser
    }
}
