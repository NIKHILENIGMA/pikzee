import { Router } from 'express'
import express from 'express'

import { auth } from '@/modules'
import { UserService } from '@/modules/admin/user.service'
import { InvitationService } from '@/modules/invitation/invitation.service'
import { WorkspaceService } from '@/modules/workspace/workspace.service'
import { NotificationService } from '../notification/notification.service'
import { MemberService } from '@/modules/members/member.service'

import { WebhookService } from './webhook.service'

// Initialize the router
const router = Router()

// Extracting AuthController and AuthService from auth module
const { AuthController, AuthService } = auth

// Initializing dependencies for AuthService
const userService = new UserService()
const webhookService = new WebhookService()
const workspaceService = new WorkspaceService()
const invitationService = new InvitationService(new NotificationService(), new MemberService())

// Initializing AuthService with its dependencies using dependency injection
const authenticationService = new AuthService(userService, webhookService, workspaceService, invitationService)

// Initializing AuthController with AuthService
const authController = new AuthController(authenticationService)

// POST /webhooks/register - Endpoint to handle Clerk webhooks
router.route('/webhooks/register').post(express.raw({ type: 'application/json' }), authController.onboardingUser)

export default router
