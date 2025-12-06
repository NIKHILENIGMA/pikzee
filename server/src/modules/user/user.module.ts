import { db } from '@/core/db/connection'
import { UserRepository } from './user.repository'
import { IUserService, UserService } from './user.service'
import { UserController } from './user.controller'

const userRepository = new UserRepository(db)
const userService = new UserService(userRepository)

const userController = new UserController(userService)

export { userService, IUserService, userController }
