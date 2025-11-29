import { Request } from 'express'
import { UserJSON, WebhookEvent } from '@clerk/express'

import { NotFoundError } from '@/util/StandardError'
import { WebhookService } from '@/core/webhooks/webhook.service'

import { UserService } from '../admin/user.service'
import { User } from '@/core'
import { WorkspaceService } from '../workspace'

export class AuthService {
    private readonly userService: UserService
    private readonly webhookService: WebhookService
    private readonly workspaceService: WorkspaceService

    constructor() {
        this.userService = new UserService()
        this.webhookService = new WebhookService()
        this.workspaceService = new WorkspaceService()
    }

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
                throw new NotFoundError(`Unhandled webhook event type: ${type}`, 'UNHANDLED_WEBHOOK_EVENT')
        }
    }

    async handleUserCreated(event: WebhookEvent): Promise<User> {
        const { id: clerkId, email_addresses, primary_email_address_id, image_url, first_name, last_name } = event.data as UserJSON

        // Find the primary email address
        const primaryEmail = email_addresses.find((e: { id: string }) => e.id === primary_email_address_id)?.email_address
        if (!primaryEmail) {
            throw new NotFoundError('Primary email not found', 'PRIMARY_EMAIL_NOT_FOUND')
        }

        const newUser = await this.userService.upsertClerkUser({
            id: clerkId,
            email: primaryEmail,
            firstName: first_name || '',
            lastName: last_name || '',
            avatarUrl: image_url || '',
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // Create a default workspace for the new user
        await this.workspaceService.createWorkspace({
            name: `${newUser.firstName}'s Workspace`,
            ownerId: newUser.id
        })

        return newUser
    }
}

export const authService = new AuthService()
