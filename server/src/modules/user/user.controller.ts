import { NextFunction, Request, Response } from 'express'

import { BaseController, ValidationService } from '@/lib'
import { IUserService } from './user.service'
import { NewUserSchema } from './user.validation'

export class UserController extends BaseController {
    constructor(private readonly userService: IUserService) {
        super()
    }

    createNewUser = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async () => {
            const body = ValidationService.validateBody(req.body, NewUserSchema)

            const newUser = await this.userService.createUser({
                id: '', // ID will be generated in service/repository layer
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName
            })

            return {
                statusCode: 201,
                message: 'User created successfully',
                data: newUser
            }
        })
    }
}
