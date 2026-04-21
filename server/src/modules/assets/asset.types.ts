import { assets } from '@/core/db/schema/asset.schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import z from 'zod'
import { CreateAssetSchema } from './asset.validator'

export const assetTypeEnum = z.enum(['FILE', 'FOLDER'])
export type AssetType = z.infer<typeof assetTypeEnum>
export const uploadStatusEnum = z.enum(['UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED'])
export type UploadStatus = z.infer<typeof uploadStatusEnum>
export const acceptedMimeTypeEnum = z.enum([
    'image/jpeg', // .jpg, .jpeg
    'image/png', // .png
    'image/webp', // .webp
    'video/mp4', // .mp4
    'video/quicktime', // .mov
    'video/webm', // .webm
    'application/pdf', // .pdf
    'text/plain', // .txt
    'audio/mpeg', // .mp3
    'audio/webm' // .webm
])
export type AcceptedMimeType = z.infer<typeof acceptedMimeTypeEnum>
export const acceptedFileTypeEnum = z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO'])
export type AcceptedFileType = z.infer<typeof acceptedFileTypeEnum>

export type AssetRecord = InferSelectModel<typeof assets>
export type CreateAssetRecord = InferInsertModel<typeof assets>

export interface AssetDTO {
    id: string
    projectId: string
    folderId: string
    name: string
    mimeType: AcceptedMimeType
    sizeBytes: number
    s3Key: string
    status: 'PENDING' | 'READY' | 'FAILED'
    createdAt: Date
    updatedAt: Date
}

export type CreateAssetDTO = z.infer<typeof CreateAssetSchema>
