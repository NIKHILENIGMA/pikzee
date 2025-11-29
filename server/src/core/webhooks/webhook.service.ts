import { WebhookEvent } from '@clerk/express'
import { Request } from 'express'
import { Webhook } from 'svix'

import { CLERK_WEBHOOK_SIGNING_SECRET } from '@/config'
import { InternalServerError } from '@/util'
import { SVIX_HEADER_KEYS } from '@/constants/auth.constants'

export class WebhookService {
    private wh: Webhook
    constructor() {
        this.wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET)
    }

    public verifyClerkWebhook(req: Request): WebhookEvent {
        if (!Buffer.isBuffer(req.body)) {
            throw new InternalServerError('Webhook body must be raw Buffer. Ensure express.raw() middleware is applied.')
        }

        const headers = {
            svixId: req.headers[SVIX_HEADER_KEYS.ID] as string,
            svixTimestamp: req.headers[SVIX_HEADER_KEYS.TIMESTAMP] as string,
            svixSignature: req.headers[SVIX_HEADER_KEYS.SIGNATURE] as string
        }

        // Verify the webhook signature
        const evt = this.wh.verify(req.body, {
            'svix-id': headers.svixId,
            'svix-timestamp': headers.svixTimestamp,
            'svix-signature': headers.svixSignature
        }) as WebhookEvent //note: wh.verify is not async method

        return evt
    }
}

export const webhookService = new WebhookService()
