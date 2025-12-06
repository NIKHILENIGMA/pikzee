import { NextFunction, Request, Response } from 'express'

import { BaseController } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'

import { AuthService } from './auth.service'

export class AuthController extends BaseController {
    constructor(private authService: AuthService) {
        super()
    }

    onboardingUser = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(
            req,
            res,
            next,
            async (): Promise<SuccessResponse<typeof newUser>> => {
                const newUser = await this.authService.handleClerkWebhook(req)

                return {
                    statusCode: STATUS_CODE.CREATED,
                    message: 'User onboarded successfully',
                    data: newUser
                }
            }
        )
    }
}
