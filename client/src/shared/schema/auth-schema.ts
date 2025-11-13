import z from 'zod'

export const loginSchema = z.object({
    email: z.email({ pattern: z.regexes.email, message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(100, { message: 'Password must be at most 100 characters long' })
})

export const signupSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }).max(50, { message: 'First name is too long' }),
    lastName: z.string().min(1, { message: 'Last name is required' }).max(50, { message: 'Last name is too long' }),
    email: z.email({ pattern: z.regexes.email, message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(100, { message: 'Password must be at most 100 characters long' })
        .and(
            z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            })
        )
})
