import dotenv from 'dotenv'
import z from 'zod';

dotenv.config()

const envSchema = z.object({
    GOOGLE_CLIENT_ID: z.string().nonempty('GOOGLE_CLIENT_ID is required'),
    GOOGLE_CLIENT_SECRET: z.string().nonempty('GOOGLE_CLIENT_SECRET is required'),
    GOOGLE_REDIRECT_URI: z.url().nonempty('GOOGLE_REDIRECT_URI is required')
})

const env = envSchema.parse(process.env)

export const googleConfig = {
    youtube: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        redirectUri: env.GOOGLE_REDIRECT_URI,
        scopes: [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.upload'
        ]
    }
} as const; // 'as const' makes it read-only and provides better TS types