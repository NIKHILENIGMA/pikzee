import z from 'zod'
import { ProjectIdParamSchema } from '../projects/project.validator'

export const CreateAssetSchema = z.object({
    projectId: z.uuid({ message: 'Project ID must be a valid UUID' }),
    folderId: z.uuid({ message: 'Folder ID must be a valid UUID' }).or(z.undefined()),
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

export const UpdateItemSchema = z.object({
    name: z.string().min(1).max(255).optional(), // For Rename
    folderId: z.uuid().nullable().optional(), // For Move Asset (null = move to root)
    parentId: z.uuid().nullable().optional(), // For Move Folder (null = move to root)
    isDeleted: z.boolean().optional() // For Soft Delete / Restore
})

export const RenameItemSchema = z.object({
    name: z.string().min(1).max(255)
})

export const MoveItemSchema = z.object({
    targetParentId: z.uuid().nullable()
})

export const AssetIdParamSchema = ProjectIdParamSchema.extend({
    assetId: z.uuid({ message: 'Asset ID must be a valid UUID' })
})

export const FolderIdParamSchema = ProjectIdParamSchema.extend({
    folderId: z.uuid({ message: 'Folder ID must be a valid UUID' })
})

export const GetFolderContentsQuerySchema = z.object({
    folderId: z.uuid({ message: 'Folder ID must be a valid UUID' }).or(z.undefined()).or(z.literal('null').transform(() => null))
})