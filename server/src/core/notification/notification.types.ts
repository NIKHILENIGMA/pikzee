export const WORKFLOW_ID = {
    WELCOME_EMAIL: 'user-welcome',
    INVITE_USER: 'user-invite',
    PASSWORD_RESET: 'user-password-reset'
} as const

export interface CreateSubscriberDTO {
    subscriberId: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
}

export interface SendWelcomeEmailDTO {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
}

export interface SendInvitationDTO {
    subscriber: {
        id: string
        email: string
        firstName: string
        lastName: string
        avatar?: string
    }
    inviterName: string
    workspaceName: string
    accpetLink: string
    rejectLink: string
    customMessage: string
}

export interface CreateNotificationSubscriber {
    subscriberId: string
    email?: string
    firstName?: string
    lastName?: string
    avatar?: string
}

export interface NotificationTrigger<T> {
    subscriberId: string
    workflowId: string
    type: NotificationChannel
    to?: {
        email?: string
        firstName?: string
        lastName?: string
    }
    payload: T
}

export enum NotificationChannel {
    EMAIL = 'email',
    IN_APP = 'in_app'
}

export interface WorkflowConfig {
    id: string
    name: string
    description?: string
    tags?: string[]
    channels: NotificationChannel[]
}