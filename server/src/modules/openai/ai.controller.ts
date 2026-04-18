import { NextFunction, Request, Response } from 'express'

import { BaseController, ValidationService } from '@/lib'
import { UnauthorizedError } from '@/util'

import { IAIService } from './ai.service'

import { DraftQuerySchema } from '../draft/draft.validator'

import { GenerateContentBodySchema } from './ai.validator'

export class AIController extends BaseController {
    constructor(private readonly service: IAIService) {
        super()
    }

    streamAIContent = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
        const abortController = new AbortController()

        const sendEvent = (event: string, data: unknown) => {
            res.write(`event: ${event}\n`)
            res.write(`data: ${JSON.stringify(data)}\n\n`)
        }

        try {
            const userId: string | undefined = req.user?.id
            if (!userId) throw new UnauthorizedError('User not authenticated')

            const query = ValidationService.validateQuery(req.query, DraftQuerySchema)
            const body = ValidationService.validateBody(req.body, GenerateContentBodySchema)

            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache, no-transform')
            res.setHeader('Connection', 'keep-alive')
            res.setHeader('X-Accel-Buffering', 'no')
            res.flushHeaders?.()

            const onClose = () => {
                abortController.abort()
            }
            req.on('close', onClose)

            sendEvent('start', { ok: true })

            for await (const token of this.service.streamGeneratedContent(
                {
                    userId,
                    workspaceId: query.workspaceId,
                    prompt: body.prompt
                },
                abortController.signal
            )) {
                sendEvent('chunk', { token })
            }

            sendEvent('done', { ok: true })
            req.off('close', onClose)
            res.end()
        } catch (error) {
            // If client disconnected, request is aborted; avoid noisy error writes
            if (abortController.signal.aborted) {
                res.end()
                return
            }

            const message = error instanceof Error ? error.message : 'Failed to stream AI content'

            try {
                sendEvent('error', { message })
            } catch {
                // ignore write failure if socket already closed
            }

            res.end()
        }
    }
}

