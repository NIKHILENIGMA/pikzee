// import { WebhookEvent } from '@clerk/express'
// import { Request } from 'express'
// import { Webhook } from 'svix'
// import { CLERK_WEBHOOK_SIGNING_SECRET } from '@/config'
// import { InternalServerError } from '@/util'
// import { SVIX_HEADER_KEYS } from '@/constants/auth.constants'

import { InternalServerError } from '@/util'

import {
    IWebhookHandler,
    IWebhookValidator,
    WebhookHandler,
    WebhookRequest,
    WebhookResponse
} from './webhook.types'

export interface IWebhookService {
    processWebhook(request: WebhookRequest): Promise<WebhookResponse>
}

export class WebhookService implements IWebhookService {
    constructor(
        private handlers: WebhookHandler,
        private validator: IWebhookValidator
    ) {}

    public async processWebhook(request: WebhookRequest): Promise<WebhookResponse> {
        const { provider, headers, body } = request

        try {
            // Get the appropriate handler based on the provider
            const handler: IWebhookHandler<unknown> = this.handlers[provider]
            if (!handler) {
                throw new InternalServerError(`No handler found for provider: ${provider}`)
            }

            // Validate the webhook signature
            const isValid: boolean = this.validator.validateSignature(provider, headers, body)
            if (!isValid) {
                throw new InternalServerError('Invalid webhook signature')
            }

            // Parse the body
            const parsedBody = handler.parse(body)

            // Process the webhook using the appropriate handler
            const result = await handler.handle(parsedBody)

            return {
                success: true,
                message: `Webhook processed successfully ${provider}`,
                data: result
            }
        } catch (error: unknown) {
            let errorMessage = 'An unknown error occurred'
            if (error instanceof Error) {
                errorMessage = error.message
            } else if (typeof error === 'string') {
                errorMessage = error
            }

            return {
                success: false,
                message: `Error processing webhook: ${errorMessage}`
            }
        }
    }
}

// Example instantiation and usage:
// export const webhookService = new WebhookService(
//     new Map<WebhookProvider, IClerkWebhookService | IRazorpayWebhookService>([
//         [WebhookProvider.CLERK, new ClerkWebhookHandler()],
//     ]),
//     new WebhookValidation()
// )

// webhookService.processWebhook({
//     provider: WebhookProvider.CLERK,
//     headers: {},
//     body: ''
// })

// export interface IWebhookService {
//     verifyClerkWebhook(req: Request): WebhookEvent
// }

// export class WebhookService implements IWebhookService {
//     private wh: Webhook
//     constructor() {
//         this.wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET)
//     }

//     public verifyClerkWebhook(req: Request): WebhookEvent {
//         if (!Buffer.isBuffer(req.body)) {
//             throw new InternalServerError(
//                 'Webhook body must be raw Buffer. Ensure express.raw() middleware is applied.'
//             )
//         }

//         // Extract Svix headers from the request
//         const headers = {
//             svixId: req.headers[SVIX_HEADER_KEYS.ID] as string,
//             svixTimestamp: req.headers[SVIX_HEADER_KEYS.TIMESTAMP] as string,
//             svixSignature: req.headers[SVIX_HEADER_KEYS.SIGNATURE] as string
//         }

//         // Verify the webhook signature
//         const evt = this.wh.verify(req.body, {
//             'svix-id': headers.svixId,
//             'svix-timestamp': headers.svixTimestamp,
//             'svix-signature': headers.svixSignature
//         }) as WebhookEvent //note: wh.verify is not async method

//         return evt
//     }
// }

// export const webhookService = new WebhookService()
