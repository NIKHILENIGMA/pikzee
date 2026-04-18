import { clerkMiddleware } from '@/middlewares'
import { Router } from 'express'
import { aiController } from './ai.module'

const router = Router()

router
    .route('/generate')
    .post(clerkMiddleware, aiController.streamAIContent) // Handler for streaming AI-generated content

export default router
