import { Novu, SDKOptions } from '@novu/api'

import { logger, NOVU_API_KEY } from '@/config'
import { InternalServerError } from '@/util'

import {
    CreateSubscriberDTO,
    SendInvitationDTO,
    SendWelcomeEmailDTO,
    WORKFLOW_ID
} from './notification.types'

export interface INotificationService {
    sendWelcomEmail(payload: SendWelcomeEmailDTO): Promise<void>
    sendInvitationEmail(param: SendInvitationDTO): Promise<void>
    sendInAppInvitation(param: SendInvitationDTO): Promise<void>
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

    private async createSubscriber(params: CreateSubscriberDTO): Promise<void> {
        if (!this.isActive()) {
            return
        }

        try {
            // Extract subscriber details
            const { subscriberId, email, firstName, lastName, avatar } = params

            // Check if subscriber exists
            const subscriber = await this.novu!.subscribers.create({
                subscriberId: subscriberId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                avatar: avatar,
                locale: 'en_US',
                timezone: 'America/New_York'
            })

            logger.info(`Subscriber ensured: ${JSON.parse(JSON.stringify(subscriber))}`)
        } catch (error) {
            logger.error(`Failed to ensure subscriber: ${(error as Error)?.message}`)
            throw new InternalServerError(
                'Failed to ensure subscriber in notification service.',
                'NOVU_ENSURE_SUBSCRIBER_FAILED'
            )
        }
    }

    async sendWelcomEmail(payload: SendWelcomeEmailDTO): Promise<void> {
        if (!this.isActive()) {
            return
        }

        // Extract user details from payload
        const { id, email, firstName, lastName, avatar } = payload

        // Ensure subscriber exists
        await this.createSubscriber({
            subscriberId: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            avatar: avatar
        })

        // Trigger welcome email workflow
        const triggered = await this.novu!.trigger({
            workflowId: WORKFLOW_ID.WELCOME_EMAIL,
            to: {
                subscriberId: id
            }
        })

        logger.info(`Welcome email triggered: ${triggered.result}`)
    }

    async sendInAppInvitation(param: SendInvitationDTO): Promise<void> {
        if (!this.isActive()) {
            return
        }

        // Trigger invitation in-app notification
        await this.novu!.trigger({
            workflowId: WORKFLOW_ID.INVITE_USER,
            to: {
                subscriberId: param.subscriber.id
            },
            payload: {
                inviterName: param.inviterName,
                workspaceName: param.workspaceName,
                accpetLink: param.accpetLink,
                rejectLink: param.rejectLink,
                customMessage: param.customMessage
            }
        })
    }

    async sendInvitationEmail(param: SendInvitationDTO): Promise<void> {
        if (!this.isActive()) {
            return
        }

        // Extract invitation details from payload
        const { subscriber, inviterName, workspaceName, accpetLink, customMessage } = param

        // Create or ensure subscriber exists
        await this.createSubscriber({
            subscriberId: subscriber.id,
            email: subscriber.email,
            firstName: subscriber.firstName,
            lastName: subscriber.lastName,
            avatar: subscriber.avatar
        })

        // Trigger invitation in-app notification
        await this.novu!.trigger({
            workflowId: WORKFLOW_ID.INVITE_USER,
            to: {
                subscriberId: subscriber.id
            },
            payload: {
                inviterName: inviterName,
                workspaceName: workspaceName,
                invitationLink: accpetLink,
                customMessage: customMessage
            }
        })
    }
}
