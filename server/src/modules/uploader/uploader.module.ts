import { ACCESS_KEY_ID, BUCKET_NAME, REGION, SECRET_ACCESS_KEY } from '@/config'
import { S3Provider } from './providers/s3.provider'
import { Uploader } from './uploader.service'
import { UploaderController } from './uploader.controller'

const s3Provider = new S3Provider({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
    bucket: BUCKET_NAME
})

export const uploaderService = Uploader.getInstance(s3Provider)

export const uploaderController = new UploaderController()