import { Router } from 'express'
import express from 'express'

import { authentication } from '@/modules'

// Importing userService, workspaceService, invitationService instances
import { userService } from '@/modules/user'
import { workspaceService } from '@/modules/workspace'
import { invitationService } from '@/modules/invitation'
import { WebhookService } from './webhook.service'

// Initialize the router
const router = Router()

// Extracting AuthController and AuthService from auth module
const { AuthController, AuthService } = authentication

// Initializing dependencies for AuthService
// const userService = new UserService()
const webhookService = new WebhookService()

// Initializing AuthService with its dependencies using dependency injection
const authenticationService = new AuthService(
    userService,
    webhookService,
    workspaceService,
    invitationService
)

// Initializing AuthController with AuthService
const authController = new AuthController(authenticationService)

// POST /webhooks/register - Endpoint to handle Clerk webhooks
router
    .route('/webhooks/register')
    .post(express.raw({ type: 'application/json' }), authController.onboardingUser)

export default router
