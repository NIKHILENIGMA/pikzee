export enum WebhookProvider {
    CLERK = 'CLERK',
    RAZORPAY = 'RAZORPAY'
}

export interface WebhookRequest {
    provider: WebhookProvider
    headers: Record<string, string>
    body: Buffer | string
}

export interface WebhookResponse {
    success: boolean
    message: string
    data?: unknown
}

export interface IWebhookHandler<T> {
    parse(raw: Buffer | string): T
    handle(payload: T): Promise<void>
}

export interface IWebhookValidator {
    validateSignature(
        provider: WebhookProvider,
        headers: Record<string, string>,
        body: Buffer | string
    ): boolean
}

export type WebhookHandler = Record<WebhookProvider, IWebhookHandler<unknown>>

// Clerk Webhook Types
export enum ClerkEvent {
    USER_CREATED = 'user.created',
    USER_UPDATED = 'user.updated',
    USER_DELETED = 'user.deleted'
}

// Razorpay Webhook Types
export interface RazorpayWebhookEvent {
    event: string
    payload: {
        payment: {
            entity: unknown
        }
    }
}

export enum RazorpayEvent {
    CREATED = 'payment.captured',
    FAILED = 'payment.failed',
    ORDER_PAID = 'order.paid'
}
