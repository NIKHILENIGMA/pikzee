export const WORKFLOW_ID = {
    WELCOME_EMAIL: 'user-welcome',
    INVITE_USER: 'invite-user',
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

export interface SendInvitationEmailDTO {
    email: string
    inviterName: string
    workspaceName: string
    signupLink: string
    customMessage: string
}