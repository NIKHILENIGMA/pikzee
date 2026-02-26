import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

// export const BUCKET_NAME: string = process.env.AWS_S3_BUCKET_NAME!
// export const ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID!
// export const SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY!
// export const REGION: string = process.env.AWS_REGION!
// export const URL_EXPIRATION_SECONDS: number = Number(process.env.URL_EXPIRATION_SECONDS)

const envSchema = z.object({
    AWS_PRIVATE_BUCKET: z.string().nonempty('AWS_PRIVATE_BUCKET is required'),
    AWS_PUBLIC_BUCKET: z.string().nonempty('AWS_PUBLIC_BUCKET is required'),
    AWS_ACCESS_KEY_ID: z.string().nonempty('AWS_ACCESS_KEY_ID is required'),
    AWS_SECRET_ACCESS_KEY: z.string().nonempty('AWS_SECRET_ACCESS_KEY is required'),
    AWS_REGION: z.string().nonempty('AWS_REGION is required'),
    URL_EXPIRATION_SECONDS: z.string().optional().default('120') // default to 2 minutes if not provided
})

const env = envSchema.parse(process.env) // Validate env vars at startup

export const awsConfig = {
    s3: {
        privateBucket: env.AWS_PRIVATE_BUCKET,
        publicBucket: env.AWS_PUBLIC_BUCKET,
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        region: env.AWS_REGION,
        urlExpiration: Number(env.URL_EXPIRATION_SECONDS)
    }
}
