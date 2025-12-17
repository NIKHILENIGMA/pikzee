import type z from 'zod'

import { loginSchema, signupSchema } from '@/shared/schema/auth-schema'

// Infer the LoginFormRequest type from the loginSchema
export type LoginFormRequest = z.infer<typeof loginSchema>

export type SignupFormRequest = z.infer<typeof signupSchema> & {
    token?: string
}
