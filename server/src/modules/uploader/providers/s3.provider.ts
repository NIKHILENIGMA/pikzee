import {
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
    UploadPartCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { logger } from '@/config'

import {
    CompleteMultipartUploadOptions,
    CompleteMultipartUploadResponse,
    GenerateUploadUrlResult,
    InitiateMultipartUploadOptions,
    MultipartUploadPart,
    StorageProvider,
    UploadOptions,
    UploadResult
} from '../uploader.types'
import { InternalServerError } from '@/util'

interface S3Config {
    accessKeyId: string
    secretAccessKey: string
    region: string
    bucket: string
    endpoint?: string
}

export class S3Provider implements StorageProvider {
    private bucket: string
    private client: S3Client

    constructor(config: S3Config) {
        this.bucket = config.bucket
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey
            },
            ...(config.endpoint && { endpoint: config.endpoint })
        })
    }

    async upload(file: Buffer | string, options: UploadOptions = {}): Promise<UploadResult> {
        const buffer = typeof file === 'string' ? Buffer.from(file, 'base64') : file
        const key = this.generateKey(options)

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ACL: options.public ? 'public-read' : 'private',
            Metadata: options.metadata
        })

        await this.client.send(command)

        const url = options.public
            ? `https://${this.bucket}.s3.amazonaws.com/${key}`
            : await this.getUrl(key)

        return {
            url,
            key,
            provider: 'S3',
            metadata: options.metadata
        }
    }

    async delete(key: string): Promise<boolean> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key
            })
            await this.client.send(command)
            return true
        } catch (error) {
            console.error('S3 delete error:', error)
            return false
        }
    }

    async getUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        })
        return getSignedUrl(this.client, command, { expiresIn: 3600 })
    }

    async generateUploadUrl(options: UploadOptions = {}): Promise<GenerateUploadUrlResult> {
        const key = this.generateKey(options)
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ACL: options.public ? 'public-read' : 'private',
            Metadata: options.metadata
        })
        const uploadUrl = await getSignedUrl(this.client, command, {
            expiresIn: options.expiredIn || 900
        }) // default 15 minutes
        return {
            uploadUrl,
            key
        }
    }

    async finalizeUpload(key: string): Promise<UploadResult> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucket,
                Key: key
            })
            const result = await this.client.send(command)
            const url = await this.getUrl(key)
            return {
                url,
                key,
                provider: 'S3',
                metadata: result.Metadata
            }
        } catch (error) {
            logger.error(`S3 finalize upload error: ${error}`)
            throw new Error('Finalize upload failed')
        }
    }

    async initiateMultipartUpload(
        key: string,
        options: InitiateMultipartUploadOptions
    ): Promise<GenerateUploadUrlResult> {
        const command = new CreateMultipartUploadCommand({
            Bucket: this.bucket,
            Key: key,
            ACL: options.public ? 'public-read' : 'private',
            Metadata: options.metadata
        })
        const result = await this.client.send(command)
        if (!result.UploadId) {
            throw new InternalServerError(
                'Failed to initiate multipart upload',
                'S3MultipartUploadError'
            )
        }

        const response = {
            uploadUrl: result.UploadId, // The upload URLs for each part will be generated separately
            key
        }
        return response
    }

    async generateMultipartUploadPartUrls(
        key: string,
        uploadId: string,
        partNumber: number
    ): Promise<MultipartUploadPart> {
        const command = new UploadPartCommand({
            Bucket: this.bucket,
            Key: key,
            PartNumber: partNumber, // Placeholder, will be replaced in the loop
            UploadId: uploadId
        })

        const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 900 }) // 15 minutes

        return {
            partNumber,
            uploadUrl
        }
    }

    async completeMultipartUpload(options: CompleteMultipartUploadOptions): Promise<CompleteMultipartUploadResponse> {
        const command = new CompleteMultipartUploadCommand({
            Bucket: this.bucket,
            Key: options.key,
            UploadId: options.uploadId,
            MultipartUpload: {
                Parts: options.parts.map((part) => ({
                    ETag: part.ETag,
                    PartNumber: part.PartNumber
                }))
            }
        })

        await this.client.send(command)

        return {
            success: true,
            key: options.key
        }
    }

    private generateKey(options: UploadOptions): string {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(7)
        const fileName = options.fileName || `file-${timestamp}-${random}`
        return options.folder ? `${options.folder}/${fileName}` : fileName
    }
}

