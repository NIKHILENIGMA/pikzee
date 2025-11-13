import { envSchema } from './env'

// Only safe to access import.meta.env here
export const clientEnv = envSchema.parse({
    ENV: import.meta.env.VITE_ENV,
    PORT: import.meta.env.VITE_PORT,
    BACKEND_PROXY: import.meta.env.VITE_BACKEND_PROXY,
    CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
})

export default clientEnv
