import { NextFunction, Request, Response } from 'express'
import { IWebhookService } from './webhook.service'
import { BaseController } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'
import { WebhookProvider } from './webhook.types'

export class WebhookController extends BaseController {
    constructor(private webhookService: IWebhookService) {
        super()
    }

    onboarding = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            // Process the webhook
            await this.webhookService.processWebhook({
                provider: WebhookProvider.CLERK, // or determine based on req
                headers: req.headers as Record<string, string>,
                body: req.body as Buffer | string
            })

            // Return a success response
            return this.createResponse<null>({
                statusCode: STATUS_CODE.OK,
                message: 'Clerk webhook processed successfully',
                data: null
            })
        })
    }
}
