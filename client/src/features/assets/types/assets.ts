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

export interface Folders {
    id: string
    projectId: string
    parentId: string | null
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface Files {
    id: string
    name: string
    status: 'PENDING' | 'READY' | 'FAILED'
    projectId: string
    folderId: string | null
    s3Key: string
    assetUrl?: string
    mimeType:
        | 'image/jpeg'
        | 'image/png'
        | 'image/webp'
        | 'video/mp4'
        | 'video/quicktime'
        | 'video/webm'
        | 'application/pdf'
        | 'text/plain'
        | 'audio/mpeg'
        | 'audio/webm'
    sizeBytes: number
    createdAt: Date
    updatedAt: Date
}

export type AssetContextType = (Folders | Files) & {
    assetName: string
    workspaceId?: string
    parentAssetId: string | null
    type: 'FILE' | 'FOLDER'
    rename: (newName: string) => Promise<void>
    move: (targetParentId: string | null) => Promise<void>
    delete: () => Promise<void>
}

export interface GetContentsResponse {
    subfolders: Folders[]
    assets: Files[]
    breadcrumbs: {
        id: string
        name: string
    }[]
}
