import { z } from 'zod'

export const envSchema = z.object({
    ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().min(1000).default(5173),
    BACKEND_PROXY: z.string().default('http://localhost:5000'),
    CLERK_PUBLISHABLE_KEY: z.string().min(1, { message: 'CLERK_PUBLISHABLE_KEY is required' })
})

export type Env = z.infer<typeof envSchema>
export type EnvMode = Env['ENV']
