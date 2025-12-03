import { NextFunction, Request, Response } from 'express'

import { BaseController } from '@/lib'
import { StatusCode } from '@/types/api/success.types'

import { AuthService } from './auth.service'

export interface ControllerResponse<T> {
    status: StatusCode
    message: string
    data: T
}

export class AuthController extends BaseController {
    constructor(private authService: AuthService) {
        super()
    }

    onboardingUser = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<ControllerResponse<typeof newUser>> => {
            const newUser = await this.authService.handleClerkWebhook(req)

            return {
                status: StatusCode.CREATED,
                message: 'User onboarded successfully',
                data: newUser
            }
        })
    }
}
