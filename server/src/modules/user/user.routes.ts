import { Router } from 'express'

import { userController } from './user.module'

const router = Router()

router.route('/').post(userController.createNewUser)

export default router
