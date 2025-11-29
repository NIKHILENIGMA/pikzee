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
