import z from 'zod'

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

export const uploadStatusEnum = z.enum(['UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED'])
export type UploadStatus = z.infer<typeof uploadStatusEnum>

export type AssetContextType = {
    id: string
    assetName: string
    workspaceId: string
    createdAt: Date
    updatedAt: Date
    projectId: string
    parentAssetId: string | null
    type: 'FILE' | 'FOLDER'
    path: string
    depth: number
    mimeType: AcceptedMimeType | null
    s3Key: string | null
    imagekitPath: string | null
    fileSizeBytes: number | null
    fileType: AcceptedFileType | null
    thumbnailPath: string | null
    videoDurationSeconds: number | null
    uploadStatus: UploadStatus | null
    createdBy: string
}

