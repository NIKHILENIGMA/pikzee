import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const envSchema = z.object({
    OPENAI_API_KEY: z.string().nonempty('OPENAI_API_KEY is required')
})

const env = envSchema.parse(process.env) // Validate env vars at startup

export const openaiConfig = {
    apiKey: env.OPENAI_API_KEY
}

