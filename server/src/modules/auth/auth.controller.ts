import { NextFunction, Request, Response } from 'express'

import { BaseController } from '@/lib'
import { AuthService } from './auth.service'

export class AuthController extends BaseController {
    constructor(private authService: AuthService) {
        super()
    }

    onboardingUser = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const newUser = await this.authService.handleClerkWebhook(req)

            return {
                status: 201,
                message: 'User onboarded successfully',
                data: newUser
            }
        })
    }
}
