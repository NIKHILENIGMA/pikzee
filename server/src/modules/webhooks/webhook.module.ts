import { userService } from '../user'
import { workspaceService } from '../workspace'

import { WebhookValidation } from './webhook-validator'
import { ClerkWebhookHandler } from './handler/clerk-handler.service'
import { RazorpayWebhookHandler } from './handler/razor-handler.service'
import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'
import { WebhookHandler, WebhookProvider } from './webhook.types'

// Instantiate the webhook validator
const validator = new WebhookValidation()

// Map providers to their respective handlers
const handlers: WebhookHandler = {
    [WebhookProvider.CLERK]: new ClerkWebhookHandler(userService, workspaceService),
    [WebhookProvider.RAZORPAY]: new RazorpayWebhookHandler() // Add Razorpay handler when implemented
}

// Instantiate the WebhookService with handlers and validator
const webhookService = new WebhookService(handlers, validator)

// Instantiate the WebhookController with the webhook service
const webhookController = new WebhookController(webhookService)

export { webhookService, webhookController }
