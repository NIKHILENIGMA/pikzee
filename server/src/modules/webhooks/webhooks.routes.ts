import express, { Router } from 'express'

import { webhookController } from './webhook.module'

// Initialize the router
const router = Router()

// POST /webhooks/register - Endpoint to handle Clerk webhooks
router
    .route('/webhooks/register')
    .post(express.raw({ type: 'application/json' }), webhookController.onboarding)

export default router
