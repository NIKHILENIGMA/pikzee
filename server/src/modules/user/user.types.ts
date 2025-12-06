import z from 'zod'

import { NewUserSchema } from './user.validation'

export type NewUser = z.infer<typeof NewUserSchema>
