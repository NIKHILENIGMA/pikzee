import z from 'zod'
import { ProjectIdParamSchema } from '../projects/project.validator'

export const CreateAssetSchema = z.object({
    projectId: z.uuid({ message: 'Project ID must be a valid UUID' }),
    folderId: z.uuid({ message: 'Folder ID must be a valid UUID' }).or(z.undefined()).or(z.literal('null').transform(() => null)),
    filename: z.string().min(1, { message: 'Filename is required' }),
    mimeType: z.enum(
        [
            'image/jpeg',
            'image/png',
            'image/webp',
            'video/mp4',
            'video/quicktime',
            'video/webm',
            'application/pdf',
            'text/plain',
            'audio/mpeg',
            'audio/webm'
        ],
        { message: 'Invalid MIME type' }
    ),
    sizeBytes: z.number().min(0, { message: 'Size in bytes must be a positive number' })
})

export const ConfirmAssetUploadSchema = z.object({
    assetId: z.uuid({ message: 'Asset ID must be a valid UUID' })
})

export const CreateAssetQuerySchema = z.object({
    parentAssetId: z
        .uuid({ message: 'Parent Asset ID must be a valid UUID' })
        .or(z.undefined())
        .or(z.literal('null').transform(() => null))
})

export const RenameAssetSchema = z.object({
    newAssetName: z.string().min(1, { message: 'New asset name is required' })
})

export const AssetBatchOperationSchema = z.object({
    assetIds: z
        .array(z.string().min(1, 'Asset ID is required'))
        .min(1, 'At least one Asset ID is required'),
    targetParentId: z.string().nullable()
})

export const ListAssetsQuerySchema = z.object({
    parentAssetId: z.uuid({ message: 'Parent Asset ID must be a valid UUID' }).optional()
})

export const AssetIdParamSchema = ProjectIdParamSchema.extend({
    assetId: z.uuid({ message: 'Asset ID must be a valid UUID' })
})
