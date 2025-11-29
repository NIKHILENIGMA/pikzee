import { NotificationChannel, WorkflowConfig } from '@/types/notification/notification.types'

export enum WORKFLOWS_KEYS {
    WELCOME_EMAIL = 'WELCOME_EMAIL',
    INVITE_USER = 'INVITE_USER',
    PASSWORD_RESET = 'PASSWORD_RESET'
}

export const WORKFLOWS: Record<string, WorkflowConfig> = {
    WELCOME_EMAIL: {
        id: 'welcome-email',
        name: 'Welcome Email',
        description: 'Sent when a new user signs up',
        tags: ['user', 'welcome'],
        channels: [NotificationChannel.EMAIL]
    },
    INVITE_USER: {
        id: 'invite-user',
        name: 'Invite User',
        description: 'Sent when a user is invited to a workspace',
        tags: ['user', 'invite'],
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP]
    },
    PASSWORD_RESET: {
        id: 'password-reset',
        name: 'Password Reset',
        description: 'Sent when user requests password reset',
        tags: ['user', 'password'],
        channels: [NotificationChannel.EMAIL]
    }
}
