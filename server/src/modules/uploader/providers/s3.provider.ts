import {
    S3Client,
    CreateMultipartUploadCommand,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { awsConfig } from '@/config'

import {
    IS3Uploader,
    PresignedUrlParams,
    PresignedUrlResult,
    MultipartParams,
    MultipartResult
} from '../uploader.types'

export class S3Uploader implements IS3Uploader {
    public provider = 'S3' as const
    private client: S3Client
    private buckets: Record<'public' | 'private', string>

    constructor() {
        this.client = new S3Client({
            region: awsConfig.s3.region,
            credentials: {
                accessKeyId: awsConfig.s3.accessKeyId,
                secretAccessKey: awsConfig.s3.secretAccessKey
            }
        })

        this.buckets = {
            public: awsConfig.s3.publicBucket,
            private: awsConfig.s3.privateBucket
        }
    }

    // Generates a pre-signed URL for direct browser upload
    async getPresignedUrl(params: PresignedUrlParams): Promise<PresignedUrlResult> {
        const { bucket, key, contentType, expiresIn = 900 } = params
        const bucketName = this.resolveBucket(bucket)

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType
        })

        const uploadUrl = await getSignedUrl(this.client, command, { expiresIn })

        // Public files get a direct URL, private files must use pre-signed GET later
        const fileUrl =
            bucket === 'public'
                ? `https://${bucketName}.s3.${awsConfig.s3.region}.amazonaws.com/${key}`
                : `private::${key}` // signal to caller this needs a pre-signed GET url

        return { uploadUrl, fileUrl, expiresIn }
    }

    // For large files — splits into multipart upload
    async generateMultipartUpload(params: MultipartParams): Promise<MultipartResult> {
        const { bucket, key, contentType } = params
        const bucketName = this.resolveBucket(bucket)

        const command = new CreateMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType
        })

        const response = await this.client.send(command)

        return {
            uploadId: response.UploadId!,
            key,
            bucket: bucketName
        }
    }

    async s3Stream(key: string): Promise<NodeJS.ReadableStream> {
        const bucketName = this.resolveBucket('private')

        const response = await this.client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: key
            })
        )

        return response.Body as NodeJS.ReadableStream
    }

    async deleteObjectFromS3(postId: string): Promise<boolean> {
        const bucketName = this.resolveBucket('private')

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: postId
        })
        const response = await this.client.send(command)

        return response.$metadata.httpStatusCode === 204
    }

    private resolveBucket(bucket: 'public' | 'private'): string {
        const resolved = this.buckets[bucket]
        if (!resolved) {
            throw new Error(`Bucket config missing for type: ${bucket}`)
        }
        return resolved
    }
}
