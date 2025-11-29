import { Router } from 'express'
import express from 'express'
import { auth } from '@/modules'
// import { AuthService } from '../../modules/auth/auth.service'

const router = Router()

// Extracting AuthController and AuthService from auth module
const { AuthController, AuthService } = auth

const authController = new AuthController(new AuthService())

router.route('/webhooks/register').post(express.raw({ type: 'application/json' }), authController.onboardingUser)

export default router
