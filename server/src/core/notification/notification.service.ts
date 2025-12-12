import { Novu, SDKOptions } from '@novu/api'

import { logger, NOVU_API_KEY } from '@/config'
import { InternalServerError } from '@/util'
import { CreateNotificationSubscriber, NotificationTrigger } from './notification.types'

export interface INotificationService {
    createSubscriber(data: CreateNotificationSubscriber): Promise<void>
    deleteSubscriber(subscriberId: string): Promise<void>
    trigger<T>(triggerOptions: NotificationTrigger<T>): Promise<void>
}

export class NotificationService implements INotificationService {
    private novu: Novu | null = null
    private isEnabled: boolean = false

    constructor() {
        this.initialize()
    }

    private initialize(): void {
        const apiKey: string = NOVU_API_KEY

        if (!apiKey || apiKey.trim() === '') {
            throw new InternalServerError(
                'Novu API key is not configured properly.',
                'NOVU_API_KEY_MISSING'
            )
        }

        const sdkOptions: SDKOptions = {
            secretKey: apiKey
        }

        try {
            this.novu = new Novu(sdkOptions)
            this.isEnabled = true
        } catch (error) {
            logger.error(`Failed to initialize Novu client: ${(error as Error)?.message}`)
            this.isEnabled = false // Disable notification service on failure
        }
    }

    private isActive(): boolean {
        if (!this.isEnabled || !this.novu) {
            logger.warn('Notification service is disabled.')
            return false
        }
        return true
    }

    /**
     * Creates a new notification subscriber in the Novu notification service.
     *
     * Registers a subscriber with their basic profile information. If the subscriber
     * already exists, the operation silently returns without error. This method only
     * executes if the notification service is active.
     *
     * @async
     * @param data - The subscriber information to create
     * @param data.subscriberId - Unique identifier for the subscriber (e.g., user ID)
     * @param data.firstName - First name of the subscriber
     * @param data.lastName - Last name of the subscriber
     * @param data.email - Email address for notification delivery
     * @param data.avatar - Avatar URL or image identifier for the subscriber's profile
     *
     * @returns {Promise<void>} Resolves when subscriber is successfully created or already exists
     *
     * @throws {InternalServerError} When subscriber creation fails due to service errors
     *
     * @example
     * ```typescript
     * await notificationService.createSubscriber({
     *   subscriberId: 'user-12345',
     *   firstName: 'Jane',
     *   lastName: 'Smith',
     *   email: 'jane.smith@company.com',
     *   avatar: 'https://cdn.example.com/avatars/user-12345.png'
     * });
     * ```
     */

    async createSubscriber(data: CreateNotificationSubscriber): Promise<void> {
        if (!this.isActive()) return

        try {
            // Create subscriber in Novu
            await this.novu!.subscribers.create({
                subscriberId: data.subscriberId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                avatar: data.avatar
            })
        } catch (error) {
            const message = (error as Error)?.message || ''
            if (message.includes('already exists')) {
                return
            }

            logger.error(`Failed to create subscriber: ${message}`)

            throw new InternalServerError(
                'Failed to create subscriber in notification service.',
                'NOVU_CREATE_SUBSCRIBER_FAILED'
            )
        }
    }

    async deleteSubscriber(subscriberId: string): Promise<void> {
        if (!this.isActive()) {
            return
        }

        try {
            await this.novu!.subscribers.delete(subscriberId)
        } catch (error) {
            const message = (error as Error)?.message || ''
            if (message.includes('not found')) {
                return
            }
            logger.error(`Failed to delete subscriber: ${message}`)

            throw new InternalServerError(
                'Failed to delete subscriber from notification service.',
                'NOVU_DELETE_SUBSCRIBER_FAILED'
            )
        }
    }

    async trigger<T>(triggerOptions: NotificationTrigger<T>): Promise<void> {
        if (!this.isActive()) {
            return
        }

        try {
            await this.novu!.trigger({
                workflowId: triggerOptions.workflowId,
                to: { subscriberId: triggerOptions.subscriberId },
                payload: triggerOptions.payload as Record<string, unknown>
            })
        } catch (error) {
            logger.error(`Failed to trigger notification: ${(error as Error)?.message}`)

            throw new InternalServerError(
                'Failed to trigger notification.',
                'NOVU_TRIGGER_NOTIFICATION_FAILED'
            )
        }
    }
}
